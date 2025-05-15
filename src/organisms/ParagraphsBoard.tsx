import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { ParagraphCard } from '../atoms/ParagraphCard';
import { useParagraphs } from '../hooks/useParagraphs';
import { useUpdateChapter } from '../hooks/useUpdateChapter';

type ParagraphsBoardNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ParagraphsRouteProp = RouteProp<RootStackParamList, 'Paragraphs'>;

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
  bookTitle,
}) => {
  const navigation = useNavigation<ParagraphsBoardNavigationProp>();
  const route = useRoute<ParagraphsRouteProp>();
  const { paragraphs, loading, error } = useParagraphs(chapterId);
  const { updateChapter, updateContent, isLoading: isUpdating } = useUpdateChapter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(chapterTitle);
  const [editingParagraphId, setEditingParagraphId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState('');

  // Déterminer la source en fonction de la route précédente
  const source = route.params.fromMyBooks ? 'myBooks' : 'reading';

  const goToComments = (bookContentId: string) => {
    navigation.navigate('Comments', {
      bookContentId
    });
  };

  const handleUpdateChapter = async () => {
    try {
      if (!editedTitle.trim()) {
        Alert.alert('Erreur', 'Le titre du chapitre est requis');
        return;
      }

      await updateChapter(parseInt(chapterId), { title: editedTitle });
      Alert.alert('Succès', 'Le chapitre a été mis à jour avec succès');
      setIsEditing(false);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du chapitre:', err);
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Une erreur est survenue lors de la mise à jour');
    }
  };

  const handleUpdateContent = async (paragraphId: number) => {
    try {
      if (!editedContent.trim()) {
        Alert.alert('Erreur', 'Le contenu ne peut pas être vide');
        return;
      }

      await updateContent(paragraphId, { content: editedContent });
      Alert.alert('Succès', 'Le contenu a été mis à jour avec succès');
      setEditingParagraphId(null);
      setEditedContent('');
    } catch (err) {
      console.error('Erreur lors de la mise à jour du contenu:', err);
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Une erreur est survenue lors de la mise à jour');
    }
  };

  const startEditingContent = (paragraph: any) => {
    setEditingParagraphId(paragraph.id);
    setEditedContent(paragraph.content);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {isEditing ? (
          <View style={styles.editTitleContainer}>
            <TextInput
              style={styles.editTitleInput}
              value={editedTitle}
              onChangeText={setEditedTitle}
              placeholder="Titre du chapitre"
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity onPress={handleUpdateChapter} disabled={isUpdating}>
              <Ionicons name="checkmark" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsEditing(false)}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{chapterTitle} - {bookTitle}</Text>
            {source === 'myBooks' && (
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Ionicons name="create-outline" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {paragraphs.length > 0 ? (
          paragraphs.map((paragraph) => (
            <View key={paragraph.id}>
              {editingParagraphId === paragraph.id ? (
                <View style={styles.editContentContainer}>
                  <TextInput
                    style={styles.editContentInput}
                    value={editedContent}
                    onChangeText={setEditedContent}
                    multiline
                    placeholder="Contenu du paragraphe"
                    placeholderTextColor="#aaa"
                  />
                  <View style={styles.editContentButtons}>
                    <TouchableOpacity
                      onPress={() => handleUpdateContent(paragraph.id)}
                      disabled={isUpdating}
                      style={styles.editButton}
                    >
                      <Ionicons name="checkmark" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setEditingParagraphId(null);
                        setEditedContent('');
                      }}
                      style={styles.editButton}
                    >
                      <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.paragraphContainer}>
                  <ParagraphCard
                    content={paragraph.content}
                    type={paragraph.type}
                    id={paragraph.id.toString()}
                    onCommentPress={() => goToComments(paragraph.id.toString())}
                    source={source}
                    onEditPress={source === 'myBooks' ? () => startEditingContent(paragraph) : undefined}
                    onDeletePress={source === 'myBooks' ? () => {
                      // Implement the delete logic here
                    } : undefined}
                  />
                </View>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noParagraphs}>Aucun contenu disponible.</Text>
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
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  editTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  editTitleInput: {
    flex: 1,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
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
  paragraphContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  editParagraphButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 15,
  },
  editContentContainer: {
    backgroundColor: '#800080',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  editContentInput: {
    color: 'white',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  editContentButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 5,
    borderRadius: 15,
  },
}); 