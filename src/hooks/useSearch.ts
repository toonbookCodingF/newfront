import { useState, useEffect } from 'react';
import { bookService, Book } from '../services/api/books';

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
        setBooks(data);
        setFilteredBooks(data);
      } catch (err: any) {
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