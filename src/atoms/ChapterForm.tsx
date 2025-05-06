import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface ChapterFormProps {
  chapterTitle: string;
  content: string;
  onChapterTitleChange: (text: string) => void;
  onContentChange: (text: string) => void;
}

export const ChapterForm: React.FC<ChapterFormProps> = ({
  chapterTitle,
  content,
  onChapterTitleChange,
  onContentChange,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.inputLabel}>Nom du chapitre</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Ex: Chapitre 1 – L'aventure commence"
        placeholderTextColor="#aaa"
        value={chapterTitle}
        onChangeText={onChapterTitleChange}
      />

      <Text style={styles.inputLabel}>Contenu du chapitre</Text>
      <TextInput
        style={[styles.textInput, styles.contentInput]}
        placeholder="Écris ton texte ici..."
        placeholderTextColor="#aaa"
        multiline
        value={content}
        onChangeText={onContentChange}
        textAlignVertical="top"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  inputLabel: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
  },
  textInput: {
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: 8,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  contentInput: {
    height: 400,
  },
}); 