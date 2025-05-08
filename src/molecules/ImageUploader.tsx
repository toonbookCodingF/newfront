import React, { useEffect } from 'react';
import { View, Text, Pressable, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { API_CONFIG } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ImageUploaderProps {
  cover: string;
  onCoverChange: (url: string) => void;
  uploading: boolean;
  onUploadingChange: (uploading: boolean) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  cover,
  onCoverChange,
  uploading,
  onUploadingChange,
}) => {
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission requise',
          'Désolé, nous avons besoin de l\'accès à votre galerie pour télécharger des images.'
        );
      }
    })();
  }, []);

  const validateImage = (image: ImagePicker.ImagePickerAsset) => {
    // Vérification de la taille
    if (image.fileSize && image.fileSize > MAX_FILE_SIZE) {
      throw new Error('L\'image ne doit pas dépasser 5MB');
    }

    // Vérification du type
    if (!image.mimeType || !ALLOWED_TYPES.includes(image.mimeType)) {
      throw new Error('Format d\'image non supporté. Utilisez JPEG, PNG, GIF ou WEBP');
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission requise',
          'Désolé, nous avons besoin de l\'accès à votre galerie pour télécharger des images.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
        exif: true,
      });

      if (!result.canceled) {
        const image = result.assets[0];

        try {
          validateImage(image);
          onUploadingChange(true);

          const formData = new FormData();
          formData.append('cover', {
            uri: image.uri,
            name: `cover.${image.mimeType?.split('/')[1] || 'jpg'}`,
            type: image.mimeType,
          } as any);

          const token = await AsyncStorage.getItem('token');
          const response = await fetch(`${API_CONFIG.baseURL}/books`, {
            method: 'POST',
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erreur lors de l\'upload de l\'image');
          }

          const data = await response.json();
          if (data.data?.cover) {
            onCoverChange(data.data.cover);
          }
        } catch (error) {
          console.error('Erreur upload :', error);
          Alert.alert('Erreur', error instanceof Error ? error.message : 'Une erreur est survenue lors du téléchargement de l\'image.');
        } finally {
          onUploadingChange(false);
        }
      }
    } catch (error) {
      console.error('Erreur sélection image :', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sélection de l\'image.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Couverture</Text>
      <Pressable
        onPress={pickImage}
        disabled={uploading}
        style={[styles.button, uploading && styles.buttonDisabled]}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {cover ? 'Changer la couverture' : 'Ajouter une couverture'}
          </Text>
        )}
      </Pressable>

      {cover ? (
        <Image
          source={{ uri: `${API_CONFIG.baseURL}/public/images/covers/${cover}` }}
          style={styles.image}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  button: {
    backgroundColor: '#A020F0',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 8,
    resizeMode: 'cover',
  },
}); 