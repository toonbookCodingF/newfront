import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface WorkTypeSelectorProps {
  onTypeSelect: (type: number) => void;
}

export const WorkTypeSelector: React.FC<WorkTypeSelectorProps> = ({ onTypeSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choisissez le type d'œuvre</Text>
      <Pressable style={styles.button} onPress={() => onTypeSelect(0)}>
        <Text style={styles.buttonText}>Oeuvre Littéraire</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => onTypeSelect(1)}>
        <Text style={styles.buttonText}>Oeuvre Graphique</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#A020F0',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
}); 