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

        console.log('Fetching data for bookId:', bookId);

        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error('Non authentifié. Veuillez vous reconnecter.');
        }

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        // Fetch book details
        console.log('Fetching book details from:', `${API_CONFIG.baseURL}${ENDPOINTS.books.getById(bookId)}`);
        const bookResponse = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.books.getById(bookId)}`, {
          headers
        });

        console.log('Book response status:', bookResponse.status);
        const bookData = await bookResponse.json();
        console.log('Book response data:', bookData);
        console.log('Cover field from API:', bookData.cover);

        if (!bookResponse.ok) {
          throw new Error(`Erreur lors de la récupération du livre: ${bookData.message || bookResponse.statusText}`);
        }

        // Format the book data to match the Book interface
        const formattedBook = {
          ...bookData,
          coverimage: bookData.cover && bookData.cover !== '' ? `${API_CONFIG.imageBaseURL}${bookData.cover}` : undefined
        };

        console.log('Base URL:', API_CONFIG.imageBaseURL);
        console.log('Cover path:', bookData.cover);
        console.log('Full cover URL:', formattedBook.coverimage);
        console.log('Livre formaté:', formattedBook);
        setBook(formattedBook);

        // Fetch chapters
        console.log('Fetching chapters from:', `${API_CONFIG.baseURL}${ENDPOINTS.chapters.getByBookId(bookId)}`);
        const chaptersResponse = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.chapters.getByBookId(bookId)}`, {
          headers
        });

        console.log('Chapters response status:', chaptersResponse.status);
        const chaptersData = await chaptersResponse.json();
        console.log('Chapters response data:', chaptersData);

        if (!chaptersResponse.ok) {
          throw new Error(`Erreur lors de la récupération des chapitres: ${chaptersData.message || chaptersResponse.statusText}`);
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