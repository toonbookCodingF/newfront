import React from 'react';
import { FlatList, StyleSheet, Dimensions } from 'react-native';
import { BookCard } from '../atoms/BookCard';
import { Book } from '../services/api/books';

interface SearchListProps {
  books: Book[];
  onBookPress: (book: Book) => void;
}

export const SearchList: React.FC<SearchListProps> = ({ books, onBookPress }) => {
  const numColumns = 2;

  return (
    <FlatList
      data={books}
      renderItem={({ item }) => (
        <BookCard
          book={item}
          onPress={() => onBookPress(item)}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
      numColumns={numColumns}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 10,
  },
}); 