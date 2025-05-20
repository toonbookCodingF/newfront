import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface TestButtonProps {
    onPress: () => void;
    title: string;
}

export const TestButton: React.FC<TestButtonProps> = ({ onPress, title }) => {
    return (
        <TouchableOpacity
            testID="test-button"
            style={styles.button}
            onPress={onPress}
        >
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 16,
    },
}); 