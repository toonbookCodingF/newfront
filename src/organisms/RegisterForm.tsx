import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { FormField } from '../molecules/FormField';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';
import { useAuth } from '../hooks/useAuth';

type RegisterFormNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export const RegisterForm: React.FC = () => {
    const navigation = useNavigation<RegisterFormNavigationProp>();
    const { register, isLoading, error } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [formError, setFormError] = useState('');

    const handleRegister = async () => {
        try {
            setFormError('');

            // Validation
            if (!username || !email || !password || !name || !lastName) {
                setFormError('Tous les champs sont obligatoires');
                Alert.alert('Erreur', 'Tous les champs sont obligatoires');
                return;
            }

            if (password !== confirmPassword) {
                setFormError('Les mots de passe ne correspondent pas');
                Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setFormError('Format d\'email invalide');
                Alert.alert('Erreur', 'Format d\'email invalide');
                return;
            }

            // Password validation (minimum 8 characters, at least one number and one letter)
            if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
                setFormError('Le mot de passe doit contenir au moins 8 caractères, un chiffre et une lettre');
                Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 8 caractères, un chiffre et une lettre');
                return;
            }

            const response = await register({
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

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text variant="title" style={styles.title}>Inscription</Text>
            </View>
            <FormField
                label="Nom d'utilisateur"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                error={formError || error || undefined}
                placeholder="User Name"
            />
            <FormField
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                error={formError || error || undefined}
                placeholder="Email"
            />
            <FormField
                label="Prénom"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                error={formError || error || undefined}
                placeholder="First Name"
            />
            <FormField
                label="Nom"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                error={formError || error || undefined}
                placeholder="Last Name"
            />
            <FormField
                label="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                error={formError || error || undefined}
                placeholder="Password"
            />
            <FormField
                label="Confirmer le mot de passe"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                error={formError || error || undefined}
                placeholder="Confirm Password"
            />
            <Button
                title={isLoading ? "Inscription..." : "S'inscrire"}
                onPress={handleRegister}
                disabled={isLoading}
                style={styles.submitButton}
            />
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
    submitButton: {
        marginTop: 20,
    }
}); 