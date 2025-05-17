import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { commentService, Comment } from '../services/api/comments';
import { userService, User } from '../services/api/users';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CommentWithUser extends Comment {
    user?: User;
    replies?: CommentWithUser[];
    isLiked?: boolean;
}

type CommentsScreenRouteProp = RouteProp<RootStackParamList, 'Comments'>;

export const CommentsPage = () => {
    const [comments, setComments] = useState<CommentWithUser[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [replyingTo, setReplyingTo] = useState<CommentWithUser | null>(null);
    const route = useRoute<CommentsScreenRouteProp>();
    const navigation = useNavigation();
    const bookContentId = route.params.bookContentId;

    // Fonction pour sauvegarder l'état des likes
    const saveLikedComments = async (commentId: string, isLiked: boolean) => {
        try {
            const likedCommentsStr = await AsyncStorage.getItem('likedComments');
            const likedComments = likedCommentsStr ? JSON.parse(likedCommentsStr) : {};
            likedComments[commentId] = isLiked;
            await AsyncStorage.setItem('likedComments', JSON.stringify(likedComments));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des likes:', error);
        }
    };

    // Fonction pour charger l'état des likes
    const loadLikedComments = async (comments: CommentWithUser[]): Promise<CommentWithUser[]> => {
        try {
            const likedCommentsStr = await AsyncStorage.getItem('likedComments');
            const likedComments = likedCommentsStr ? JSON.parse(likedCommentsStr) : {};
            
            return comments.map(comment => ({
                ...comment,
                isLiked: likedComments[comment.id] || false,
                replies: comment.replies?.map(reply => ({
                    ...reply,
                    isLiked: likedComments[reply.id] || false
                }))
            }));
        } catch (error) {
            console.error('Erreur lors du chargement des likes:', error);
            return comments;
        }
    };

    useEffect(() => {
        loadComments();
    }, [bookContentId]);

    const loadComments = async () => {
        try {
            console.log('Chargement des commentaires pour bookContentId:', bookContentId);
            
            if (!bookContentId) {
                console.error('bookContentId manquant');
                setError('ID de contenu manquant');
                setLoading(false);
                return;
            }

            const response = await commentService.getCommentsByBookContent(bookContentId);
            console.log('Commentaires bruts reçus:', JSON.stringify(response, null, 2));

            const userDataStr = await AsyncStorage.getItem('userData');
            const currentUser = userDataStr ? JSON.parse(userDataStr) : null;
            console.log('Données utilisateur actuelles:', currentUser);

            const uniqueUserIds = new Set(response.map(comment => comment.user_id));
            console.log('IDs utilisateurs uniques:', Array.from(uniqueUserIds));

            const userPromises = Array.from(uniqueUserIds).map(async (userId) => {
                try {
                    const userResponse = await userService.getUserById(userId);
                    return { [userId]: userResponse };
                } catch (error) {
                    console.error(`Erreur lors de la récupération de l'utilisateur ${userId}:`, error);
                    return { [userId]: undefined };
                }
            });

            const userResults = await Promise.all(userPromises);
            const userMap: { [key: number]: User | undefined } = {};
            userResults.forEach(result => {
                Object.assign(userMap, result);
            });
            console.log('Map des utilisateurs:', userMap);

            const commentsWithUsers = response.map(comment => ({
                ...comment,
                user: userMap[comment.user_id] || currentUser,
                parentComment_id: (comment as any).parentcomment_id
            }));

            const mainComments = commentsWithUsers.filter(comment => {
                console.log('Vérification commentaire:', comment.id, 'parentComment_id:', comment.parentComment_id);
                return comment.parentComment_id === null;
            });

            const replies = commentsWithUsers.filter(comment => comment.parentComment_id !== null);

            const organizedComments = mainComments.map(comment => {
                const commentReplies = replies.filter(reply => 
                    Number(reply.parentComment_id) === Number(comment.id)
                );
                return {
                    ...comment,
                    replies: commentReplies
                };
            });

            // Charger l'état des likes pour tous les commentaires
            const commentsWithLikes = await loadLikedComments(organizedComments);
            setComments(commentsWithLikes);
        } catch (error) {
            console.error('Erreur lors du chargement des commentaires:', error);
            setError('Impossible de charger les commentaires. Veuillez réessayer plus tard.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            console.log('Tentative d\'ajout de commentaire');
            console.log('bookContentId reçu:', bookContentId);
            
            const bookContentIdNum = Number(bookContentId);
            if (isNaN(bookContentIdNum)) {
                console.error('bookContentId invalide:', bookContentId);
                Alert.alert('Erreur', 'ID de contenu invalide');
                return;
            }
            
            const userData = await AsyncStorage.getItem('userData');
            console.log('Données utilisateur récupérées:', userData);
            
            if (!userData) {
                console.error('Aucune donnée utilisateur trouvée dans AsyncStorage');
                Alert.alert('Erreur', 'Vous devez être connecté pour commenter');
                return;
            }
            
            const user = JSON.parse(userData);
            console.log('Données utilisateur parsées:', user);

            const commentData = {
                content: newComment,
                bookContent_id: bookContentIdNum,
                user_id: user.id,
                parentComment_id: replyingTo ? Number(replyingTo.id) : null,
                like: 0,
                visible: true
            };
            
            console.log('Données du commentaire à envoyer:', commentData);
            
            const response = await commentService.createComment(commentData);
            console.log('Commentaire créé avec succès:', response);
            
            // Ajouter le nouveau commentaire à la liste
            const newCommentWithUser = { ...response, user };
            
            if (replyingTo) {
                // Si c'est une réponse, l'ajouter aux réponses du commentaire parent
                setComments(prevComments => 
                    prevComments.map(comment => 
                        comment.id === replyingTo.id
                            ? { ...comment, replies: [...(comment.replies || []), newCommentWithUser] }
                            : comment
                    )
                );
            } else {
                // Si c'est un nouveau commentaire, l'ajouter à la liste principale
                setComments(prev => [...prev, newCommentWithUser]);
            }
            
            setNewComment('');
            setReplyingTo(null);
        } catch (error) {
            console.error('Erreur lors de l\'ajout du commentaire:', error);
            Alert.alert(
                'Erreur',
                'Impossible d\'ajouter le commentaire. Veuillez réessayer plus tard.'
            );
        }
    };

    const handleLike = async (commentId: string, currentLike: number, isLiked: boolean) => {
        try {
            const updatedComment = await commentService.likeComment(commentId, currentLike, isLiked);
            const newIsLiked = !isLiked;
            
            // Sauvegarder l'état du like
            await saveLikedComments(commentId, newIsLiked);
            
            setComments(prevComments => 
                prevComments.map(comment => {
                    if (comment.id === commentId) {
                        return { ...comment, like: updatedComment.like, isLiked: newIsLiked };
                    }
                    if (comment.replies) {
                        return {
                            ...comment,
                            replies: comment.replies.map(r => 
                                r.id === commentId
                                    ? { ...r, like: updatedComment.like, isLiked: newIsLiked }
                                    : r
                            )
                        };
                    }
                    return comment;
                })
            );
        } catch (error) {
            console.error('Erreur lors du like:', error);
            Alert.alert('Erreur', 'Impossible de liker le commentaire');
        }
    };

    const renderComment = ({ item }: { item: CommentWithUser }) => (
        <View style={styles.commentContainer}>
            <View style={styles.commentHeader}>
                <Text style={styles.username}>
                    {item.user?.username || 'Utilisateur inconnu'}
                </Text>
                <Text style={styles.commentDate}>
                    {new Date(item.createdat).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </Text>
            </View>
            <Text style={styles.commentContent}>{item.content}</Text>
            <View style={styles.commentActions}>
                <TouchableOpacity 
                    style={styles.replyButton}
                    onPress={() => setReplyingTo(item)}
                >
                    <Text style={styles.replyButtonText}>Répondre</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.likeButton}
                    onPress={() => handleLike(item.id, item.like, item.isLiked || false)}
                >
                    <Ionicons 
                        name={item.isLiked ? "heart" : "heart-outline"} 
                        size={20} 
                        color={item.isLiked ? "#007AFF" : "#666"} 
                    />
                    <Text style={[styles.likeCount, item.isLiked && styles.likedCount]}>{item.like}</Text>
                </TouchableOpacity>
            </View>
            
            {/* Afficher les réponses */}
            {item.replies && item.replies.length > 0 && (
                <View style={styles.repliesContainer}>
                    {item.replies.map(reply => (
                        <View key={reply.id} style={styles.replyContainer}>
                            <View style={styles.replyHeader}>
                                <Text style={styles.replyUsername}>
                                    {reply.user?.username || 'Utilisateur inconnu'}
                                </Text>
                                <Text style={styles.replyDate}>
                                    {new Date(reply.createdat).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                </Text>
                            </View>
                            <Text style={styles.replyContent}>{reply.content}</Text>
                            <View style={styles.replyActions}>
                                <TouchableOpacity 
                                    style={styles.likeButton}
                                    onPress={() => handleLike(reply.id, reply.like, reply.isLiked || false)}
                                >
                                    <Ionicons 
                                        name={reply.isLiked ? "heart" : "heart-outline"} 
                                        size={16} 
                                        color={reply.isLiked ? "#007AFF" : "#666"} 
                                    />
                                    <Text style={[styles.likeCount, reply.isLiked && styles.likedCount]}>{reply.like}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Commentaires</Text>
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity 
                        style={styles.retryButton}
                        onPress={loadComments}
                    >
                        <Text style={styles.retryButtonText}>Réessayer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Commentaires</Text>
            </View>

            <FlatList
                data={comments}
                renderItem={renderComment}
                keyExtractor={(item) => item.id}
                style={styles.commentsList}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Aucun commentaire pour le moment</Text>
                    </View>
                )}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newComment}
                    onChangeText={setNewComment}
                    placeholder={replyingTo ? "Écrire une réponse..." : "Ajouter un commentaire..."}
                    multiline
                />
                {replyingTo && (
                    <View style={styles.replyingToContainer}>
                        <Text style={styles.replyingToText}>
                            Répondre à {replyingTo.user?.username || 'Utilisateur inconnu'}
                        </Text>
                        <TouchableOpacity onPress={() => setReplyingTo(null)}>
                            <Ionicons name="close-circle" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>
                )}
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleAddComment}
                >
                    <Ionicons name="send" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    commentsList: {
        flex: 1,
    },
    commentContainer: {
        padding: 16,
        backgroundColor: '#f8f9fa',
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    username: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    commentContent: {
        fontSize: 16,
        color: '#333',
    },
    commentDate: {
        fontSize: 12,
        color: '#666',
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
        alignItems: 'flex-end',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: '#007AFF',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
        textAlign: 'center',
    },
    replyButton: {
        marginTop: 8,
        padding: 4,
    },
    replyButtonText: {
        color: '#007AFF',
        fontSize: 14,
    },
    repliesContainer: {
        marginLeft: 16,
        marginTop: 8,
    },
    replyContainer: {
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    replyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    replyUsername: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    replyDate: {
        fontSize: 11,
        color: '#666',
    },
    replyContent: {
        fontSize: 14,
        color: '#333',
    },
    replyingToContainer: {
        position: 'absolute',
        top: -30,
        left: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f0f0f0',
        padding: 8,
        borderRadius: 8,
    },
    replyingToText: {
        fontSize: 14,
        color: '#666',
    },
    commentActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
    },
    likeCount: {
        marginLeft: 4,
        color: '#666',
        fontSize: 14,
    },
    likedCount: {
        color: '#007AFF',
    },
    replyActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 4,
    },
}); 