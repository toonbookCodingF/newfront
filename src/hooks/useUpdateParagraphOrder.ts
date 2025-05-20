import { useState } from 'react';
import { API_CONFIG, ENDPOINTS } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useUpdateParagraphOrder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateOrder = async (contentId: number, newOrder: number) => {
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

      const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.paragraphs.update(contentId.toString())}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ order: newOrder }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour de l\'ordre');
      }

      return true;
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'ordre:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateOrder,
    isLoading,
    error,
  };
}; 