import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { BookCard } from '../atoms/BookCard';
import { Book } from '../../services/api/books';

interface BookListProps {
  books: Book[];
  onBookPress: (book: Book) => void;
}

export const BookList: React.FC<BookListProps> = ({ books, onBookPress }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={({ item }) => <BookCard book={item} onPress={onBookPress} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
}); 