import { API_CONFIG, ENDPOINTS } from '../../config/api';

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
    return response.json();
};

export const bookService = {
    getAll: async (): Promise<Book[]> => {
        const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.books.getAll}`, {
            method: 'GET',
            headers: API_CONFIG.headers,
        });
        return handleResponse(response);
    },

    getById: async (id: string): Promise<Book> => {
        const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.books.getById(id)}`, {
            method: 'GET',
            headers: API_CONFIG.headers,
        });
        return handleResponse(response);
    },

    create: async (data: CreateBookData): Promise<Book> => {
        console.log('Données reçues par bookService.create:', data);
        console.log('Headers envoyés:', API_CONFIG.headers);
        console.log('URL complète:', `${API_CONFIG.baseURL}${ENDPOINTS.books.create}`);
        
        const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.books.create}`, {
            method: 'POST',
            headers: API_CONFIG.headers,
            body: JSON.stringify(data),
        });
        
        console.log('Statut de la réponse:', response.status);
        console.log('Headers de la réponse:', response.headers);
        
        return handleResponse(response);
    },

    update: async (id: string, data: UpdateBookData): Promise<Book> => {
        const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.books.update(id)}`, {
            method: 'PUT',
            headers: API_CONFIG.headers,
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    delete: async (id: string): Promise<void> => {
        const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.books.delete(id)}`, {
            method: 'DELETE',
            headers: API_CONFIG.headers,
        });
        return handleResponse(response);
    }
}; 