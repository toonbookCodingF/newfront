import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChapterForm } from '../atoms/ChapterForm';
import { useCreateChapter } from '../hooks/useCreateChapter';
import { Button } from '../atoms/Button';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface CreateChapterBoardProps {
  bookId: string;
}

export const CreateChapterBoard: React.FC<CreateChapterBoardProps> = ({ bookId }) => {
  const navigation = useNavigation<NavigationProp>();
  const [chapterTitle, setChapterTitle] = useState('');
  const [content, setContent] = useState('');
  const { createChapter, createBookContent, error } = useCreateChapter();

  useEffect(() => {
    console.log('ID du livre reçu:', bookId);
  }, [bookId]);

  const handleSave = async () => {
    if (!chapterTitle.trim() || !content.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    console.log('Tentative de création avec ID:', bookId);
    const numericBookId = parseInt(bookId, 10);
    console.log('ID converti en nombre:', numericBookId);

    if (isNaN(numericBookId)) {
      Alert.alert('Erreur', 'ID du livre invalide');
      return;
    }

    try {
      const chapter = await createChapter(numericBookId, chapterTitle);
      await createBookContent(chapter.id, content);

      Alert.alert('Succès', 'Chapitre créé avec succès', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('OeuvrePage', { id: bookId }),
        },
      ]);
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      Alert.alert('Erreur', error || 'Une erreur est survenue lors de la création du chapitre');
    }
  };

  return (
    <View style={styles.container}>
      <ChapterForm
        chapterTitle={chapterTitle}
        content={content}
        onChapterTitleChange={setChapterTitle}
        onContentChange={setContent}
      />
      <Button
        title="Enregistrer le chapitre"
        onPress={handleSave}
        style={styles.saveButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3b0145',
  },
  saveButton: {
    margin: 20,
  },
}); 