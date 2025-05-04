import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type MenuCreationNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MenuCreation: React.FC = () => {
  const navigation = useNavigation<MenuCreationNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Menu de Création</Text>

      <Pressable style={styles.card} onPress={() => navigation.navigate('FormulaireCreation')}>
        <Text style={styles.cardText}>✏️ Nouvelle création</Text>
        <Text style={styles.descriptionCardText}>Commencer un nouveau projet</Text>
      </Pressable>

      <Pressable style={styles.card} onPress={() => navigation.navigate('TestRedirection')}>
        <Text style={styles.cardText}>⏳ Créations en cours</Text>
        <Text style={styles.descriptionCardText}>Reprendre là où vous vous êtes arrêté</Text>
      </Pressable>

      <Pressable style={styles.card} onPress={() => navigation.navigate('UploadeOeuvreGraph', { bookId: '' })}>
        <Text style={styles.cardText}>📥 Importer une œuvre graphique</Text>
        <Text style={styles.descriptionCardText}>Ajouter un fichier existant</Text>
      </Pressable>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A020F0',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
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
    color: '#666',
    marginTop: 5,
  },
});

export default MenuCreation;
