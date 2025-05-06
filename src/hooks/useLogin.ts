import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { loginApi, LoginCredentials } from '../services/api/login';

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

      if (response.token) {
        localStorage.setItem('token', response.token);
      }

      rootNavigation.navigate('Main');
    } catch (error) {
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