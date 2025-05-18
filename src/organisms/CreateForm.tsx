import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useNavigation as useRootNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList, LibraryStackParamList, RootStackParamList } from '../navigation/types';
import { FormInput } from '../atoms/FormInput';
import { CategoryPicker } from '../atoms/CategoryPicker';
import { ImageUploader } from '../molecules/ImageUploader';
import { WorkTypeSelector } from '../molecules/WorkTypeSelector';
import { Ionicons } from '@expo/vector-icons';
import { useCreateBook } from '../hooks/useCreateBook';
import { API_CONFIG } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCreateChapter } from '../hooks/useCreateChapter';

type CreateFormNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Library'>,
  NativeStackNavigationProp<LibraryStackParamList>
>;

interface Category {
  id: number;
  namecategory: string;
}

interface CreateFormProps {
  onBack: () => void;
}

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

export const CreateForm: React.FC<CreateFormProps> = ({ onBack }) => {
  const navigation = useNavigation<CreateFormNavigationProp>();
  const rootNavigation = useRootNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [type, setType] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { categories, bookType, loading, fetchBookType, handleSubmit } = useCreateBook();
  const { createChapter, createBookContent } = useCreateChapter();

  useEffect(() => {
    if (type === null) return;
    fetchBookType(type);
  }, [type]);

  const validateForm = () => {
    if (!title.trim()) {
      setError('Le titre est requis');
      return false;
    }
    if (!category) {
      setError('La catégorie est requise');
      return false;
    }
    if (type === null) {
      setError('Le type d\'œuvre est requis');
      return false;
    }
    return true;
  };

  const handleFormSubmit = async () => {
    console.log('=== DÉBUT handleFormSubmit ===');
    try {
      setError(null);
      console.log('Validation du formulaire...');

      if (!validateForm()) {
        console.log('Validation échouée');
        return;
      }
      console.log('Validation réussie');

      // Récupérer et décoder le token
      const token = await AsyncStorage.getItem('token');
      console.log('Token récupéré:', token ? 'Token présent' : 'Token manquant');
      
      if (!token) {
        throw new Error('Non authentifié. Veuillez vous reconnecter.');
      }

      const decodedToken = decodeToken(token);
      console.log('Token décodé:', decodedToken);
      
      if (!decodedToken || !decodedToken.id) {
        throw new Error('Token invalide');
      }

      const userId = decodedToken.id;
      console.log('ID utilisateur:', userId);

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description || '');
      formData.append('category_id', category);
      formData.append('booktype_id', bookType?.id ? bookType.id.toString() : '1');
      formData.append('user_id', userId.toString());
      formData.append('status', 'draft');

      console.log('=== DONNÉES DU FORMULAIRE ===');
      console.log('title:', title);
      console.log('description:', description || '');
      console.log('category_id:', category);
      console.log('booktype_id:', bookType?.id ? bookType.id.toString() : '1');
      console.log('user_id:', userId.toString());
      console.log('status:', 'draft');
      console.log('hasCover:', !!cover);

      if (cover) {
        console.log('Ajout de la cover');
        formData.append('cover', cover);
      }

      console.log('Envoi au serveur...');

      await handleSubmit(
        formData,
        async (bookId: number) => {
          console.log('[CREATE] Livre créé avec succès:', {
            bookId,
            title,
            hasCover: !!cover,
            userId
          });
          if (type === 1) {
            rootNavigation.navigate('UploadeOeuvreGraph', { bookId: bookId.toString() });
          } else {
            // Rediriger vers le formulaire de création de chapitre
            rootNavigation.navigate('CreateChapterPage', {
              bookId: bookId.toString()
            });
          }
        }
      );
    } catch (err) {
      console.error('[CREATE] Erreur lors de la création du livre:', err);
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors de la création';
      setError(errorMessage);
      Alert.alert('Erreur', errorMessage);
    }
  };

  const handleBack = () => {
    setType(null);
    setTitle('');
    setDescription('');
    setCover(null);
    setCoverPreview('');
    setCoverUrl(null);
    setCategory('');
    setError(null);
    onBack();
  };

  const handleCoverChange = (file: any) => {
    setCover(file);
    setCoverPreview(file.uri);
  };

  if (type === null) {
    return <WorkTypeSelector onTypeSelect={setType} />;
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color="#A020F0" />
        <Text style={styles.backButtonText}>Retour</Text>
      </TouchableOpacity>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FormInput
        label="Titre"
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          setError(null);
        }}
        placeholder="Entrez le titre"
        error={error && !title.trim() ? 'Le titre est requis' : undefined}
      />

      <FormInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="Entrez la description"
        multiline
        numberOfLines={4}
      />

      <CategoryPicker
        label="Catégorie"
        value={category}
        onValueChange={(value) => {
          setCategory(value);
          setError(null);
        }}
        categories={categories}
        loading={loading}
        error={error && !category ? 'La catégorie est requise' : undefined}
      />

      <ImageUploader
        cover={coverPreview}
        onCoverChange={handleCoverChange}
        uploading={uploading}
        onUploadingChange={setUploading}
      />

      <TouchableOpacity
        style={[styles.submitButton, uploading && styles.submitButtonDisabled]}
        onPress={() => {
          console.log('=== BOUTON CRÉER PRESSÉ ===');
          handleFormSubmit();
        }}
        disabled={uploading}
      >
        <Text style={styles.submitButtonText}>
          {uploading ? 'Création en cours...' : 'Créer'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#A020F0',
  },
  submitButton: {
    backgroundColor: '#A020F0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 4,
    marginBottom: 15,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
  },
});