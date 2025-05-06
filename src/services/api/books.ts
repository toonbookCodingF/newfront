import { ENDPOINTS } from '../../config/api';
import { apiFetch } from './apiService';

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

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Une erreur est survenue');
    }
    const data = await response.json();
    console.log('Réponse complète:', data);
    return data;
};

export const bookService = {
    getAll: async (): Promise<Book[]> => {
        const response = await apiFetch<Book[]>(ENDPOINTS.books.getAll);
        return response.data;
    },

    getById: async (id: string): Promise<Book> => {
        const response = await apiFetch<Book>(ENDPOINTS.books.getById(id));
        return response.data;
    },

    create: async (data: CreateBookData): Promise<Book> => {
        console.log('Données reçues par bookService.create:', data);
        const response = await apiFetch<Book>(ENDPOINTS.books.create, {
            method: 'POST',
            body: JSON.stringify(data),
        });

        console.log('Réponse de création:', response);

        if (!response.data || !response.data.id) {
            throw new Error('ID du livre non trouvé dans la réponse');
        }

        return response.data;
    },

    update: async (id: string, data: UpdateBookData): Promise<Book> => {
        const response = await apiFetch<Book>(ENDPOINTS.books.update(id), {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiFetch(ENDPOINTS.books.delete(id), {
            method: 'DELETE',
        });
    }
}; 