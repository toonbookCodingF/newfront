import { useState, useEffect } from 'react';
import { API_CONFIG, ENDPOINTS } from '../config/api';

interface Chapter {
  id: number;
  title: string;
}

interface Book {
  id: number;
  title: string;
  description: string;
  coverimage: string;
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

        // Fetch book details
        const bookResponse = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.books.getById(bookId)}`);
        if (!bookResponse.ok) {
          throw new Error('Erreur lors de la récupération du livre');
        }
        const bookData = await bookResponse.json();
        setBook(bookData);

        // Fetch chapters
        const chaptersResponse = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.chapters.getByBookId(bookId)}`);
        if (!chaptersResponse.ok) {
          throw new Error('Erreur lors de la récupération des chapitres');
        }
        const chaptersData = await chaptersResponse.json();
        setChapters(chaptersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookId]);

  return { book, chapters, loading, error };
}; 