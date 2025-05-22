import { API_CONFIG } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wrapFetchWithNetworkError } from '../../utils/networkUtils';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const token = await AsyncStorage.getItem('token');

    const defaultHeaders = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    const headers = {
        ...defaultHeaders,
        ...options.headers,
    };

    return wrapFetchWithNetworkError(
        `${API_CONFIG.baseURL}${endpoint}`,
        {
            ...options,
            headers,
        }
    );
}; 