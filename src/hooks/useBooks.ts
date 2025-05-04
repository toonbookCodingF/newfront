import { useState, useEffect } from 'react';
import { bookService, Book } from '../services/api/books';
import { API_CONFIG } from '../config/api';

const localCovers = [
  require('../../assets/imgCoverRoman/CoversRoman1.jpeg'),
  require('../../assets/imgCoverRoman/CoversRoman2.jpg'),
  require('../../assets/imgCoverRoman/CoversRoman3.jpeg'),
  require('../../assets/imgCoverRoman/CoversRoman4.jpeg'),
];

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await bookService.getAll();
        const formattedBooks: Book[] = data.map((book: any, index: number) => ({
          id: book.id,
          title: book.title,
          author: book.author || 'Auteur inconnu',
          description: book.description,
          coverimage: `${API_CONFIG.baseURL}${book.coverimage}`,
          createdAt: book.createdAt || new Date().toISOString(),
          updatedAt: book.updatedAt || new Date().toISOString(),
          image: localCovers[index % localCovers.length],
          category_id: book.category_id,
          booktype_id: book.bookType_id,
          user_id: book.user_id,
          status: book.status,
        }));
        setBooks(formattedBooks);
      } catch (err: any) {
        setError(err.message || 'Une erreur inconnue est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return {
    books,
    loading,
    error
  };
}; 