import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { BookList } from '../molecules/BookList';
import { bookService, Book } from '../../services/api/books';
import { API_CONFIG } from '../../config/api';

const localCovers = [
  require('../../../assets/imgCoverRoman/CoversRoman1.jpeg'),
  require('../../../assets/imgCoverRoman/CoversRoman2.jpg'),
  require('../../../assets/imgCoverRoman/CoversRoman3.jpeg'),
  require('../../../assets/imgCoverRoman/CoversRoman4.jpeg'),
];

type LectureBoardNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const LectureBoard: React.FC = () => {
  const navigation = useNavigation<LectureBoardNavigationProp>();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const goToOeuvrePage = (book: Book) => {
    navigation.navigate('OeuvrePage', {
      id: book.id,
      title: book.title,
      description: book.description,
      cover: book.coverimage || '',
    });
  };

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BookList books={books} onBookPress={goToOeuvrePage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A020F0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A020F0',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
  },
}); 