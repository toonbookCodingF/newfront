import { API_CONFIG, ENDPOINTS } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
    id: number;
    username: string;
    email: string;
    name: string;
    lastName: string;
}

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Une erreur est survenue');
    }
    return response.json();
};

export const userService = {
    getUserById: async (id: number): Promise<User> => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            throw new Error('Utilisateur non connecté');
        }

        try {
            // Utiliser l'endpoint de profil sans ID car il renvoie les informations de l'utilisateur connecté
            const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.user.profile}`, {
                method: 'GET',
                headers: {
                    ...API_CONFIG.headers,
                    Authorization: `Bearer ${token}`,
                },
            });

            // Vérifier le type de contenu de la réponse
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Service: Réponse non-JSON reçue:', text);
                throw new Error('Réponse invalide du serveur');
            }

            const userData = await handleResponse(response);
            console.log('Service: Données utilisateur reçues:', userData);
            return userData;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            throw error;
        }
    },
}; 