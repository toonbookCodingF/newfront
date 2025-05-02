import { API_CONFIG, ENDPOINTS } from '../config/api';

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
      const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.auth.login}`, {
        method: 'POST',
        headers: API_CONFIG.headers,
        body: JSON.stringify(credentials),
      });
      return handleResponse(response);
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
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Erreur lors de la déconnexion');
    }
  },
}; 