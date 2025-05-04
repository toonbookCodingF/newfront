import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NouvelleCreation: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>...</Text>
      <Text style={styles.subtext}>En cours de développement</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A020F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    color: '#eee',
  },
});

export default NouvelleCreation;
