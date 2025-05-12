import { useState, useEffect, useCallback, useRef } from 'react';
import { bookService, Book } from '../services/api/books';

export const useSearch = () => {
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const timeoutRef = useRef<NodeJS.Timeout>();

  const searchBooks = useCallback(async (query: string) => {
    if (!query.trim()) {
      setFilteredBooks([]);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await bookService.getByName(query);
      setFilteredBooks(data);
    } catch (err: any) {
      setError(err.message || 'Une erreur inconnue est survenue');
      setFilteredBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      searchBooks(query);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    filteredBooks,
    loading,
    error,
    searchQuery,
    handleSearch,
    isSearching: loading && searchQuery.trim().length > 0
  };
}; 