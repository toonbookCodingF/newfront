import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { SearchBar } from '../atoms/SearchBar';
import { SearchList } from '../molecules/SearchList';
import { bookService, Book } from '../../services/api/books';

type SearchBoardNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SearchBoard: React.FC = () => {
  const navigation = useNavigation<SearchBoardNavigationProp>();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
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

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(lowerQuery)
    );
    setFilteredBooks(filtered);
  }, [searchQuery, books]);

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
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Rechercher un livre..."
      />
      <SearchList books={filteredBooks} onBookPress={goToOeuvrePage} />
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