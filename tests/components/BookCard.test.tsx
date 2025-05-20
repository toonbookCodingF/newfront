import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BookCard } from '../../src/atoms/BookCard';
import { Book } from '../../src/services/api/books';

// Mock des icônes Expo
jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons'
}));

// Mock des données de test
const mockBook: Book = {
    id: '1',
    title: 'Test Book',
    description: 'Test Description',
    coverimage: 'https://example.com/cover.jpg',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    category_id: 1,
    booktype_id: 1,
    user_id: 1,
    status: 'published'
};

describe('BookCard Component', () => {
    it('renders book card with title and cover image', () => {
        const mockOnPress = jest.fn();
        const { getByText, getByTestId } = render(
            <BookCard book={mockBook} onPress={mockOnPress} />
        );

        // Vérifie que le titre est affiché
        expect(getByText('Test Book')).toBeTruthy();

        // Vérifie que l'image est présente
        const image = getByTestId('book-cover-image');
        expect(image).toBeTruthy();
    });

    it('renders placeholder when no cover image is provided', () => {
        const bookWithoutCover = { ...mockBook, coverimage: undefined };
        const mockOnPress = jest.fn();
        const { getByTestId } = render(
            <BookCard book={bookWithoutCover} onPress={mockOnPress} />
        );

        // Vérifie que le placeholder est affiché
        expect(getByTestId('book-cover-placeholder')).toBeTruthy();
    });

    it('calls onPress when card is pressed', () => {
        const mockOnPress = jest.fn();
        const { getByTestId } = render(
            <BookCard book={mockBook} onPress={mockOnPress} />
        );

        // Simule un appui sur la carte
        fireEvent.press(getByTestId('book-card'));

        // Vérifie que onPress a été appelé avec le bon livre
        expect(mockOnPress).toHaveBeenCalledWith(mockBook);
    });

    it('handles image loading error', () => {
        const mockOnPress = jest.fn();
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        const { getByTestId } = render(
            <BookCard book={mockBook} onPress={mockOnPress} />
        );

        // Simule une erreur de chargement d'image
        const image = getByTestId('book-cover-image');
        fireEvent(image, 'onError', { nativeEvent: { error: 'Image loading failed' } });

        // Vérifie que l'erreur a été loguée
        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
    });
}); 