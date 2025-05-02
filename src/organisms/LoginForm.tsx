import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { FormField } from '../molecules/FormField';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';
import { loginApi, LoginCredentials } from '../services/api/login';

type LoginFormNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const LoginForm: React.FC = () => {
  const navigation = useNavigation<LoginFormNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setError('');
      setIsLoading(true);

      const credentials: LoginCredentials = { email, password };
      const response = await loginApi.login(credentials);

      // Store the token if it's returned in the response
      if (response.token) {
        localStorage.setItem('token', response.token);
      }

      navigation.navigate('Main');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      setError(errorMessage);
      Alert.alert('Erreur', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="title" style={styles.title}>Connexion</Text>
      <FormField
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        error={error}
      />
      <FormField
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={error}
      />
      <Button
        title={isLoading ? "Connexion..." : "Se connecter"}
        onPress={handleLogin}
        disabled={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '100%',
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
}); 