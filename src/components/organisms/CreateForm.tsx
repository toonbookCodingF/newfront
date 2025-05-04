import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { FormInput } from '../atoms/FormInput';
import { CategoryPicker } from '../atoms/CategoryPicker';
import { ImageUploader } from '../molecules/ImageUploader';
import { WorkTypeSelector } from '../molecules/WorkTypeSelector';
import { bookService } from '../../services/api/books';
import { API_CONFIG, ENDPOINTS } from '../../config/api';
import { Ionicons } from '@expo/vector-icons';

type CreateFormNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Category {
  id: number;
  namecategory: string;
}

interface CreateFormProps {
  onBack: () => void;
}

export const CreateForm: React.FC<CreateFormProps> = ({ onBack }) => {
  const navigation = useNavigation<CreateFormNavigationProp>();
  const [type, setType] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [bookType, setBookType] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.categories.getAll}`);
        const data = await response.json();
        setCategories(data.data);
      } catch (error) {
        console.error('Erreur chargement catégories :', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (type === null) return;

    const fetchBookType = async () => {
      try {
        const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.booktypes.getAll}`);
        const json = await response.json();
        const bookTypeName = type === 0 ? 'roman' : 'webtoon';
        const found = json.data?.find((bt: any) =>
          bt.nametype?.toLowerCase() === bookTypeName
        );
        if (found) {
          setBookType(found);
        }
      } catch (error) {
        console.error('Erreur chargement book-types :', error);
      }
    };

    fetchBookType();
  }, [type]);

  const handleSubmit = async () => {
    if (!title || !category || type === null) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs.');
      return;
    }

    try {
      const coverToSend = cover || 'https://via.placeholder.com/300x400.png?text=Couverture';
      
      const bookData = {
        title,
        description,
        coverimage: coverToSend,
        category_id: parseInt(category),
        booktype_id: bookType?.id || null,
        user_id: 1,
        status: 'draft',
      };

      
      const newBook = await bookService.create(bookData);

      Alert.alert(
        'Succès',
        'Le livre a été créé avec succès !',
        //todo: changer le nom de la page
        [
          {
            text: 'OK',
            onPress: () => {
              if (type === 1) {
                navigation.navigate('UploadeOeuvreGraph', { bookId: newBook.id });
              } else {
                navigation.navigate('TestRedirection');
              }
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Erreur détaillée:', error);
      Alert.alert('Erreur', error.message || 'Une erreur est survenue lors de la création du livre');
    }
  };

  const handleBack = () => {
    setType(null);
    setTitle('');
    setDescription('');
    setCover('');
    setCategory('');
    onBack();
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

      <FormInput
        label="Titre"
        value={title}
        onChangeText={setTitle}
        placeholder="Entrez le titre"
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
        onValueChange={setCategory}
        categories={categories}
        loading={loading}
      />

      <ImageUploader
        cover={cover}
        onCoverChange={setCover}
        uploading={uploading}
        onUploadingChange={setUploading}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Créer</Text>
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
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 