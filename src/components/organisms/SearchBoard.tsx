import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { SearchBar } from '../atoms/SearchBar';
import { SearchList } from '../molecules/SearchList';
import { Book } from '../../services/api/books';
import { useSearch } from '../../hooks/useSearch';

type SearchBoardNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SearchBoard: React.FC = () => {
  const navigation = useNavigation<SearchBoardNavigationProp>();
  const { filteredBooks, loading, error, handleSearch, searchQuery } = useSearch();

  const goToOeuvrePage = (book: Book) => {
    navigation.navigate('OeuvrePage', {
      id: book.id,
      title: book.title,
      description: book.description,
      cover: book.coverimage || '',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Rechercher un livre..."
      />
      <SearchList books={filteredBooks} onBookPress={goToOeuvrePage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A020F0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A020F0',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
  },
}); 