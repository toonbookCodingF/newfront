import React from 'react';
import { TextInput, StyleSheet, TextInputProps, View } from 'react-native';
import { Text } from './Text';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    placeholder?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    style,
    placeholder,
    ...props
}) => {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    error && styles.inputError,
                    style
                ]}
                placeholderTextColor="#999"
                placeholder={placeholder}
                {...props}
            />
            {error && <Text variant="caption" style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
    },
    label: {
        marginBottom: 4,
        fontSize: 16,
        fontWeight: '500',
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    inputError: {
        borderColor: '#ff3b30',
    },
    errorText: {
        color: '#ff3b30',
        marginTop: 4,
    },
}); 