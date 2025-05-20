import { API_CONFIG, ENDPOINTS } from '@/config/api';
import { bookService } from '@/services/api/books';

// Mock fetch
global.fetch = jest.fn();

describe('Book Service', () => {
    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        // Mock AsyncStorage
        jest.mock('@react-native-async-storage/async-storage', () => ({
            getItem: jest.fn(() => Promise.resolve('mock-token'))
        }));
    });

    it('should fetch a book by ID', async () => {
        const mockBook = {
            id: 'test-book-id',
            title: 'Test Book',
            description: 'Test Description',
            cover: 'test-cover.jpg',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
            category_id: 1,
            booktype_id: 1,
            user_id: 1,
            status: 'published'
        };

        // Mock successful fetch response
        (global.fetch as jest.Mock).mockImplementationOnce(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockBook)
        }));

        const book = await bookService.getById('test-book-id');

        expect(book).toHaveProperty('id');
        expect(book).toHaveProperty('title');
        expect(book).toHaveProperty('description');
    });

    it('should handle non-existent book ID', async () => {
        // Mock failed fetch response
        (global.fetch as jest.Mock).mockImplementationOnce(() => Promise.resolve({
            ok: false,
            status: 404,
            json: () => Promise.resolve({ message: 'Book not found' })
        }));

        await expect(bookService.getById('non-existent-id')).rejects.toThrow();
    });

    it('should fetch all books', async () => {
        const mockBooks = [
            {
                id: '1',
                title: 'Book 1',
                description: 'Description 1'
            },
            {
                id: '2',
                title: 'Book 2',
                description: 'Description 2'
            }
        ];

        // Mock successful fetch response
        (global.fetch as jest.Mock).mockImplementationOnce(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockBooks)
        }));

        const books = await bookService.getAll();
        expect(Array.isArray(books)).toBe(true);
        expect(books.length).toBe(2);
        expect(books[0]).toHaveProperty('id');
        expect(books[0]).toHaveProperty('title');
    });
}); 