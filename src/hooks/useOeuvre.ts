import { useState, useEffect } from 'react';
import { API_CONFIG, ENDPOINTS } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Chapter {
  id: number;
  title: string;
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

export const useOeuvre = (bookId: string) => {
  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);


        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error('Non authentifié. Veuillez vous reconnecter.');
        }

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        // Fetch book details
        const bookResponse = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.books.getById(bookId)}`, {
          headers
        });

        const bookData = await bookResponse.json();

        if (!bookResponse.ok) {
          throw new Error(`[FETCH] Erreur lors de la récupération du livre: ${bookData.message || bookResponse.statusText}`);
        }

        // Format the book data to match the Book interface
        const formattedBook = {
          ...bookData,
          coverimage: bookData.cover && bookData.cover !== '' ? `${API_CONFIG.imageBaseURL}${API_CONFIG.staticPath}${bookData.cover}` : undefined
        };

        setBook(formattedBook);

        // Fetch chapters

        const chaptersResponse = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.chapters.getByBookId(bookId)}`, {
          headers
        });

        const chaptersData = await chaptersResponse.json();

        if (!chaptersResponse.ok) {
          throw new Error(`[FETCH] Erreur lors de la récupération des chapitres: ${chaptersData.message || chaptersResponse.statusText}`);
        }

        setChapters(Array.isArray(chaptersData) ? chaptersData : chaptersData.data || []);
      } catch (err) {
        console.error('Erreur dans useOeuvre:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchData();
    } else {
      setError('ID du livre non fourni');
      setLoading(false);
    }
  }, [bookId]);

  return { book, chapters, loading, error };
}; 