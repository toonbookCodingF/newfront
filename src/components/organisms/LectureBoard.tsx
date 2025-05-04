import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { BookList } from '../molecules/BookList';
import { Book } from '../../services/api/books';
import { useBooks } from '../../hooks/useBooks';

const localCovers = [
  require('../../../assets/imgCoverRoman/CoversRoman1.jpeg'),
  require('../../../assets/imgCoverRoman/CoversRoman2.jpg'),
  require('../../../assets/imgCoverRoman/CoversRoman3.jpeg'),
  require('../../../assets/imgCoverRoman/CoversRoman4.jpeg'),
];

type LectureBoardNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const LectureBoard: React.FC = () => {
  const navigation = useNavigation<LectureBoardNavigationProp>();
  const { books, loading, error } = useBooks();

  const goToOeuvrePage = (book: Book) => {
    navigation.navigate('OeuvrePage', {
      id: book.id,
      title: book.title,
      description: book.description,
      cover: book.coverimage || '',
    });
  };

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