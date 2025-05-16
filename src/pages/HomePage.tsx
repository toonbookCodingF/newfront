import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTabParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';

type HomePageNavigationProp = NativeStackNavigationProp<MainTabParamList>;

export default function HomePage() {
  const navigation = useNavigation<HomePageNavigationProp>();

  const navigateToLibrary = () => {
    navigation.navigate('Library');
  };

  const navigateToSearch = () => {
    navigation.navigate('Search');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bienvenue chez ToonBook</Text>
        <Text style={styles.subtitle}>Votre espace de création et de partage</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Que souhaitez-vous faire aujourd'hui ?</Text>

        <TouchableOpacity style={styles.card} onPress={navigateToLibrary}>
          <View style={styles.cardContent}>
            <Ionicons name="create-outline" size={32} color="#A020F0" />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Créer</Text>
              <Text style={styles.cardDescription}>
                Lancez-vous dans la création d'œuvres graphiques ou littéraires
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={navigateToSearch}>
          <View style={styles.cardContent}>
            <Ionicons name="book-outline" size={32} color="#A020F0" />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Découvrir</Text>
              <Text style={styles.cardDescription}>
                Explorez les œuvres de la communauté
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <View style={styles.cardContent}>
            <Ionicons name="chatbubble-outline" size={32} color="#A020F0" />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Partager</Text>
              <Text style={styles.cardDescription}>
                Échangez des conseils et des idées avec d'autres créateurs
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A020F0',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#A020F0',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  section: {
    padding: 20,
    alignItems: 'center',
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    marginLeft: 16,
    flex: 1,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
}); 