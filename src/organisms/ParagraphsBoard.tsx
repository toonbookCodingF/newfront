import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { ParagraphCard } from '../atoms/ParagraphCard';
import { useParagraphs } from '../hooks/useParagraphs';

type ParagraphsBoardNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ParagraphsBoardProps {
  chapterId: string;
  bookId: string;
  chapterTitle: string;
  bookTitle: string;
}

export const ParagraphsBoard: React.FC<ParagraphsBoardProps> = ({
  chapterId,
  bookId,
  chapterTitle,
  bookTitle
}) => {
  const navigation = useNavigation<ParagraphsBoardNavigationProp>();
  const { paragraphs, loading, error } = useParagraphs(chapterId);

  const goToComments = (bookContentId: string) => {
    navigation.navigate('Comments', {
      bookContentId
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{chapterTitle} - {bookTitle}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {paragraphs.length > 0 ? (
          paragraphs.map((paragraph) => (
            <ParagraphCard
              key={paragraph.id}
              content={paragraph.content}
              id={paragraph.id.toString()}
              onCommentPress={() => goToComments(paragraph.id.toString())}
            />
          ))
        ) : (
          <Text style={styles.noParagraphs}>Aucun paragraphe disponible.</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#800080',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 50,
    paddingTop: 20,
  },
  noParagraphs: {
    color: 'white',
    fontSize: 16,
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