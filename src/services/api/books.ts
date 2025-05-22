import { API_CONFIG, ENDPOINTS } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wrapFetchWithNetworkError } from '../../utils/networkUtils';

export interface Book {
    id: string;
    title: string;
    description: string;
    coverimage?: string;
    createdAt: string;
    updatedAt: string;
    category_id: number;
    booktype_id: number | null;
    user_id: number;
    status: string;
    cover?: string;
}

export interface CreateBookData {
    title: string;
    description: string;
    coverimage?: string;
    category_id: number;
    booktype_id: number | null;
    user_id: number;
    status: string;
}

export interface UpdateBookData extends Partial<CreateBookData> { }

const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
        throw new Error('Non authentifié. Veuillez vous reconnecter.');
    }

    const headers = {
        ...API_CONFIG.headers,
        'Authorization': `Bearer ${token}`
    };

    return headers;
};

export const bookService = {
    getAll: async (): Promise<Book[]> => {
        const headers = await getAuthHeaders();
        const response = await wrapFetchWithNetworkError(
            `${API_CONFIG.baseURL}${ENDPOINTS.books.getAll}`,
            {
                method: 'GET',
                headers,
            }
        );
        const data = await response.json();
        return data;
    },

    getById: async (id: string): Promise<Book> => {
        const headers = await getAuthHeaders();
        const response = await wrapFetchWithNetworkError(
            `${API_CONFIG.baseURL}${ENDPOINTS.books.getById(id)}`,
            {
                headers
            }
        );
        
        const result = await response.json();
        const book = result.data || result;
        
        if (!book) {
            throw new Error('Livre non trouvé');
        }

        return {
            ...book,
            coverimage: book.cover && book.cover !== '' ? `${API_CONFIG.imageBaseURL}${API_CONFIG.staticPath}${book.cover}` : undefined
        };
    },

    create: async (data: CreateBookData): Promise<Book> => {
        const headers = await getAuthHeaders();
        const response = await wrapFetchWithNetworkError(
            `${API_CONFIG.baseURL}${ENDPOINTS.books.create}`,
            {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            }
        );

        const result = await response.json();
  
        if (!result.data || !result.data.id) {
            throw new Error('ID du livre non trouvé dans la réponse');
        }

        return result.data;
    },

    update: async (id: string, data: UpdateBookData): Promise<Book> => {
        const headers = await getAuthHeaders();
        const response = await wrapFetchWithNetworkError(
            `${API_CONFIG.baseURL}${ENDPOINTS.books.update(id)}`,
            {
                method: 'PUT',
                headers,
                body: JSON.stringify(data),
            }
        );
        const result = await response.json();
        return result.data;
    },

    delete: async (id: string): Promise<void> => {
        try {
            const headers = await getAuthHeaders();
            await wrapFetchWithNetworkError(
                `${API_CONFIG.baseURL}${ENDPOINTS.books.delete(id)}`,
                {
                    method: 'DELETE',
                    headers,
                }
            );
        } catch (error) {
            throw error;
        }
    },

    getByName: async (name: string, limit: number = 10, page: number = 1): Promise<Book[]> => {
        const requestBody = { searchTerm: name, limit, page };
      
        const response = await wrapFetchWithNetworkError(
            `${API_CONFIG.baseURL}${ENDPOINTS.books.getbyname}`,
            {
                method: 'POST',
                headers: {
                    ...API_CONFIG.headers,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestBody)
            }
        );

        const responseData = await response.json();
        const books = responseData.data || responseData;
        return books;
    }
}; 