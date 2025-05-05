import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

interface ChapterButtonProps {
  title: string;
  onPress: () => void;
}

export const ChapterButton: React.FC<ChapterButtonProps> = ({ title, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chapterButton,
        pressed && { opacity: 0.8 },
      ]}
    >
      <Text style={styles.chapterText}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chapterButton: {
    backgroundColor: '#FF69B4',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  chapterText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 