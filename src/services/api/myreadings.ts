import { API_CONFIG, ENDPOINTS } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wrapFetchWithNetworkError } from '../../utils/networkUtils';

export interface MyReading {
    id: number;
    user_id: number;
    book_id: number;
    createdat: string;
    isverified: boolean;
}

const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem('token');
    return {
        ...API_CONFIG.headers,
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const myReadingsService = {
    async create(bookId: number): Promise<MyReading> {
        try {
            const headers = await getAuthHeaders();
            if (!headers.Authorization) {
                throw new Error('Non authentifié');
            }

            const token = headers.Authorization.split(' ')[1];
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const userId = decodedToken.id;

            // Vérifier si une lecture existe déjà
            const checkResponse = await wrapFetchWithNetworkError(
                `${API_CONFIG.baseURL}${ENDPOINTS.myreadings.getbyuser(userId.toString())}`,
                { headers }
            );

            const data = await checkResponse.json();
            const existingReadings = data || [];
            const existingReading = existingReadings.find((reading: MyReading) => reading.book_id === bookId);

            if (existingReading) {
                return existingReading;
            }

            const createResponse = await wrapFetchWithNetworkError(
                `${API_CONFIG.baseURL}${ENDPOINTS.myreadings.create}`,
                {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        book_id: bookId,
                        user_id: userId
                    })
                }
            );

            const createData = await createResponse.json();
            
            if (!createData) {
                throw new Error('Réponse de création invalide');
            }

            return createData;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Une erreur inattendue est survenue');
        }
    },

    async getByUser(userId: number): Promise<MyReading[]> {
        try {
            const headers = await getAuthHeaders();
            if (!headers.Authorization) {
                throw new Error('Non authentifié');
            }

            const response = await wrapFetchWithNetworkError(
                `${API_CONFIG.baseURL}${ENDPOINTS.myreadings.getbyuser(userId.toString())}`,
                { headers }
            );

            const data = await response.json();
            return data || [];
        } catch (error) {
            throw error;
        }
    },

    async getByUserVerified(userId: number): Promise<MyReading[]> {
        try {
            const headers = await getAuthHeaders();
            if (!headers.Authorization) {
                throw new Error('Non authentifié');
            }

            const response = await wrapFetchWithNetworkError(
                `${API_CONFIG.baseURL}${ENDPOINTS.myreadings.getbyuserverified(userId.toString())}`,
                { headers }
            );

            const data = await response.json();
            return data || [];
        } catch (error) {
            throw error;
        }
    },

    async changeVerified(readingId: number): Promise<MyReading> {
        try {
            const headers = await getAuthHeaders();
            if (!headers.Authorization) {
                throw new Error('Non authentifié');
            }

            const response = await wrapFetchWithNetworkError(
                `${API_CONFIG.baseURL}${ENDPOINTS.myreadings.changeverified(readingId.toString())}`,
                {
                    method: 'PATCH',
                    headers
                }
            );

            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }
}; 