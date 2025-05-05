import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { useAuth } from './useAuth';

type RegisterFormNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export const useRegister = () => {
  const navigation = useNavigation<RegisterFormNavigationProp>();
  const { register, isLoading, error } = useAuth();
  const [formError, setFormError] = useState('');

  const validateForm = (username: string, email: string, password: string, confirmPassword: string, name: string, lastName: string) => {
    if (!username || !email || !password || !name || !lastName) {
      setFormError('Tous les champs sont obligatoires');
      Alert.alert('Erreur', 'Tous les champs sont obligatoires');
      return false;
    }

    if (password !== confirmPassword) {
      setFormError('Les mots de passe ne correspondent pas');
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Format d\'email invalide');
      Alert.alert('Erreur', 'Format d\'email invalide');
      return false;
    }

    if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      setFormError('Le mot de passe doit contenir au moins 8 caractères, un chiffre et une lettre');
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 8 caractères, un chiffre et une lettre');
      return false;
    }

    return true;
  };

  const handleRegister = async (username: string, email: string, password: string, name: string, lastName: string) => {
    try {
      setFormError('');

      if (!validateForm(username, email, password, password, name, lastName)) {
        return;
      }

      await register({
        username,
        email,
        password,
        name,
        lastName
      });

      Alert.alert(
        'Succès',
        'Inscription réussie ! Vous pouvez maintenant vous connecter.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      setFormError(errorMessage);
      Alert.alert('Erreur', errorMessage);
    }
  };

  return {
    handleRegister,
    isLoading,
    error: formError || error
  };
}; 