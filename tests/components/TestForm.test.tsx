import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { TestForm } from '../../src/components/TestForm';

describe('TestForm Component', () => {
    it('renders all form elements correctly', () => {
        const { getByTestId, getByPlaceholderText } = render(
            <TestForm onSubmit={() => { }} />
        );

        expect(getByTestId('email-input')).toBeTruthy();
        expect(getByTestId('password-input')).toBeTruthy();
        expect(getByTestId('submit-button')).toBeTruthy();
        expect(getByPlaceholderText('Email')).toBeTruthy();
        expect(getByPlaceholderText('Mot de passe')).toBeTruthy();
    });

    it('shows validation errors for empty fields', async () => {
        const { getByTestId, getByText } = render(
            <TestForm onSubmit={() => { }} />
        );

        const submitButton = getByTestId('submit-button');

        await act(async () => {
            fireEvent.press(submitButton);
        });

        expect(getByText('Email est requis')).toBeTruthy();
        expect(getByText('Mot de passe requis')).toBeTruthy();
    });

    it('shows validation error for invalid email', async () => {
        const { getByTestId } = render(
            <TestForm onSubmit={() => { }} />
        );

        const emailInput = getByTestId('email-input');
        const submitButton = getByTestId('submit-button');

        await act(async () => {
            fireEvent.changeText(emailInput, 'invalid-email');
            fireEvent.press(submitButton);
        });

        expect(getByTestId('email-error')).toBeTruthy();
    });

    it('shows validation error for short password', async () => {
        const { getByTestId } = render(
            <TestForm onSubmit={() => { }} />
        );

        const passwordInput = getByTestId('password-input');
        const submitButton = getByTestId('submit-button');

        await act(async () => {
            fireEvent.changeText(passwordInput, '12345');
            fireEvent.press(submitButton);
        });

        expect(getByTestId('password-error')).toBeTruthy();
    });

    it('calls onSubmit with form data when validation passes', async () => {
        const mockOnSubmit = jest.fn();
        const { getByTestId } = render(
            <TestForm onSubmit={mockOnSubmit} />
        );

        const emailInput = getByTestId('email-input');
        const passwordInput = getByTestId('password-input');
        const submitButton = getByTestId('submit-button');

        await act(async () => {
            fireEvent.changeText(emailInput, 'test@example.com');
            fireEvent.changeText(passwordInput, 'password123');
            fireEvent.press(submitButton);
        });

        // Attendre que toutes les mises à jour d'état soient terminées
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(mockOnSubmit).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'password123'
        });
    });
}); 