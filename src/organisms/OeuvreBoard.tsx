import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { BookCover } from '../molecules/BookCover';
import { ChapterButton } from '../atoms/ChapterButton';
import { useOeuvre } from '../hooks/useOeuvre';
import { useUpdateBook } from '../hooks/useUpdateBook';
import { useMyReading } from '../hooks/useMyReading';
import { ImageUploader } from '../molecules/ImageUploader';
import { FormInput } from '../atoms/FormInput';
import { CategoryPicker } from '../atoms/CategoryPicker';
import { Ionicons } from '@expo/vector-icons';
import { API_CONFIG, ENDPOINTS } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { myReadingsService } from '../services/api/myreadings';
import { userService } from '../services/api/users';

type OeuvreBoardNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Category {
  id: number;
  namecategory: string;
}

interface OeuvreBoardProps {
  id: string;
  fromMyBooks?: boolean;
}

export const OeuvreBoard: React.FC<OeuvreBoardProps> = ({ id, fromMyBooks = false }) => {
  const navigation = useNavigation<OeuvreBoardNavigationProp>();
  const { book, chapters, loading, error, refetch } = useOeuvre(id);
  const { updateBook, isLoading: isUpdating } = useUpdateBook();
  const { createMyReading } = useMyReading();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [cover, setCover] = useState<any>(null);
  const [tempCoverPreview, setTempCoverPreview] = useState<string | undefined>(undefined);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const readingCreatedRef = useRef(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [readingId, setReadingId] = useState<number | null>(null);
  const [author, setAuthor] = useState<string>('');
  const [authorError, setAuthorError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Recharger les données quand on revient sur la page
  useFocusEffect(
    React.useCallback(() => {
      refetch();
      if (!fromMyBooks) {
        checkReadingStatus();
      }
    }, [refetch])
  );

  const checkReadingStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.id;

      const readings = await myReadingsService.getByUser(userId);
      const reading = readings.find(r => r.book_id === parseInt(id));
      if (reading) {
        setReadingId(reading.id);
        setIsFavorite(reading.isverified);
      }
    } catch (error) {
      setGeneralError('Erreur lors de la vérification du statut');
    }
  };

  const toggleFavorite = async () => {
    if (!readingId) return;
    try {
      await myReadingsService.changeVerified(readingId);
      setIsFavorite(!isFavorite);
    } catch (error) {
      setGeneralError('Erreur lors de la mise à jour du favori');
    }
  };

  // Charger les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.categories.getAll}`);
        const data = await response.json();
        setCategories(data.data || []);
      } catch (error) {
        setGeneralError('Erreur lors du chargement des catégories');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Charger les informations de l'auteur
  useEffect(() => {
    const loadAuthor = async () => {
      if (book?.user_id) {
        try {
          const userData = await userService.getUserById(book.user_id);
          setAuthor(userData.username);
        } catch (error) {
          setAuthorError('Erreur lors du chargement de l\'auteur');
        }
      }
    };

    loadAuthor();
  }, [book]);

  // Initialiser les champs quand le livre est chargé
  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setDescription(book.description);
      setCategory(book.category_id?.toString() || '');
      setTempCoverPreview(book.coverimage);
    }
  }, [book]);

  // Créer une lecture si le livre est ouvert depuis une page autre que MyBooks
  useEffect(() => {
    let isMounted = true;
    const createReading = async () => {
      if (!fromMyBooks && book && isMounted) {
        try {
          const reading = await createMyReading(parseInt(id));
          if (reading) {
            setReadingId(reading.id);
            setIsFavorite(reading.isverified);
          }
        } catch (err) {
          setGeneralError('Erreur lors de la création de la lecture');
        }
      }
    };

    createReading();
    return () => {
      isMounted = false;
    };
  }, [fromMyBooks, book]);

  // Vérifier le statut de la lecture
  useEffect(() => {
    if (!fromMyBooks && book) {
      checkReadingStatus();
    }
  }, [book]);

  // Mettre à jour l'aperçu quand une nouvelle couverture est sélectionnée
  const handleCoverChange = (newCover: any) => {
    setCover(newCover);
    if (newCover && typeof newCover === 'object') {
      // Utiliser directement l'URI de l'image
      setTempCoverPreview(newCover.uri);
    } else {
      setTempCoverPreview(undefined);
    }
  };

  const handleUpdate = async () => {
    try {
      if (!title.trim()) {
        Alert.alert('Erreur', 'Le titre est requis');
        return;
      }

      const updateData = {
        title,
        description,
        category_id: parseInt(category),
        coverimage: cover,
      };

      await updateBook(id, updateData);
      setTempCoverPreview(undefined);
      Alert.alert('Succès', 'Le livre a été mis à jour avec succès');
      setIsEditing(false);
    } catch (err) {
      setGeneralError('Une erreur est survenue lors de la mise à jour');
    }
  };

  const goToParagraphs = (chapterId: number, chapterTitle: string) => {
    navigation.navigate('Paragraphs', {
      chapterId: chapterId.toString(),
      bookId: id,
      chapterTitle,
      bookTitle: book?.title || '',
      fromMyBooks
    });
  };

  const handleAddChapter = () => {
    // Trouver l'ordre maximum existant
    const maxOrder = chapters.reduce((max, chapter) => Math.max(max, chapter.order || 0), 0);
    
    // Créer un Set des ordres déjà utilisés
    const usedOrders = new Set(chapters.map(chapter => chapter.order || 0));
    
    // Trouver le prochain ordre disponible
    let nextOrder = maxOrder + 1;
    while (usedOrders.has(nextOrder)) {
      nextOrder++;
    }

    // Vérifier le type de livre
    if (book?.booktype_id === 4) { // Type graphique
      navigation.navigate('UploadeOeuvreGraph', {
        bookId: id,
        nextOrder
      });
    } else if (book?.booktype_id === 1) { // Type littéraire
      navigation.navigate('CreateChapterPage', {
        bookId: id,
        nextOrder
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size={36} color="#fff" />
      </View>
    );
  }

  if (generalError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{generalError}</Text>
      </View>
    );
  }

  if (!book) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Livre non trouvé</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!fromMyBooks && readingId && (
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={toggleFavorite}
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite ? "#ff4444" : "#fff"} 
          />
        </TouchableOpacity>
      )}
      {isEditing ? (
        <ScrollView contentContainerStyle={styles.content}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(false)}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>

          <FormInput
            label="Titre"
            value={title}
            onChangeText={setTitle}
            placeholder="Entrez le titre"
            containerStyle={styles.inputContainer}
            labelStyle={styles.label}
            inputStyle={styles.input}
          />

          <FormInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Entrez la description"
            multiline
            numberOfLines={4}
            containerStyle={styles.inputContainer}
            labelStyle={styles.label}
            inputStyle={styles.input}
          />

          <CategoryPicker
            label="Catégorie"
            value={category}
            onValueChange={setCategory}
            categories={categories}
            loading={loadingCategories}
          />

          <ImageUploader
            cover={tempCoverPreview}
            onCoverChange={handleCoverChange}
            uploading={uploading}
            onUploadingChange={setUploading}
          />

          <TouchableOpacity
            style={[styles.updateButton, (isUpdating || uploading) && styles.updateButtonDisabled]}
            onPress={handleUpdate}
            disabled={isUpdating || uploading}
          >
            <Text style={styles.updateButtonText}>
              {isUpdating ? 'Mise à jour en cours...' : 'Enregistrer les modifications'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <>
          {fromMyBooks && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Ionicons name="create-outline" size={24} color="#fff" />
            </TouchableOpacity>
          )}

          <BookCover cover={tempCoverPreview || book?.coverimage} />
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{book?.title}</Text>
            {author && <Text style={styles.author}>Par {author}</Text>}
            <Text style={styles.description}>{book?.description}</Text>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.chapterHeader}>Chapitres</Text>

            {chapters.length > 0 ? (
              <>
                {chapters.map((chapter) => (
                <ChapterButton
                  key={chapter.id}
                  title={chapter.title}
                  onPress={() => goToParagraphs(chapter.id, chapter.title)}
                />
                ))}
                {fromMyBooks && (
                  <TouchableOpacity
                    style={styles.addChapterButton}
                    onPress={handleAddChapter}
                  >
                    <Ionicons name="add-circle-outline" size={24} color="white" />
                    <Text style={styles.addChapterButtonText}>Ajouter un chapitre</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <Text style={styles.noChapters}>Aucun chapitre disponible.</Text>
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A020F0',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: '#fff',
  },
  author: {
    fontSize: 16,
    color: '#f5f5f5',
    textAlign: 'center',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  description: {
    fontSize: 16,
    color: '#f5f5f5',
    marginBottom: 25,
    textAlign: 'justify',
    lineHeight: 22,
  },
  chapterHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  noChapters: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
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
  editButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: 8,
    padding: 10,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  updateButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addChapterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A020F0',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    marginHorizontal: 20,
  },
  addChapterButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
}); 