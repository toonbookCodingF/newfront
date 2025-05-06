import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { bookService } from '../services/api/books';
import { API_CONFIG, ENDPOINTS } from '../config/api';

interface Category {
  id: number;
  namecategory: string;
}

export const useCreateBook = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [bookType, setBookType] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  const fetchBookType = async (type: number) => {
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

  const handleSubmit = async (
    title: string,
    description: string,
    cover: string,
    category: string,
    type: number | null,
    onSuccess: (bookId: number) => void
  ) => {
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
      console.log('Livre créé:', newBook);
      
      if (!newBook.id) {
        throw new Error('ID du livre non trouvé dans la réponse');
      }

      const bookId = parseInt(newBook.id);
      if (isNaN(bookId)) {
        throw new Error('ID du livre invalide');
      }

      onSuccess(bookId);
    } catch (error: any) {
      console.error('Erreur détaillée:', error);
      Alert.alert('Erreur', error.message || 'Une erreur est survenue lors de la création du livre');
    }
  };

  return {
    categories,
    bookType,
    loading,
    fetchBookType,
    handleSubmit
  };
}; 