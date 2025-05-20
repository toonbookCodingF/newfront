import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { API_CONFIG } from '../config/api';
import * as ImagePicker from 'expo-image-picker';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ParagraphCardProps {
  content: string;
  type: string;
  id?: string;
  onCommentPress?: () => void;
  source?: 'myBooks' | 'reading' | 'other';
  onEditPress?: () => void;
  onDeletePress?: () => void;
  onImageEdit?: (newImageUri: string) => void;
  onPress?: () => void;
}

export const ParagraphCard: React.FC<ParagraphCardProps> = ({
  content,
  type,
  id,
  onCommentPress,
  source = 'other',
  onEditPress,
  onDeletePress,
  onImageEdit,
  onPress,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const isImage = type === 'image';
  const imageUrl = isImage ? `${API_CONFIG.imageBaseURL}/public${content}` : null;
  const canEdit = source === 'myBooks';

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = (error: any) => {
    console.error('Erreur de chargement de l\'image:', error.nativeEvent.error);
    setIsLoading(false);
    setHasError(true);
  };

  const handleCommentPress = () => {
    if (id) {
      navigation.navigate('Comments', { bookContentId: id });
    }
  };

  const handleEditImage = async () => {
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
        quality: 1,
        presentationStyle: ImagePicker.UIImagePickerPresentationStyle.FULL_SCREEN,
      });

      if (!result.canceled && onImageEdit) {
        await onImageEdit(result.assets[0].uri);
      }
    } catch (err) {
      console.error('Erreur lors de la sélection de l\'image:', err);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sélection de l\'image');
    }
  };

  const renderContent = () => {
    if (type === 'image') {
      return (
        <View style={styles.imageContainer}>
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size={36} color="#fff" />
            </View>
          )}
          {hasError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Erreur de chargement de l'image</Text>
            </View>
          ) : (
            <Image
              source={{ uri: imageUrl || '' }}
              style={styles.image}
              resizeMode="cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
        </View>
      );
    }
    return <Text style={styles.text}>{content}</Text>;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
    >
      {renderContent()}
      {source === 'myBooks' && (
        <View style={styles.actions}>
          {type !== 'image' && onEditPress && (
            <TouchableOpacity onPress={onEditPress} style={styles.actionButton}>
              <Ionicons name="create-outline" size={20} color="#fff" />
            </TouchableOpacity>
          )}
          {onDeletePress && (
            <TouchableOpacity onPress={onDeletePress} style={styles.actionButton}>
              <Ionicons name="trash-outline" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      )}
      {onCommentPress && (
        <TouchableOpacity onPress={onCommentPress} style={styles.commentButton}>
          <Ionicons name="chatbubble-outline" size={20} color="#fff" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#800080',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    position: 'relative',
  },
  imageContainer: {
    width: '100%',
    height: 400,
    backgroundColor: '#600060',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#600060',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#600060',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 15,
  },
  commentButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 15,
  },
}); 