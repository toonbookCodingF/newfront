import { renderHook, act } from '@testing-library/react-native';
import { useOeuvre } from '@/hooks/useOeuvre';

// Mock the fetch function
global.fetch = jest.fn();

describe('useOeuvre Hook', () => {
    const mockBookId = 'test-book-id';
    const mockBook = {
        id: mockBookId,
        title: 'Test Book',
        description: 'Test Description',
        coverimage: 'test-cover.jpg',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        category_id: 1,
        booktype_id: 1,
        user_id: 1,
        status: 'published'
    };

    const mockChapters = [
        {
            id: '1',
            title: 'Chapter 1',
            book_id: mockBookId,
            order: 1
        }
    ];

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        // Mock AsyncStorage
        jest.mock('@react-native-async-storage/async-storage', () => ({
            getItem: jest.fn(() => Promise.resolve('mock-token'))
        }));
    });

    it('should fetch book and chapters data', async () => {
        // Mock successful fetch responses
        (global.fetch as jest.Mock)
            .mockImplementationOnce(() => Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockBook)
            }))
            .mockImplementationOnce(() => Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockChapters)
            }));

        const { result } = renderHook(() => useOeuvre(mockBookId));

        // Initial state
        expect(result.current.loading).toBe(true);
        expect(result.current.book).toBe(null);
        expect(result.current.chapters).toEqual([]);

        // Wait for the data to be fetched
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        // Check final state
        expect(result.current.loading).toBe(false);
        expect(result.current.book).toEqual(mockBook);
        expect(result.current.chapters).toEqual(mockChapters);
        expect(result.current.error).toBe(null);
    });

    it('should handle fetch errors', async () => {
        // Mock failed fetch
        (global.fetch as jest.Mock).mockImplementationOnce(() => Promise.resolve({
            ok: false,
            statusText: 'Not Found',
            json: () => Promise.resolve({ message: 'Book not found' })
        }));

        const { result } = renderHook(() => useOeuvre(mockBookId));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.book).toBe(null);
        expect(result.current.chapters).toEqual([]);
        expect(result.current.error).toBeTruthy();
    });
}); 