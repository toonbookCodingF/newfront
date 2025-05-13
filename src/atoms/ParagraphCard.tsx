import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ParagraphCardProps {
  content: string;
  onCommentPress?: () => void;
  id: string;
}

export const ParagraphCard: React.FC<ParagraphCardProps> = ({ content, onCommentPress, id }) => {
  const navigation = useNavigation<NavigationProp>();

  const handleCommentPress = () => {
    navigation.navigate('Comments', { bookContentId: id });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.content}>{content}</Text>
      <TouchableOpacity style={styles.commentButton} onPress={handleCommentPress}>
        <Ionicons name="chatbubble-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  content: {
    color: 'white',
    fontSize: 16,
    textAlign: 'justify',
  },
  commentButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
}); 