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
            console.log('Tentative de connexion avec:', credentials.email);
            const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.auth.login}`, {
                method: 'POST',
                headers: API_CONFIG.headers,
                body: JSON.stringify(credentials),
            });

            const data = await handleResponse(response);
            console.log('Réponse de connexion reçue:', data);

            // Vérifier si le token est dans data.data.token
            if (data.data && data.data.token) {
                console.log('Token reçu, stockage dans AsyncStorage...');
                await AsyncStorage.setItem('token', data.data.token);
                console.log('Token stocké avec succès');
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
            console.log('Tentative de déconnexion...');
            const token = await AsyncStorage.getItem('token');

            if (!token) {
                console.log('Pas de token trouvé, déconnexion locale uniquement');
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
            console.log('Déconnexion réussie, suppression du token...');
            await AsyncStorage.removeItem('token');
            console.log('Token supprimé avec succès');
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
            console.log('Forçage de la déconnexion...');
            await AsyncStorage.removeItem('token');
            console.log('Token supprimé avec succès');
        } catch (error) {
            console.error('Erreur lors de la déconnexion forcée:', error);
            throw error;
        }
    }
}; 