import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '../../src/atoms/Input';

describe('Input Component', () => {
    it('renders label and placeholder correctly', () => {
        const { getByText, getByPlaceholderText } = render(
            <Input label="Test Label" placeholder="Test Placeholder" />
        );

        expect(getByText('Test Label')).toBeTruthy();
        expect(getByPlaceholderText('Test Placeholder')).toBeTruthy();
    });

    it('displays error message when error prop is provided', () => {
        const { getByText } = render(
            <Input error="Test Error" />
        );

        expect(getByText('Test Error')).toBeTruthy();
    });

    it('calls onChangeText when text is entered', () => {
        const mockOnChangeText = jest.fn();
        const { getByPlaceholderText } = render(
            <Input placeholder="Test Placeholder" onChangeText={mockOnChangeText} />
        );

        fireEvent.changeText(getByPlaceholderText('Test Placeholder'), 'Test Input');
        expect(mockOnChangeText).toHaveBeenCalledWith('Test Input');
    });
}); 