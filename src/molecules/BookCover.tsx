import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BookCoverProps {
  cover?: string;
}

export const BookCover: React.FC<BookCoverProps> = ({ cover }) => {
  console.log('BookCover received cover:', cover);

  const handleImageError = (error: any) => {
    console.error('Erreur de chargement de l\'image:', error.nativeEvent);
  };

  return (
    <View style={styles.container}>
      {cover && cover !== '' ? (
        <Image
          source={{ uri: cover }}
          style={styles.cover}
          resizeMode="cover"
          onError={handleImageError}
          onLoad={() => console.log('Image chargée avec succès:', cover)}
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