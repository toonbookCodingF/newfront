import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { FormInput } from '../atoms/FormInput';
import { CategoryPicker } from '../atoms/CategoryPicker';
import { ImageUploader } from '../molecules/ImageUploader';
import { WorkTypeSelector } from '../molecules/WorkTypeSelector';
import { Ionicons } from '@expo/vector-icons';
import { useCreateBook } from '../../hooks/useCreateBook';

type CreateFormNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Category {
  id: number;
  namecategory: string;
}

interface CreateFormProps {
  onBack: () => void;
}

export const CreateForm: React.FC<CreateFormProps> = ({ onBack }) => {
  const navigation = useNavigation<CreateFormNavigationProp>();
  const [type, setType] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState('');
  const [category, setCategory] = useState('');
  const [uploading, setUploading] = useState(false);
  const { categories, bookType, loading, fetchBookType, handleSubmit } = useCreateBook();

  useEffect(() => {
    if (type === null) return;
    fetchBookType(type);
  }, [type]);

  const handleFormSubmit = async () => {
    await handleSubmit(
      title,
      description,
      cover,
      category,
      type,
      (bookId: number) => {
        if (type === 1) {
          navigation.navigate('UploadeOeuvreGraph', { bookId: bookId.toString() });
        } else {
          navigation.navigate('TestRedirection');
        }
      }
    );
  };

  const handleBack = () => {
    setType(null);
    setTitle('');
    setDescription('');
    setCover('');
    setCategory('');
    onBack();
  };

  if (type === null) {
    return <WorkTypeSelector onTypeSelect={setType} />;
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color="#A020F0" />
        <Text style={styles.backButtonText}>Retour</Text>
      </TouchableOpacity>

      <FormInput
        label="Titre"
        value={title}
        onChangeText={setTitle}
        placeholder="Entrez le titre"
      />

      <FormInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="Entrez la description"
        multiline
        numberOfLines={4}
      />

      <CategoryPicker
        label="Catégorie"
        value={category}
        onValueChange={setCategory}
        categories={categories}
        loading={loading}
      />

      <ImageUploader
        cover={cover}
        onCoverChange={setCover}
        uploading={uploading}
        onUploadingChange={setUploading}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleFormSubmit}>
        <Text style={styles.submitButtonText}>Créer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#A020F0',
  },
  submitButton: {
    backgroundColor: '#A020F0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 