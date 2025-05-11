import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ImageUploadButtonProps {
    onPress: () => void;
    disabled?: boolean;
}

export const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({ onPress, disabled }) => {
    return (
        <TouchableOpacity
            style={[styles.button, disabled && styles.disabled]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={[styles.text, disabled && styles.disabledText]}>
                Choisir des images
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#800080',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    disabled: {
        backgroundColor: '#cccccc',
    },
    text: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    disabledText: {
        color: '#666666',
    },
}); 