import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_CONFIG } from '../config/api';

interface BookCoverProps {
  cover?: string;
}

export const BookCover: React.FC<BookCoverProps> = ({ cover }) => {
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
    console.error('Erreur de chargement de l\'image dans BookCover:', error.nativeEvent);
    console.error('URL de l\'image qui a échoué:', cover);
    console.error('Détails de l\'erreur:', JSON.stringify(error.nativeEvent, null, 2));
  };

  const handleImageLoad = () => {
    console.log('Image chargée avec succès dans BookCover:', cover);
  };

  const imageUrl = getImageUrl(cover);

  return (
    <View style={styles.container}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.cover}
          resizeMode="cover"
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      ) : (
        <View style={styles.placeholderCover}>
          <Ionicons name="book-outline" size={80} color="#666" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
    backgroundColor: '#f5f5f5',
  },
  cover: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  placeholderCover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  }
}); 