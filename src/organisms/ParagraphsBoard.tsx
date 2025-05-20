import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert, TextInput, FlatList } from 'react-native';
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
import { bookService } from '../services/api/books';
import { chapterService } from '../services/api/chapters';

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
  const [bookType, setBookType] = useState<number | null>(null);
  const [isLoadingBookType, setIsLoadingBookType] = useState(true);
  const [bookTypeError, setBookTypeError] = useState<string | null>(null);

  // Déterminer la source en fonction de la route précédente
  const source = route.params.fromMyBooks ? 'myBooks' : 'reading';

  useEffect(() => {
    const fetchBookType = async () => {
      try {
        setIsLoadingBookType(true);
        setBookTypeError(null);
        
        // Récupérer d'abord le chapitre
        const chapter = await chapterService.getById(chapterId);

        if (!chapter) {
          throw new Error('Impossible de récupérer les informations du chapitre');
        }

        // Vérifier si nous avons l'ID du livre
        const bookIdFromChapter = chapter.book_id || chapter.bookId;
        if (!bookIdFromChapter) {
          throw new Error('ID du livre non trouvé dans le chapitre');
        }

        // Ensuite récupérer le livre avec l'ID du livre du chapitre
        const book = await bookService.getById(bookIdFromChapter.toString());

        if (!book) {
          throw new Error('Impossible de récupérer les informations du livre');
        }

        setBookType(book.booktype_id);
      } catch (err) {
        console.error('Erreur lors de la récupération du type de livre:', err);
        setBookTypeError(err instanceof Error ? err.message : 'Erreur lors de la récupération du type de livre');
      } finally {
        setIsLoadingBookType(false);
      }
    };
    fetchBookType();
  }, [chapterId]);

  const goToComments = (bookContentId: string) => {
    navigation.navigate('Comments', {
      bookContentId
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

  const handleAddContent = async () => {
    try {
      // Trouver le plus grand ordre existant
      const maxOrder = paragraphs.reduce((max, paragraph) => 
        Math.max(max, (paragraph as any).order || 0), 0);

      if (bookType === 4) {
        // Si c'est un type 4, on affiche le sélecteur d'image
        await handleAddImage();
      } else {
        // Sinon, on crée un paragraphe texte normal
        const defaultContent = 'Commencez à écrire votre histoire...';
        await createBookContent(parseInt(chapterId), defaultContent, maxOrder + 1);
        await refresh();
        Alert.alert('Succès', 'Un nouveau paragraphe a été créé. Vous pouvez maintenant le modifier.');
      }
    } catch (err: unknown) {
      console.error('Erreur lors de la création du contenu:', err);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la création du contenu');
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

        const imageUri = asset.uri;
        const imageName = imageUri.split('/').pop() || `image_${Date.now()}.jpg`;
        const imageType = 'image/jpeg';

        // Créer l'objet fichier pour FormData
        const imageFile = {
          uri: imageUri,
          type: imageType,
          name: imageName
        } as any;

        formData.append('image', imageFile);

        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error('Non authentifié. Veuillez vous reconnecter.');
        }

        const uploadResponse = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.paragraphs.create}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          body: formData
        });

        const responseText = await uploadResponse.text();

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

  const handleUpdateImage = async (paragraphId: number, newImageUri: string) => {
    try {
      // Trouver le paragraphe existant pour récupérer son ordre
      const existingParagraph = paragraphs.find(p => p.id === paragraphId) as Paragraph;
      if (!existingParagraph) {
        throw new Error('Paragraphe non trouvé');
      }

      // Créer le FormData
      const formData = new FormData();
      formData.append('content', '');
      formData.append('chapter_id', chapterId);
      formData.append('type', 'image');
      formData.append('order', existingParagraph.order.toString());

      const imageName = newImageUri.split('/').pop() || `image_${Date.now()}.jpg`;
      const imageType = 'image/jpeg';

      // Créer l'objet fichier pour FormData
      const imageFile = {
        uri: newImageUri,
        type: imageType,
        name: imageName
      } as any;

      formData.append('image', imageFile);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Non authentifié. Veuillez vous reconnecter.');
      }

      const requestUrl = `${API_CONFIG.baseURL}/bookcontents/${paragraphId}`;

      const uploadResponse = await fetch(requestUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData
      });

      const responseText = await uploadResponse.text();

      if (!uploadResponse.ok) {
        throw new Error(`Erreur ${uploadResponse.status}: ${responseText}`);
      }

      // Attendre un peu avant de rafraîchir
      await new Promise(resolve => setTimeout(resolve, 500));
      await refresh();
      Alert.alert('Succès', 'L\'image a été mise à jour avec succès');
    } catch (err) {
      console.error('Erreur détaillée lors de la mise à jour de l\'image:', err);
      Alert.alert(
        'Erreur',
        err instanceof Error ? err.message : 'Une erreur est survenue lors de la mise à jour de l\'image'
      );
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.paragraphContainer}>
        <ParagraphCard
          content={item.content}
          type={item.type}
          onPress={() => {
            if (source === 'myBooks') {
              setEditingParagraphId(item.id);
              setEditedContent(item.content);
            }
          }}
        />
      </View>
    );
  };

  if (loading || isLoadingBookType) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size={36} color="#fff" />
      </View>
    );
  }

  if (error || bookTypeError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error || bookTypeError}</Text>
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

      <ScrollView style={styles.scrollContainer}>
        {paragraphs.length > 0 ? (
          <>
            <FlatList
              data={paragraphs}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.paragraphsList}
            />
            {source === 'myBooks' && (
              <TouchableOpacity
                style={styles.addContentButton}
                onPress={handleAddContent}
              >
                <Ionicons name="add-circle-outline" size={24} color="white" />
                <Text style={styles.addContentButtonText}>Ajouter du contenu</Text>
              </TouchableOpacity>
            )}
          </>
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
    marginVertical: 8,
  },
  paragraphsList: {
    paddingBottom: 20,
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