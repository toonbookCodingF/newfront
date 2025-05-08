import { API_CONFIG, ENDPOINTS } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    return {
        ...API_CONFIG.headers,
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Token manquant ou invalide');
        }
        const error = await response.json();
        throw new Error(error.message || 'Une erreur est survenue');
    }
    const data = await response.json();
    return data;
};

export const bookService = {
    getAll: async (): Promise<Book[]> => {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.books.getAll}`, {
            method: 'GET',
            headers,
        });
        return handleResponse(response);
    },

    getById: async (id: string): Promise<Book> => {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.books.getById(id)}`, {
            method: 'GET',
            headers,
        });
        return handleResponse(response);
    },

    create: async (data: CreateBookData): Promise<Book> => {
        const headers = await getAuthHeaders();
        console.log('Headers avec token:', headers);

        const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.books.create}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });

        console.log('Statut de la réponse:', response.status);
        console.log('Headers de la réponse:', response.headers);

        const result = await handleResponse(response);
        console.log('Résultat de la création:', result);

        if (!result.data || !result.data.id) {
            throw new Error('ID du livre non trouvé dans la réponse');
        }

        return result.data;
    },

    update: async (id: string, data: UpdateBookData): Promise<Book> => {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.books.update(id)}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    delete: async (id: string): Promise<void> => {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.books.delete(id)}`, {
            method: 'DELETE',
            headers,
        });
        return handleResponse(response);
    }
}; 