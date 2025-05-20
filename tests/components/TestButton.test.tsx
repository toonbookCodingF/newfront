import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TestButton } from '../../src/components/TestButton';

describe('TestButton Component', () => {
    it('renders button with correct text', () => {
        const { getByText } = render(
            <TestButton onPress={() => { }} title="Test Button" />
        );
        expect(getByText('Test Button')).toBeTruthy();
    });

    it('calls onPress when pressed', () => {
        const mockOnPress = jest.fn();
        const { getByText } = render(
            <TestButton onPress={mockOnPress} title="Test Button" />
        );

        fireEvent.press(getByText('Test Button'));
        expect(mockOnPress).toHaveBeenCalled();
    });
}); 