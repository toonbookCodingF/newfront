import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { BookCover } from '../molecules/BookCover';
import { ChapterButton } from '../atoms/ChapterButton';
import { useOeuvre } from '../hooks/useOeuvre';

type OeuvreBoardNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface OeuvreBoardProps {
  id: string;
}

export const OeuvreBoard: React.FC<OeuvreBoardProps> = ({ id }) => {
  const navigation = useNavigation<OeuvreBoardNavigationProp>();
  const { book, chapters, loading, error } = useOeuvre(id);

  const goToParagraphs = (chapterId: number, chapterTitle: string) => {
    navigation.navigate('Paragraphs', {
      chapterId: chapterId.toString(),
      bookId: id,
      chapterTitle,
      bookTitle: book?.title || ''
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

  if (!book) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Livre non trouvé</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BookCover cover={book.coverimage} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{book.title}</Text>

        <Text style={styles.description}>
          {book.description || 'Aucune description disponible pour ce livre.'}
        </Text>

        <Text style={styles.chapterHeader}>Chapitres</Text>

        {chapters.length > 0 ? (
          chapters.map((chapter) => (
            <ChapterButton
              key={chapter.id}
              title={chapter.title}
              onPress={() => goToParagraphs(chapter.id, chapter.title)}
            />
          ))
        ) : (
          <Text style={styles.noChapters}>Aucun chapitre disponible.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A020F0',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: '#fff',
  },
  description: {
    fontSize: 16,
    color: '#f5f5f5',
    marginBottom: 25,
    textAlign: 'justify',
    lineHeight: 22,
  },
  chapterHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  noChapters: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
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