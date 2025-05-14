import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { bookService, Book } from '../services/api/books';
import { API_CONFIG } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type MyBooksNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Fonction utilitaire pour décoder le token JWT
const decodeToken = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
        return null;
    }
};

const MyBooks: React.FC = () => {
    const navigation = useNavigation<MyBooksNavigationProp>();
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            // Récupérer le token
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                throw new Error('Non authentifié');
            }

            // Décoder le token pour obtenir l'ID utilisateur
            const decodedToken = decodeToken(token);
            if (!decodedToken || !decodedToken.id) {
                throw new Error('Token invalide');
            }

            const userId = decodedToken.id;
            console.log('ID utilisateur extrait du token:', userId);

            // Récupérer tous les livres
            const data = await bookService.getAll();
            console.log('Tous les livres récupérés:', data);

            // Filtrer les livres par user_id
            const userBooks = data.filter((book: any) => book.user_id === userId);
            console.log('Livres filtrés pour l\'utilisateur:', userBooks);

            const formattedBooks = userBooks.map((book: any) => ({
                ...book,
                coverimage: book.cover && book.cover !== ''
                    ? `${API_CONFIG.imageBaseURL}${API_CONFIG.staticPath}${book.cover}`
                    : undefined
            }));

            setBooks(formattedBooks);
            setError(null);
        } catch (err: any) {
            console.error('Erreur lors du chargement des livres:', err);
            if (err.message === 'Non authentifié') {
                setError('Vous devez être connecté pour voir vos livres');
            } else if (err.message === 'Token invalide') {
                setError('Session invalide, veuillez vous reconnecter');
            } else {
                setError('Erreur lors du chargement des livres');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleDeleteBook = async (bookId: string) => {
        try {
            // Vérifier si le livre appartient à l'utilisateur
            const bookToDelete = books.find(book => book.id.toString() === bookId);
            if (!bookToDelete) {
                throw new Error('Livre non trouvé');
            }

            // Récupérer le token
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                throw new Error('Non authentifié');
            }

            // Décoder le token pour vérifier l'ID utilisateur
            const decodedToken = decodeToken(token);
            if (!decodedToken || !decodedToken.id) {
                throw new Error('Token invalide');
            }

            // Vérifier si l'utilisateur est propriétaire du livre
            if (bookToDelete.user_id !== decodedToken.id) {
                throw new Error('Non autorisé à supprimer ce livre');
            }

            Alert.alert(
                'Confirmer la suppression',
                'Êtes-vous sûr de vouloir supprimer ce livre ? Cette action est irréversible.',
                [
                    {
                        text: 'Annuler',
                        style: 'cancel'
                    },
                    {
                        text: 'Supprimer',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                await bookService.delete(bookId);
                                setBooks(books.filter(book => book.id.toString() !== bookId));
                                Alert.alert('Succès', 'Le livre a été supprimé avec succès');
                            } catch (err: any) {
                                console.error('Erreur lors de la suppression:', err);
                                if (err.message.includes('Session expirée')) {
                                    Alert.alert(
                                        'Session expirée',
                                        'Votre session a expiré. Veuillez vous reconnecter.',
                                        [
                                            {
                                                text: 'OK',
                                                onPress: () => navigation.navigate('Auth')
                                            }
                                        ]
                                    );
                                } else if (err.message.includes('Non autorisé')) {
                                    Alert.alert(
                                        'Action non autorisée',
                                        'Vous n\'êtes pas autorisé à supprimer ce livre.',
                                        [
                                            {
                                                text: 'OK',
                                                style: 'cancel'
                                            }
                                        ]
                                    );
                                } else {
                                    Alert.alert(
                                        'Erreur',
                                        'Une erreur est survenue lors de la suppression du livre. Veuillez réessayer.'
                                    );
                                }
                            }
                        }
                    }
                ]
            );
        } catch (err: any) {
            console.error('Erreur lors de la vérification des droits:', err);
            Alert.alert(
                'Erreur',
                err.message || 'Une erreur est survenue lors de la vérification des droits.'
            );
        }
    };

    const renderBookItem = ({ item }: { item: Book }) => (
        <View style={styles.bookCard}>
            <View style={styles.bookInfo}>
                {item.coverimage ? (
                    <Image
                        source={{ uri: item.coverimage }}
                        style={styles.bookCover}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.placeholderCover}>
                        <Ionicons name="book-outline" size={40} color="#666" />
                    </View>
                )}
                <View style={styles.bookDetails}>
                    <Text style={styles.bookTitle}>{item.title}</Text>
                </View>
            </View>
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => navigation.navigate('OeuvrePage', { id: item.id.toString() })}
                >
                    <Ionicons name="create-outline" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteBook(item.id.toString())}
                >
                    <Ionicons name="trash-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.header}>Mes Œuvres</Text>

            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}

            {loading ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Chargement...</Text>
                </View>
            ) : (
                <FlatList
                    data={books}
                    renderItem={renderBookItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>
                            Vous n'avez pas encore créé de livres
                        </Text>
                    }
                />
            )}
        </View>
    );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#A020F0',
        padding: 20,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
    },
    header: {
        fontSize: 26,
        color: '#fff',
        fontWeight: 'bold',
        marginTop: 60,
        marginBottom: 20,
        textAlign: 'center',
    },
    listContainer: {
        paddingTop: 20,
    },
    bookCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    bookInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    bookCover: {
        width: 60,
        height: 80,
        borderRadius: 8,
    },
    placeholderCover: {
        width: 60,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bookDetails: {
        marginLeft: 15,
        flex: 1,
    },
    bookTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: '#4CAF50',
    },
    deleteButton: {
        backgroundColor: '#f44336',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        fontSize: 16,
    },
    errorText: {
        color: '#ff6b6b',
        textAlign: 'center',
        marginTop: 20,
    },
    emptyText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        marginTop: 40,
    },
});

export default MyBooks; 