import api from './api';
import { ENDPOINTS } from '../config/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post(ENDPOINTS.auth.login, credentials);
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await api.post(ENDPOINTS.auth.register, data);
    return response.data;
  },

  logout: async () => {
    await api.post(ENDPOINTS.auth.logout);
    localStorage.removeItem('token');
  },
}; 