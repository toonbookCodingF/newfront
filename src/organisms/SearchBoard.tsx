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
  const { filteredBooks, loading, error, handleSearch, searchQuery, isSearching } = useSearch();

  const goToOeuvrePage = (book: Book) => {
    navigation.navigate('OeuvrePage', {
      id: book.id,
      fromMyBooks: false
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={36} color="#fff" />
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
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <BookList 
            books={filteredBooks} 
            onBookPress={goToOeuvrePage}
          />
          {isSearching && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A020F0',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  }
}); 