import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { loginApi, LoginCredentials } from '../services/api/login';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const useLogin = () => {
  const rootNavigation = useNavigation<RootNavigationProp>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (email: string, password: string) => {
    try {
      setError('');
      setIsLoading(true);

      const credentials: LoginCredentials = { email, password };
      
      const response = await loginApi.login(credentials);

      if (response.data && response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        
        // Stocker les données utilisateur
        const userData = {
          id: response.data.id,
          email: response.data.email
        };
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
      } else {
        console.warn('Aucun token reçu dans la réponse');
        throw new Error('Token non reçu dans la réponse');
      }

      rootNavigation.navigate('Main');
    } catch (error) {
      console.error('Erreur de connexion:', error);
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      setError(errorMessage);
      Alert.alert('Erreur', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLogin,
    isLoading,
    error
  };
}; 