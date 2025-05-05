import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { FormField } from '../molecules/FormField';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';
import { useLogin } from '../hooks/useLogin';

type LoginFormNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export const LoginForm: React.FC = () => {
  const authNavigation = useNavigation<LoginFormNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, isLoading, error } = useLogin();

  const handleNavigateToRegister = () => {
    authNavigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text variant="title" style={styles.title}>Connexion</Text>
      </View>
      <FormField
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        error={error || undefined}
      />
      <FormField
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={error || undefined}
      />
      <Button
        title={isLoading ? "Connexion..." : "Se connecter"}
        onPress={() => handleLogin(email, password)}
        disabled={isLoading}
      />
      <View style={styles.registerLinkContainer}>
        <TouchableOpacity onPress={handleNavigateToRegister}>
          <Text style={styles.registerText}>Pas encore de compte ? S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '100%',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
  },
  registerLinkContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  registerText: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
}); 