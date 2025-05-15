import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { API_CONFIG } from '../config/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ParagraphCardProps {
  content: string;
  onCommentPress?: () => void;
  id: string;
  type?: string;
  source?: 'myBooks' | 'reading' | 'other';
  onEditPress?: () => void;
  onDeletePress?: () => void;
}

export const ParagraphCard: React.FC<ParagraphCardProps> = ({
  content,
  type = 'text',
  onCommentPress,
  source = 'other',
  id,
  onEditPress,
  onDeletePress
}) => {
  const navigation = useNavigation<NavigationProp>();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const isImage = type === 'image';
  const imageUrl = isImage ? `${API_CONFIG.imageBaseURL}${API_CONFIG.staticPath}${content}` : null;
  const canEdit = source === 'myBooks';

  console.log('Image URL:', imageUrl);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = (error: any) => {
    console.error('Erreur de chargement de l\'image:', error.nativeEvent.error);
    setIsLoading(false);
    setHasError(true);

  const handleCommentPress = () => {
    navigation.navigate('Comments', { bookContentId: id });
  };

  return (
    <View style={styles.container}>
      {isImage ? (
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
      ) : (
        <Text style={styles.text}>{content}</Text>
      )}
      <View style={styles.buttonContainer}>
        {canEdit && (
          <>
            <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={onEditPress}>
              <Ionicons name="pencil-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={onDeletePress}>
              <Ionicons name="trash-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity style={[styles.actionButton, styles.commentButton]} onPress={handleCommentPress}>
          <Ionicons name="chatbubble-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
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
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#A020F0',
    padding: 8,
    borderRadius: 20,
  },
  editButton: {
    backgroundColor: '#4B0082',
  },
  deleteButton: {
    backgroundColor: '#8B0000',
  },
  commentButton: {
    backgroundColor: '#A020F0',
  },
}); 