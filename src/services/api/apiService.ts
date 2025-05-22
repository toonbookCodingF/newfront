import { API_CONFIG } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wrapFetchWithNetworkError } from '../../utils/networkUtils';

export const apiFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<{ data: T }> => {
    const token = await AsyncStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await wrapFetchWithNetworkError(
        `${API_CONFIG.baseURL}${endpoint}`,
        {
            ...options,
            headers,
        }
    );

    const data = await response.json();
    return { data };
}; 