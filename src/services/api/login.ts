import { API_CONFIG, ENDPOINTS } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from './apiService';

export interface LoginCredentials {
    email: string;
    password: string;
}

interface LoginResponse {
    token: string;
    user: {
        id: number;
        email: string;
        name: string;
    };
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
        const response = await apiFetch<LoginResponse>(ENDPOINTS.auth.login, {
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        if (response.data.token) {
            await AsyncStorage.setItem('token', response.data.token);
        }

        return response.data;
    },

    logout: async () => {
        await apiFetch(ENDPOINTS.auth.logout, {
            method: 'POST',
        });
        await AsyncStorage.removeItem('token');
    },
}; 