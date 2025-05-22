import { API_CONFIG, ENDPOINTS } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LoginCredentials {
    email: string;
    password: string;
}

export const loginApi = {
    login: async (credentials: LoginCredentials) => {
        const response = await fetch(
            `${API_CONFIG.baseURL}${ENDPOINTS.auth.login}`,
            {
                method: 'POST',
                headers: API_CONFIG.headers,
                body: JSON.stringify(credentials),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erreur lors de la connexion');
        }

        return response.json();
    },

    logout: async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                return;
            }

            const response = await fetch(
                `${API_CONFIG.baseURL}${ENDPOINTS.auth.logout}`,
                {
                    method: 'POST',
                    headers: {
                        ...API_CONFIG.headers,
                        'Authorization': `Bearer ${token}`
                    },
                }
            );
            await AsyncStorage.removeItem('token');
        } catch (error) {
            // Même en cas d'erreur, on supprime le token localement
            await AsyncStorage.removeItem('token');
            throw error;
        }
    },

    forceLogout: async () => {
        try {
            await AsyncStorage.removeItem('token');
        } catch (error) {
            throw new Error('Erreur lors de la déconnexion');
        }
    }
}; 