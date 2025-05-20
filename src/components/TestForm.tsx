import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface TestFormProps {
    onSubmit: (data: { email: string; password: string }) => void;
}

export const TestForm: React.FC<TestFormProps> = ({ onSubmit }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = 'Email est requis';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email invalide';
        }

        if (!password) {
            newErrors.password = 'Mot de passe requis';
        } else if (password.length < 6) {
            newErrors.password = 'Le mot de passe doit faire au moins 6 caractères';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit({ email, password });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    testID="email-input"
                    style={styles.input}
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text);
                        setErrors({ ...errors, email: undefined });
                    }}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                {errors.email && <Text testID="email-error" style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    testID="password-input"
                    style={styles.input}
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                        setErrors({ ...errors, password: undefined });
                    }}
                    placeholder="Mot de passe"
                    secureTextEntry
                />
                {errors.password && <Text testID="password-error" style={styles.errorText}>{errors.password}</Text>}
            </View>

            <TouchableOpacity
                testID="submit-button"
                style={styles.button}
                onPress={handleSubmit}
            >
                <Text style={styles.buttonText}>Connexion</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    inputContainer: {
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 