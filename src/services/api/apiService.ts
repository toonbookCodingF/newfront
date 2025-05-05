import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../../config/api';

export interface ApiResponse<T> {
    data: T;
    message?: string;
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = await AsyncStorage.getItem('token');
    console.log('Token récupéré:', token);

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    console.log('Headers complets:', headers);

    const url = `${API_CONFIG.baseURL}${endpoint}`;
    console.log('URL complète:', url);
    console.log('Options de la requête:', options);

    const response = await fetch(url, {
        ...options,
        headers,
    });

    console.log('Statut de la réponse:', response.status);
    console.log('Headers de la réponse:', response.headers);

    if (!response.ok) {
        const error = await response.json();
        console.error('Erreur API:', error);
        throw new Error(error.message || 'Une erreur est survenue');
    }

    const data = await response.json();
    console.log('Données reçues:', data);
    return data;
} 