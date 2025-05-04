import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LibraryCard } from '../../components/atoms/LibraryCard';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

type LibraryPageNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const LibraryPage: React.FC = () => {
  const navigation = useNavigation<LibraryPageNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ma Bibliothèque</Text>
      
      <LibraryCard
        title="Mes créations"
        description="Retrouver vos créations"
        icon="📖"
        onPress={() => navigation.navigate('MenuCreation')}
      />

      <LibraryCard
        title="Mes lectures"
        icon="📚"
        onPress={() => navigation.navigate('TestRedirection')}
      />

      <LibraryCard
        title="Mes favoris"
        icon="⭐"
        onPress={() => navigation.navigate('TestRedirection')}
      />
    </View>
  );
};

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
}); 