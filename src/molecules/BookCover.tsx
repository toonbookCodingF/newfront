import React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';

interface BookCoverProps {
  cover?: string;
}

export const BookCover: React.FC<BookCoverProps> = ({ cover }) => {
  console.log('BookCover received cover:', cover);

  return (
    <View style={styles.container}>
      {cover && cover !== '' ? (
        <Image
          source={{ uri: cover }}
          style={styles.cover}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholderCover}>
          <Text style={styles.placeholderText}>Pas de couverture</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
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
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
}); 