import { API_CONFIG, ENDPOINTS } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
            const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.myreadings.getbyuser(userId.toString())}`, {
                headers
            });

            if (response.ok) {
                const data = await response.json();
                const existingReadings = data || [];
                const existingReading = existingReadings.find((reading: MyReading) => reading.book_id === bookId);

                if (existingReading) {
                    return existingReading;
                }
            }

            const createResponse = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.myreadings.create}`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    book_id: bookId,
                    user_id: userId
                })
            });

            if (!createResponse.ok) {
                const errorText = await createResponse.text();
                let errorMessage = `Erreur lors de la création: ${createResponse.status}`;
                try {
                    const errorData = JSON.parse(errorText);
                    if (errorData.message) {
                        errorMessage = errorData.message;
                    }
                } catch (e) {
                    // Si le parsing JSON échoue, on garde le message d'erreur par défaut
                }
                throw new Error(errorMessage);
            }

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

            const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.myreadings.getbyuser(userId.toString())}`, {
                headers
            });

            if (!response.ok) {
                throw new Error(`Erreur lors de la récupération des lectures: ${response.status}`);
            }

            const data = await response.json();
            return data || [];
        } catch (error) {
            console.error('Erreur lors de la récupération des lectures:', error);
            throw error;
        }
    },

    async getByUserVerified(userId: number): Promise<MyReading[]> {
        try {
            const headers = await getAuthHeaders();
            if (!headers.Authorization) {
                throw new Error('Non authentifié');
            }

            const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.myreadings.getbyuserverified(userId.toString())}`, {
                headers
            });

            if (!response.ok) {
                throw new Error(`Erreur lors de la récupération des favoris: ${response.status}`);
            }

            const data = await response.json();
            return data || [];
        } catch (error) {
            console.error('Erreur lors de la récupération des favoris:', error);
            throw error;
        }
    },

    async changeVerified(readingId: number): Promise<MyReading> {
        try {
            const headers = await getAuthHeaders();
            if (!headers.Authorization) {
                throw new Error('Non authentifié');
            }

            const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.myreadings.changeverified(readingId.toString())}`, {
                method: 'PATCH',
                headers
            });

            if (!response.ok) {
                throw new Error(`Erreur lors de la mise à jour: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            throw error;
        }
    }
}; 