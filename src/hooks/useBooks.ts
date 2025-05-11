import { useState, useEffect } from 'react';
import { bookService, Book } from '../services/api/books';
import { API_CONFIG } from '../config/api';

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await bookService.getAll();
        console.log('Données brutes des livres:', data);

        const formattedBooks: Book[] = data.map((book: any) => {
          console.log('Traitement du livre:', book);
          const formattedBook = {
            id: book.id,
            title: book.title,
            author: book.author || 'Auteur inconnu',
            description: book.description,
            coverimage: book.cover && book.cover !== '' ? `${API_CONFIG.imageBaseURL}${API_CONFIG.staticPath}${book.cover}` : undefined,
            createdAt: book.createdAt || new Date().toISOString(),
            updatedAt: book.updatedAt || new Date().toISOString(),
            category_id: book.category_id,
            booktype_id: book.bookType_id,
            user_id: book.user_id,
            status: book.status,
          };
          console.log('Livre formaté:', formattedBook);
          return formattedBook;
        });

        console.log('Livres formatés:', formattedBooks);
        setBooks(formattedBooks);
      } catch (err: any) {
        console.error('Erreur lors de la récupération des livres:', err);
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