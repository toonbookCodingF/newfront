import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChapterForm } from '../atoms/ChapterForm';
import { useCreateChapter } from '../hooks/useCreateChapter';
import { RootStackParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { chapterService } from '../services/api/chapters';
import { API_CONFIG } from '../config/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface CreateChapterBoardProps {
  bookId: string;
  nextOrder?: number;
}

export const CreateChapterBoard: React.FC<CreateChapterBoardProps> = ({ bookId, nextOrder }) => {
  const navigation = useNavigation<NavigationProp>();
  const { createChapter, createBookContent, isLoading, error } = useCreateChapter();
  const [chapterTitle, setChapterTitle] = useState('');
  const [content, setContent] = useState('');
  const [availableOrder, setAvailableOrder] = useState<number>(1);

  useEffect(() => {
    const fetchAvailableOrder = async () => {
      try {
        const numericBookId = parseInt(bookId, 10);
        if (isNaN(numericBookId)) return;

        // Récupérer tous les chapitres du livre
        const response = await fetch(`${API_CONFIG.baseURL}/chapters/book/${numericBookId}`);
        if (response.ok) {
          const chapters = await response.json();
          
          // Trouver l'ordre maximum
          const maxOrder = chapters.reduce((max: number, chapter: any) => 
            Math.max(max, chapter.order || 0), 0);
          
          // L'ordre disponible est l'ordre maximum + 1
          setAvailableOrder(maxOrder + 1);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération de l\'ordre disponible:', err);
      }
    };

    fetchAvailableOrder();
  }, [bookId]);

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

      // Créer le chapitre avec l'ordre disponible
      const chapter = await createChapter(numericBookId, chapterTitle, availableOrder);
      
      if (!chapter || !chapter.id) {
        throw new Error('Erreur lors de la création du chapitre : ID non trouvé');
      }

      // Créer le contenu si du texte a été saisi
      if (content.trim()) {
        // Diviser le contenu en paragraphes en fonction des retours à la ligne
        const paragraphs = content.split('\n').filter(p => p.trim());
        
        // Créer un bookContent pour chaque paragraphe
        for (let i = 0; i < paragraphs.length; i++) {
          await createBookContent(chapter.id, paragraphs[i].trim(), i + 1);
        }
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