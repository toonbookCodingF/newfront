import React from 'react';
import { Pressable, Image, Text, StyleSheet, Dimensions } from 'react-native';
import { Book } from '../../services/api/books';

interface BookCardProps {
  book: Book;
  onPress: (book: Book) => void;
}

const screenWidth = Dimensions.get('window').width;
const imageWidth = screenWidth / 2 - 20;

export const BookCard: React.FC<BookCardProps> = ({ book, onPress }) => {
  return (
    <Pressable onPress={() => onPress(book)} style={styles.card}>
      <Image source={{ uri: book.coverimage }} style={styles.image} resizeMode="cover" />
      <Text style={styles.title}>{book.title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    width: imageWidth,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: imageWidth * 1.5,
  },
  title: {
    padding: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
}); 