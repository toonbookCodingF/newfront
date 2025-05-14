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
    console.log('Token récupéré:', token ? 'Token présent' : 'Token manquant');

    if (!token) {
        throw new Error('Non authentifié. Veuillez vous reconnecter.');
    }

    const headers = {
        ...API_CONFIG.headers,
        'Authorization': `Bearer ${token}`
    };

    console.log('Headers de la requête:', {
        ...headers,
        'Authorization': 'Bearer [TOKEN_MASQUÉ]' // On masque le token dans les logs
    });

    return headers;
};

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error = await response.json();
        console.log('Réponse d\'erreur du serveur:', {
            status: response.status,
            message: error.message,
            headers: response.headers
        });

        if (response.status === 401) {
            throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        if (response.status === 403) {
            throw new Error('Vous n\'êtes pas autorisé à effectuer cette action.');
        }
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
        try {
            console.log('Tentative de suppression du livre:', id);
            const headers = await getAuthHeaders();

            const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.books.delete(id)}`, {
                method: 'DELETE',
                headers,
            });

            console.log('Statut de la réponse:', response.status);
            return handleResponse(response);
        } catch (error) {
            console.error('Erreur détaillée lors de la suppression:', error);
            throw error;
        }
    },

    getByName: async (name: string, limit: number = 10, page: number = 1): Promise<Book[]> => {
        const requestBody = { searchTerm: name, limit, page };
        console.log('Requête de recherche:', {
            url: `${API_CONFIG.baseURL}${ENDPOINTS.books.getbyname}`,
            method: 'POST',
            headers: API_CONFIG.headers,
            body: requestBody
        });

        const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.books.getbyname}`, {
            method: 'POST',
            headers: {
                ...API_CONFIG.headers,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        console.log('Statut de la réponse:', response.status);
        const responseText = await response.text();
        console.log('Réponse brute:', responseText);

        if (!response.ok) {
            throw new Error(`Erreur ${response.status}: ${responseText}`);
        }

        try {
            const responseData = JSON.parse(responseText);
            return responseData.data.map((book: any) => ({
                id: book.id,
                title: book.title,
                description: book.description,
                coverimage: book.cover,
                createdAt: book.createdat,
                updatedAt: book.createdat,
                category_id: book.category_id || 1,
                booktype_id: book.booktype_id,
                user_id: book.user_id,
                status: book.status
            }));
        } catch (error) {
            console.error('Erreur de parsing JSON:', error);
            throw new Error('Erreur de parsing de la réponse');
        }
    }
}; 