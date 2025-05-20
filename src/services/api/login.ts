import { API_CONFIG, ENDPOINTS } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LoginCredentials {
    email: string;
    password: string;
}

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
    }
    return response.json();
};

export const loginApi = {
    login: async (credentials: LoginCredentials) => {
        try {
            const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.auth.login}`, {
                method: 'POST',
                headers: API_CONFIG.headers,
                body: JSON.stringify(credentials),
            });

            const data = await handleResponse(response);

            // Vérifier si le token est dans data.data.token
            if (data.data && data.data.token) {
                await AsyncStorage.setItem('token', data.data.token);
                return data;
            } else {
                console.error('Structure de réponse invalide:', data);
                throw new Error('Structure de réponse invalide du serveur');
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            throw error;
        }
    },

    logout: async () => {
        try {
            const token = await AsyncStorage.getItem('token');

            if (!token) {
                return;
            }

            const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.auth.logout}`, {
                method: 'POST',
                headers: {
                    ...API_CONFIG.headers,
                    'Authorization': `Bearer ${token}`
                },
            });

            await handleResponse(response);
            await AsyncStorage.removeItem('token');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            // Même en cas d'erreur, on supprime le token localement
            await AsyncStorage.removeItem('token');
            throw error;
        }
    },

    // Nouvelle fonction pour forcer la déconnexion
    forceLogout: async () => {
        try {
            await AsyncStorage.removeItem('token');
        } catch (error) {
            console.error('Erreur lors de la déconnexion forcée:', error);
            throw error;
        }
    }
}; 