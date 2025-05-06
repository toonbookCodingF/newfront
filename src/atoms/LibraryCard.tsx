import React from 'react';
import { Pressable, Text, StyleSheet, Dimensions } from 'react-native';

interface LibraryCardProps {
  title: string;
  description?: string;
  icon: string;
  onPress: () => void;
}

const screenWidth = Dimensions.get('window').width;

export const LibraryCard: React.FC<LibraryCardProps> = ({ title, description, icon, onPress }) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.cardText}>{icon} {title}</Text>
      {description && <Text style={styles.descriptionCardText}>{description}</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    width: screenWidth - 40,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  descriptionCardText: {
    textAlign: 'center',
  },
}); 