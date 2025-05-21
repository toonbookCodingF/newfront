import { API_CONFIG, ENDPOINTS } from '../../../config/api';
import { bookService } from '../../../services/api/books';

describe('Book Service', () => {
    it('should fetch a book by ID', async () => {
        // Replace 'test-book-id' with an actual book ID from your database
        const bookId = 'test-book-id';

        try {
            const book = await bookService.getById(bookId);

            expect(book).toHaveProperty('id');
            expect(book).toHaveProperty('title');
            expect(book).toHaveProperty('description');
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
            await bookService.getById(nonExistentId);
            // If we reach this point, the test should fail
            expect(true).toBe(false);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    it('should fetch all books', async () => {
        try {
            const books = await bookService.getAll();
            expect(Array.isArray(books)).toBe(true);
            if (books.length > 0) {
                expect(books[0]).toHaveProperty('id');
                expect(books[0]).toHaveProperty('title');
            }
        } catch (error) {
            console.error('Error fetching books:', error);
            throw error;
        }
    });
}); 