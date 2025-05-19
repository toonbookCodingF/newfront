import React from 'react';
import { View, StyleSheet, Pressable, Image, Text, ImageLoadEventData } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Book } from '../services/api/books';
import { API_CONFIG } from '../config/api';

interface BookCardProps {
  book: Book;
  onPress: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onPress }) => {
  console.log('BookCard received book:', book);
  console.log('BookCard coverimage:', book.coverimage);

  const handleImageError = (error: any) => {
    console.error('Erreur de chargement de l\'image dans BookCard:', error.nativeEvent);
  };

  return (
    <Pressable
      style={styles.card}
      onPress={() => onPress(book)}
    >
      <View style={styles.coverContainer}>
        {book.coverimage ? (
          <Image
            source={{ uri: book.coverimage }}
            style={styles.cover}
            resizeMode="cover"
            onError={handleImageError}
            onLoad={() => console.log('Image chargée avec succès dans BookCard:', book.coverimage)}
          />
        ) : (
          <View style={styles.placeholderCover}>
            <Ionicons name="book-outline" size={60} color="#666" />
          </View>
        )}
      </View>
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
  coverContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  cover: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  placeholderCover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
  },
}); 