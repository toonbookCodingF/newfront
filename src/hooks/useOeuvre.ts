import { useState, useEffect, useCallback } from 'react';
import { API_CONFIG, ENDPOINTS } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Chapter {
  id: number;
  title: string;
  content: string;
  order: number;
  book_id: number;
}

interface Book {
  id: number;
  title: string;
  description: string;
  coverimage?: string;
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
      const rawBook = bookData.data || bookData;
      
      const formattedBook = {
        id: rawBook.id,
        title: rawBook.title,
        description: rawBook.description,
        coverimage: rawBook.cover && rawBook.cover !== '' ? `${API_CONFIG.imageBaseURL}${API_CONFIG.staticPath}${rawBook.cover}` : undefined,
        status: rawBook.status,
        category_id: rawBook.category_id,
        booktype_id: rawBook.booktype_id,
        user_id: rawBook.user_id,
        cover: rawBook.cover
      };
      
      setBook(formattedBook);

      // Récupérer les chapitres
      const chaptersResponse = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.chapters.getByBookId(id)}`, {
        headers
      });

      if (!chaptersResponse.ok) {
        throw new Error(`Erreur ${chaptersResponse.status}: Impossible de récupérer les chapitres`);
      }

      const chaptersData = await chaptersResponse.json();
      setChapters(chaptersData.data || chaptersData);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
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