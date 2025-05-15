import { useState } from 'react';
import { API_CONFIG, ENDPOINTS } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useDeleteContent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteContent = async (contentId: number) => {
        try {
            setIsLoading(true);
            setError(null);

            const token = await AsyncStorage.getItem('token');
            if (!token) {
                throw new Error('Non authentifié. Veuillez vous reconnecter.');
            }

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.paragraphs.delete(contentId.toString())}`, {
                method: 'DELETE',
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de la suppression du contenu');
            }

            return true;
        } catch (err) {
            console.error('Erreur lors de la suppression du contenu:', err);
            setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la suppression');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { deleteContent, isLoading, error };
}; 