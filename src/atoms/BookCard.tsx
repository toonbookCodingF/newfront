import React from 'react';
import { View, StyleSheet, Pressable, Image, Text } from 'react-native';
import { Book } from '../services/api/books';

interface BookCardProps {
  book: Book;
  onPress: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onPress }) => {
  return (
    <Pressable
      style={styles.card}
      onPress={() => onPress(book)}
    >
      <Image
        source={{ uri: book.coverimage || '' }}
        style={styles.cover}
        resizeMode="cover"
      />
      <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cover: {
    width: '100%',
    height: 200,
    backgroundColor: '#ccc',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
  },
}); 