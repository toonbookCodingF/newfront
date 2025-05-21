import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../src/atoms/Button';

describe('Button Component', () => {
    it('calls onPress when button is pressed', () => {
        const mockOnPress = jest.fn();
        const { getByText } = render(
            <Button title="Test Button" onPress={mockOnPress} />
        );

        fireEvent.press(getByText('Test Button'));
        expect(mockOnPress).toHaveBeenCalled();
    });

    it('disables button when disabled prop is true', () => {
        const mockOnPress = jest.fn();
        const { getByText } = render(
            <Button title="Test Button" onPress={mockOnPress} disabled={true} />
        );

        fireEvent.press(getByText('Test Button'));
        expect(mockOnPress).not.toHaveBeenCalled();
    });
}); 