import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';

interface ChapterFormProps {
  chapterTitle: string;
  content: string;
  onChapterTitleChange: (text: string) => void;
  onContentChange: (text: string) => void;
  onSave: () => void;
  loading?: boolean;
  error?: string | null;
}

export const ChapterForm: React.FC<ChapterFormProps> = ({
  chapterTitle,
  content,
  onChapterTitleChange,
  onContentChange,
  onSave,
  loading = false,
  error = null,
}) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TextInput
          style={[styles.textInput, styles.saveButton]}
          value={loading ? 'Enregistrement...' : 'Enregistrer le chapitre'}
          onPressIn={onSave}
          editable={!loading}
        />
      </View>
    </TouchableWithoutFeedback>
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
  errorText: {
    color: '#ff6b6b',
    marginTop: 10,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#FF69B4',
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 20,
  },
}); 