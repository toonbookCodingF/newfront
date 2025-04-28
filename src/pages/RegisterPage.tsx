import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AuthTemplate } from '../templates/AuthTemplate';
import { InputField } from '../molecules/InputField';
import { Button } from '../atoms/Button';


export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    // Logique d'inscription à implémenter
    console.log('Register attempt with:', { email, password });
  };

  return (
    <AuthTemplate>
      <View style={styles.container}>
        <InputField
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <InputField
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <InputField
          label="Confirmer le mot de passe"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <Button title="S'inscrire" onPress={handleRegister} />
      </View>
    </AuthTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
}); 