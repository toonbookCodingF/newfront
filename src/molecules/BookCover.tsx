import React from 'react';
import { Image, StyleSheet, Dimensions } from 'react-native';

interface BookCoverProps {
  cover: string;
}

export const BookCover: React.FC<BookCoverProps> = ({ cover }) => {
  return (
    <Image
      source={{ uri: cover }}
      style={styles.cover}
      resizeMode="cover"
    />
  );
};

const styles = StyleSheet.create({
  cover: {
    width: '100%',
    height: 300,
    backgroundColor: '#ccc',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
}); 