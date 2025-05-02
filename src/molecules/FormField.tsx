import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Input } from '../atoms/Input';
import { Text } from '../atoms/Text';

interface FormFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export const FormField: React.FC<FormFieldProps> = ({
    label,
    value,
    onChangeText,
    error,
    secureTextEntry,
    keyboardType = 'default',
    autoCapitalize = 'none',
}) => {
    return (
        <View style={styles.container}>
            <Input
                label={label}
                value={value}
                onChangeText={onChangeText}
                error={error}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
}); 