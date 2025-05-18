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
  console.log('BookCard cover:', book.cover);

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return undefined;
    
    // Si c'est déjà une URL complète
    if (imagePath.startsWith('http')) return imagePath;
    
    // Si c'est un chemin relatif
    if (imagePath.startsWith('/')) {
      return `${API_CONFIG.imageBaseURL}${API_CONFIG.staticPath}${imagePath}`;
    }
    
    // Si c'est juste le nom du fichier
    return `${API_CONFIG.imageBaseURL}${API_CONFIG.staticPath}/images/${imagePath}`;
  };

  const handleImageError = (error: any) => {
    console.error('Erreur de chargement de l\'image dans BookCard:', error.nativeEvent);
    console.error('URL de l\'image qui a échoué:', book.coverimage || book.cover);
    console.error('Détails de l\'erreur:', JSON.stringify(error.nativeEvent, null, 2));
  };

  const handleImageLoad = () => {
    console.log('Image chargée avec succès dans BookCard:', book.coverimage || book.cover);
  };

  const handleImageLoadStart = () => {
    console.log('Début du chargement de l\'image:', book.coverimage || book.cover);
  };

  const handleImageLoadEnd = () => {
    console.log('Fin du chargement de l\'image:', book.coverimage || book.cover);
  };

  // Utiliser coverimage ou cover, selon ce qui est disponible
  const imagePath = book.coverimage || book.cover;
  const imageUrl = getImageUrl(imagePath);

  return (
    <Pressable
      style={styles.card}
      onPress={() => onPress(book)}
    >
      <View style={styles.coverContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.cover}
            resizeMode="cover"
            onError={handleImageError}
            onLoad={handleImageLoad}
            onLoadStart={handleImageLoadStart}
            onLoadEnd={handleImageLoadEnd}
            fadeDuration={0}
            progressiveRenderingEnabled={true}
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