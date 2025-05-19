import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { BookList } from '../molecules/BookList';
import { useBooks } from '../hooks/useBooks';
import { Book } from '../services/api/books';

type LectureBoardNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const localCovers = [
  require('../../assets/imgCoverRoman/CoversRoman1.jpeg'),
  require('../../assets/imgCoverRoman/CoversRoman2.jpg'),
  require('../../assets/imgCoverRoman/CoversRoman3.jpeg'),
  require('../../assets/imgCoverRoman/CoversRoman4.jpeg'),
];

export const LectureBoard: React.FC = () => {
  const navigation = useNavigation<LectureBoardNavigationProp>();
  const { books, loading, error } = useBooks();

  const goToOeuvrePage = (book: Book) => {
    navigation.navigate('OeuvrePage', {
      id: book.id,
      fromMyBooks: false
    });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size={36} color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BookList
        books={books}
        onBookPress={goToOeuvrePage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A020F0',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A020F0',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
}); 