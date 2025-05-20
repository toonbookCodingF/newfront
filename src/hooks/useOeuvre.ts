import { useState, useEffect, useCallback } from 'react';
import { API_CONFIG, ENDPOINTS } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Chapter {
  id: number;
  title: string;
  order?: number;
}

interface Book {
  id: number;
  title: string;
  description: string;
  coverimage: string;
  status: string;
  category_id?: number;
  booktype_id: number | null;
  user_id: number;
  cover?: string;
}

export const useOeuvre = (id: string) => {
  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const token = await AsyncStorage.getItem('token');
        const headers = {
        ...API_CONFIG.headers,
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };

      // Récupérer le livre
      const bookResponse = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.books.getById(id)}`, {
          headers
        });

        if (!bookResponse.ok) {
        throw new Error(`Erreur ${bookResponse.status}: Impossible de récupérer le livre`);
      }

      const bookData = await bookResponse.json();
      setBook(bookData.data || bookData);

      // Récupérer les chapitres
      const chaptersResponse = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.chapters.getByBookId(id)}`, {
          headers
        });

        if (!chaptersResponse.ok) {
        throw new Error(`Erreur ${chaptersResponse.status}: Impossible de récupérer les chapitres`);
        }

      const chaptersData = await chaptersResponse.json();
      setChapters(chaptersData.data || chaptersData);
      } catch (err) {
      console.error('Erreur lors du chargement de l\'œuvre:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
  }, [id]);

  useEffect(() => {
      fetchData();
  }, [fetchData]);

  return {
    book,
    chapters,
    loading,
    error,
    refetch: fetchData
  };
}; 