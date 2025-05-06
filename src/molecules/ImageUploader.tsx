import React, { useEffect } from 'react';
import { View, Text, Pressable, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { API_CONFIG } from '../config/api';

interface ImageUploaderProps {
  cover: string;
  onCoverChange: (url: string) => void;
  uploading: boolean;
  onUploadingChange: (uploading: boolean) => void;
}

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
      });

      if (!result.canceled) {
        const image = result.assets[0];

        try {
          onUploadingChange(true);

          const formData = new FormData();
          formData.append('file', {
            uri: image.uri,
            name: 'cover.jpg',
            type: 'image/jpeg',
          } as any);

          const response = await fetch(`${API_CONFIG.baseURL}/upload`, {
            method: 'POST',
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          const data = await response.json();

          if (data.url) {
            onCoverChange(data.url);
          }
        } catch (error) {
          console.error('Erreur upload :', error);
          Alert.alert('Erreur', 'Une erreur est survenue lors du téléchargement de l\'image.');
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
      <Text style={styles.label}>Cover</Text>
      <Pressable onPress={pickImage} disabled={uploading} style={styles.button}>
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Upload</Text>
        )}
      </Pressable>

      {cover ? (
        <Image
          source={{ uri: cover }}
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
}); 