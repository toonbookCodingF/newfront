import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { bookService } from '../services/api/books';
import { API_CONFIG, ENDPOINTS } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    formData: FormData,
    onSuccess: (bookId: number) => void
  ) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Token non trouvé');
      }

      const response = await fetch(`${API_CONFIG.baseURL}/books`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('Réponse complète du serveur:', {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
      });

      const data = await response.json();
      console.log('Données de la réponse:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la création du livre');
      }

      if (!data.data || !data.data.id) {
        throw new Error('ID du livre non trouvé dans la réponse');
      }

      onSuccess(data.data.id);
    } catch (error) {
      console.error('Erreur dans handleSubmit:', error);
      throw error;
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