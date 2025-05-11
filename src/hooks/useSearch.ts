import { useState, useEffect } from 'react';
import { bookService, Book } from '../services/api/books';
import { API_CONFIG } from '../config/api';

export const useSearch = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await bookService.getAll();
        console.log('Données brutes des livres dans useSearch:', data);

        const formattedBooks = data.map((book: any) => ({
          ...book,
          coverimage: book.cover && book.cover !== '' ? `${API_CONFIG.imageBaseURL}${API_CONFIG.staticPath}${book.cover}` : undefined
        }));

        console.log('Livres formatés dans useSearch:', formattedBooks);
        setBooks(formattedBooks);
        setFilteredBooks(formattedBooks);
      } catch (err: any) {
        console.error('Erreur dans useSearch:', err);
        setError(err.message || 'Une erreur inconnue est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const lowerQuery = query.toLowerCase();
    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(lowerQuery)
    );
    setFilteredBooks(filtered);
  };

  return {
    filteredBooks,
    loading,
    error,
    searchQuery,
    handleSearch
  };
}; 