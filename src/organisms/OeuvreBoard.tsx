import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { BookCover } from '../molecules/BookCover';
import { ChapterButton } from '../atoms/ChapterButton';
import { useOeuvre } from '../hooks/useOeuvre';
import { useUpdateBook } from '../hooks/useUpdateBook';
import { ImageUploader } from '../molecules/ImageUploader';
import { FormInput } from '../atoms/FormInput';
import { CategoryPicker } from '../atoms/CategoryPicker';
import { Ionicons } from '@expo/vector-icons';
import { API_CONFIG, ENDPOINTS } from '../config/api';

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
  const { book, chapters, loading, error } = useOeuvre(id);
  const { updateBook, isLoading: isUpdating } = useUpdateBook();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [cover, setCover] = useState<any>(null);
  const [tempCoverPreview, setTempCoverPreview] = useState<string | undefined>(undefined);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Charger les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.categories.getAll}`);
        const data = await response.json();
        setCategories(data.data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Initialiser les champs quand le livre est chargé
  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setDescription(book.description);
      setCategory(book.category_id?.toString() || '');
      setTempCoverPreview(book.coverimage);
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
      // Réinitialiser l'aperçu temporaire après la mise à jour
      setTempCoverPreview(undefined);
      Alert.alert('Succès', 'Le livre a été mis à jour avec succès');
      setIsEditing(false);
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Une erreur est survenue lors de la mise à jour');
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

  if (!book) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Livre non trouvé</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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

          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>{book.title}</Text>

            <Text style={styles.description}>
              {book.description || 'Aucune description disponible pour ce livre.'}
            </Text>

            <Text style={styles.chapterHeader}>Chapitres</Text>

            {chapters.length > 0 ? (
              chapters.map((chapter) => (
                <ChapterButton
                  key={chapter.id}
                  title={chapter.title}
                  onPress={() => goToParagraphs(chapter.id, chapter.title)}
                />
              ))
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
}); 