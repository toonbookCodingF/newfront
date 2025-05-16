import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { ParagraphCard } from '../atoms/ParagraphCard';
import { useParagraphs } from '../hooks/useParagraphs';
import { useUpdateChapter } from '../hooks/useUpdateChapter';
import { useDeleteContent } from '../hooks/useDeleteContent';
import { useCreateChapter } from '../hooks/useCreateChapter';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, ENDPOINTS } from '../config/api';

type ParagraphsBoardNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ParagraphsRouteProp = RouteProp<RootStackParamList, 'Paragraphs'>;

interface Paragraph {
  id: number;
  content: string;
  type: string;
  order: number;
  chapter_id: number;
  createdat: string;
}

interface ParagraphsBoardProps {
  chapterId: string;
  bookId: string;
  chapterTitle: string;
  bookTitle: string;
}

export const ParagraphsBoard: React.FC<ParagraphsBoardProps> = ({
  chapterId,
  bookId,
  chapterTitle,
  bookTitle,
}) => {
  const navigation = useNavigation<ParagraphsBoardNavigationProp>();
  const route = useRoute<ParagraphsRouteProp>();
  const { paragraphs, loading, error, refresh } = useParagraphs(chapterId);
  const { updateChapter, updateContent, isLoading: isUpdating } = useUpdateChapter();
  const { deleteContent, isLoading: isDeleting } = useDeleteContent();
  const { createBookContent } = useCreateChapter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(chapterTitle);
  const [editingParagraphId, setEditingParagraphId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState('');

  // Déterminer la source en fonction de la route précédente
  const source = route.params.fromMyBooks ? 'myBooks' : 'reading';

  const goToComments = () => {
    navigation.navigate('Comments', {
      chapterId,
      bookId,
      chapterTitle,
      bookTitle
    });
  };

  const handleUpdateChapter = async () => {
    try {
      if (!editedTitle.trim()) {
        Alert.alert('Erreur', 'Le titre du chapitre est requis');
        return;
      }

      await updateChapter(parseInt(chapterId), { title: editedTitle });
      Alert.alert('Succès', 'Le chapitre a été mis à jour avec succès');
      setIsEditing(false);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du chapitre:', err);
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Une erreur est survenue lors de la mise à jour');
    }
  };

  const handleUpdateContent = async (paragraphId: number) => {
    try {
      if (!editedContent.trim()) {
        Alert.alert('Erreur', 'Le contenu ne peut pas être vide');
        return;
      }

      await updateContent(paragraphId, { content: editedContent });
      Alert.alert('Succès', 'Le contenu a été mis à jour avec succès');
      setEditingParagraphId(null);
      setEditedContent('');
    } catch (err) {
      console.error('Erreur lors de la mise à jour du contenu:', err);
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Une erreur est survenue lors de la mise à jour');
    }
  };

  const startEditingContent = (paragraph: any) => {
    setEditingParagraphId(paragraph.id);
    setEditedContent(paragraph.content);
  };

  const handleDeleteContent = async (paragraphId: number) => {
    try {
      Alert.alert(
        'Confirmer la suppression',
        'Êtes-vous sûr de vouloir supprimer ce contenu ? Cette action est irréversible.',
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
                await deleteContent(paragraphId);
                await refresh(); // Rafraîchir la liste des paragraphes
                Alert.alert('Succès', 'Le contenu a été supprimé avec succès');
              } catch (err) {
                console.error('Erreur lors de la suppression:', err);
                Alert.alert(
                  'Erreur',
                  err instanceof Error ? err.message : 'Une erreur est survenue lors de la suppression'
                );
              }
            }
          }
        ]
      );
    } catch (err) {
      console.error('Erreur lors de la confirmation de suppression:', err);
      Alert.alert(
        'Erreur',
        err instanceof Error ? err.message : 'Une erreur est survenue lors de la confirmation'
      );
    }
  };

  const handleAddImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission requise',
          'Désolé, nous avons besoin de l\'accès à votre galerie pour télécharger des images.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        presentationStyle: ImagePicker.UIImagePickerPresentationStyle.FULL_SCREEN,
      });

      if (!result.canceled) {
        console.log('Image sélectionnée:', result.assets[0]);
        const asset = result.assets[0];

        // Trouver le plus grand ordre existant
        const maxOrder = paragraphs.reduce((max, paragraph) =>
          Math.max(max, (paragraph as any).order || 0), 0);

        // Créer le FormData
        const formData = new FormData();
        formData.append('content', '');
        formData.append('chapter_id', chapterId);
        formData.append('type', 'image');
        formData.append('order', (maxOrder + 1).toString());

        // Modifier la façon dont nous ajoutons l'image
        const imageUri = asset.uri;
        const imageName = imageUri.split('/').pop() || `image_${Date.now()}.jpg`;
        const imageType = 'image/jpeg';

        formData.append('image', {
          uri: imageUri,
          type: imageType,
          name: imageName
        } as any);

        console.log('FormData créé avec les champs:', {
          content: '',
          chapter_id: chapterId,
          type: 'image',
          order: (maxOrder + 1).toString(),
          image: {
            uri: imageUri,
            type: imageType,
            name: imageName
          }
        });

        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error('Non authentifié. Veuillez vous reconnecter.');
        }

        console.log('Envoi de la requête à:', `${API_CONFIG.baseURL}${ENDPOINTS.paragraphs.create}`);

        // Ajouter un délai pour éviter les requêtes simultanées
        await new Promise(resolve => setTimeout(resolve, 1000));

        const uploadResponse = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.paragraphs.create}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          body: formData
        });

        console.log('Statut de la réponse:', uploadResponse.status);
        const responseText = await uploadResponse.text();
        console.log('Contenu de la réponse:', responseText);

        if (!uploadResponse.ok) {
          throw new Error(`Erreur ${uploadResponse.status}: ${responseText}`);
        }

        // Attendre un peu avant de rafraîchir
        await new Promise(resolve => setTimeout(resolve, 500));
        await refresh();
        Alert.alert('Succès', 'L\'image a été ajoutée avec succès');
      }
    } catch (err) {
      console.error('Erreur détaillée lors de l\'ajout de l\'image:', err);
      Alert.alert(
        'Erreur',
        err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'ajout de l\'image'
      );
    }
  };

  const handleAddContent = async () => {
    try {
      const defaultContent = 'Commencez à écrire votre histoire...';
      await createBookContent(parseInt(chapterId), defaultContent);
      await refresh();
      Alert.alert('Succès', 'Un nouveau paragraphe a été créé. Vous pouvez maintenant le modifier.');
    } catch (err: unknown) {
      console.error('Erreur lors de la création du paragraphe:', err);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la création du paragraphe');
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size={36} color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {isEditing ? (
          <View style={styles.editTitleContainer}>
            <TextInput
              style={styles.editTitleInput}
              value={editedTitle}
              onChangeText={setEditedTitle}
              placeholder="Titre du chapitre"
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity onPress={handleUpdateChapter} disabled={isUpdating}>
              <Ionicons name="checkmark" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsEditing(false)}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{chapterTitle} - {bookTitle}</Text>
            {source === 'myBooks' && (
              <View style={styles.headerButtons}>
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Ionicons name="create-outline" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAddImage} style={styles.addImageButton}>
                  <Ionicons name="image-outline" size={20} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {paragraphs.length > 0 ? (
          paragraphs.map((paragraph) => (
            <View key={paragraph.id}>
              {editingParagraphId === paragraph.id ? (
                <View style={styles.editContentContainer}>
                  <TextInput
                    style={styles.editContentInput}
                    value={editedContent}
                    onChangeText={setEditedContent}
                    multiline
                    placeholder="Contenu du paragraphe"
                    placeholderTextColor="#aaa"
                  />
                  <View style={styles.editContentButtons}>
                    <TouchableOpacity
                      onPress={() => handleUpdateContent(paragraph.id)}
                      disabled={isUpdating}
                      style={styles.editButton}
                    >
                      <Ionicons name="checkmark" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setEditingParagraphId(null);
                        setEditedContent('');
                      }}
                      style={styles.editButton}
                    >
                      <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.paragraphContainer}>
                  <ParagraphCard
                    content={paragraph.content}
                    type={paragraph.type}
                    onCommentPress={() => goToComments()}
                    source={source}
                    onEditPress={source === 'myBooks' ? () => startEditingContent(paragraph) : undefined}
                    onDeletePress={source === 'myBooks' ? () => handleDeleteContent(paragraph.id) : undefined}
                  />
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={styles.noContentContainer}>
            <Text style={styles.noParagraphs}>Aucun contenu disponible.</Text>
            {source === 'myBooks' && (
              <TouchableOpacity
                style={styles.addContentButton}
                onPress={handleAddContent}
              >
                <Ionicons name="add-circle-outline" size={24} color="white" />
                <Text style={styles.addContentButtonText}>Ajouter du contenu</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A020F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#800080',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  editTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  editTitleInput: {
    flex: 1,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 50,
    paddingTop: 20,
  },
  noContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noParagraphs: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A020F0',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
  paragraphContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  editParagraphButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 15,
  },
  editContentContainer: {
    backgroundColor: '#800080',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  editContentInput: {
    color: 'white',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  editContentButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 5,
    borderRadius: 15,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  addImageButton: {
    marginLeft: 10,
  },
  addContentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A020F0',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  addContentButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
}); 