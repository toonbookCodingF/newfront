import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChapterForm } from '../atoms/ChapterForm';
import { useCreateChapter } from '../hooks/useCreateChapter';
import { RootStackParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface CreateChapterBoardProps {
  bookId: string;
}

export const CreateChapterBoard: React.FC<CreateChapterBoardProps> = ({ bookId }) => {
  const navigation = useNavigation<NavigationProp>();
  const { createChapter, createBookContent, isLoading, error } = useCreateChapter();
  const [chapterTitle, setChapterTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = async () => {
    if (!chapterTitle.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un titre pour le chapitre');
      return;
    }

    try {
      const numericBookId = parseInt(bookId, 10);
      if (isNaN(numericBookId)) {
        throw new Error('ID du livre invalide');
      }

      // Créer le chapitre
      const chapter = await createChapter(numericBookId, chapterTitle);

      // Créer le contenu si du texte a été saisi
      if (content.trim()) {
        await createBookContent(chapter.id, content);
      }

      Alert.alert(
        'Succès',
        'Chapitre créé avec succès !',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('OeuvrePage', {
              id: bookId,
              fromMyBooks: true
            }),
          }
        ]
      );
    } catch (err) {
      console.error('Erreur lors de la création du chapitre:', err);
      Alert.alert('Erreur', error || 'Une erreur est survenue lors de la création du chapitre');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('OeuvrePage', {
          id: bookId,
          fromMyBooks: true
        })}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <ChapterForm
        chapterTitle={chapterTitle}
        content={content}
        onChapterTitleChange={setChapterTitle}
        onContentChange={setContent}
        onSave={handleSave}
        loading={isLoading}
        error={error}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A020F0',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
}); 