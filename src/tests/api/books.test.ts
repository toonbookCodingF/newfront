import { API_CONFIG, ENDPOINTS } from '../../config/api';

describe('Books API', () => {
    it('should fetch a book by ID', async () => {
        // Replace 'test-book-id' with an actual book ID from your database
        const bookId = 'test-book-id';

        try {
            const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.books.getById(bookId)}`, {
                method: 'GET',
                headers: API_CONFIG.headers,
            });

            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data).toHaveProperty('id');
            expect(data).toHaveProperty('title');
            expect(data).toHaveProperty('description');
            // Add more specific assertions based on your book data structure
        } catch (error) {
            // If the test fails, log the error for debugging
            console.error('Error fetching book:', error);
            throw error;
        }
    });

    it('should handle non-existent book ID', async () => {
        const nonExistentId = 'non-existent-id';

        try {
            const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.books.getById(nonExistentId)}`, {
                method: 'GET',
                headers: API_CONFIG.headers,
            });
            expect(response.status).toBe(404);
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    });
}); 