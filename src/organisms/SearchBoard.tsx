import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { BookList } from '../molecules/BookList';
import { SearchInput } from '../molecules/SearchInput';
import { useSearch } from '../hooks/useSearch';
import { Book } from '../services/api/books';

type SearchBoardNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SearchBoard: React.FC = () => {
  const navigation = useNavigation<SearchBoardNavigationProp>();
  const { filteredBooks, loading, error, handleSearch, searchQuery } = useSearch();

  const goToOeuvrePage = (book: Book) => {
    navigation.navigate('OeuvrePage', {
      id: book.id
    });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchInput
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Rechercher un livre..."
      />
      <BookList 
        books={filteredBooks} 
        onBookPress={goToOeuvrePage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A020F0',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A020F0',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
}); 