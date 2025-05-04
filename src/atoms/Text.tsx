import React from 'react';
import { Text as RNText, StyleSheet, TextProps as RNTextProps } from 'react-native';

interface CustomTextProps {
    variant?: 'title' | 'subtitle' | 'body' | 'caption';
    color?: string;
}

type TextProps = CustomTextProps & RNTextProps;

export const Text: React.FC<TextProps> = ({
    children,
    variant = 'body',
    color = '#000000',
    style,
    ...props
}) => {
    return (
        <RNText
            style={[
                styles[variant],
                { color },
                style
            ]}
            {...props}
        >
            {children}
        </RNText>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    body: {
        fontSize: 16,
    },
    caption: {
        fontSize: 14,
        color: '#666',
    },
}); 