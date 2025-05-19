import { API_CONFIG, ENDPOINTS } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  name: string;
  lastName: string;
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Une erreur est survenue lors de la communication avec le serveur');
  }
  return response.json();
};

export const authService = {
  login: async (credentials: LoginCredentials) => {
    try {
      console.log('Tentative de connexion avec:', credentials);
      const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.auth.login}`, {
        method: 'POST',
        headers: API_CONFIG.headers,
        body: JSON.stringify(credentials),
      });
      
      console.log('Statut de la réponse:', response.status);
      const data = await handleResponse(response);
      console.log('Réponse de connexion complète:', JSON.stringify(data, null, 2));
      
      if (data.token) {
        console.log('Token reçu, stockage dans AsyncStorage');
        await AsyncStorage.setItem('token', data.token);
        
        if (data.user) {
          console.log('Données utilisateur reçues:', JSON.stringify(data.user, null, 2));
          await AsyncStorage.setItem('userData', JSON.stringify(data.user));
          
          // Vérification du stockage
          const storedUserData = await AsyncStorage.getItem('userData');
          console.log('Données utilisateur stockées:', storedUserData);
        } else {
          console.warn('Aucune donnée utilisateur reçue dans la réponse');
        }
      } else {
        console.warn('Aucun token reçu dans la réponse');
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Erreur de connexion au serveur');
    }
  },

  register: async (data: RegisterData) => {
    try {
      console.log('Sending registration data:', data);
      const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.auth.register}`, {
        method: 'POST',
        headers: API_CONFIG.headers,
        body: JSON.stringify(data),
      });
      console.log('Registration response status:', response.status);
      return handleResponse(response);
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Erreur lors de l\'inscription. Veuillez réessayer.');
    }
  },

  logout: async () => {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.auth.logout}`, {
        method: 'POST',
        headers: API_CONFIG.headers,
      });
      await handleResponse(response);
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userData');
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Erreur lors de la déconnexion');
    }
  },
}; 