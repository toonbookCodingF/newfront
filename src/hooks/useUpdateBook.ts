import { useState } from 'react';
import { bookService, UpdateBookData } from '../services/api/books';
import { API_CONFIG } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useUpdateBook = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateBook = async (bookId: string, data: UpdateBookData) => {
        try {
            setIsLoading(true);
            setError(null);

            // Si une nouvelle couverture est fournie, on la traite comme un fichier
            if (data.coverimage && typeof data.coverimage === 'object') {
                const formData = new FormData();

                // Ajouter tous les champs textuels
                Object.entries(data).forEach(([key, value]) => {
                    if (key !== 'coverimage' && value !== undefined && value !== null) {
                        formData.append(key, value.toString());
                    }
                });

                // Ajouter la couverture
                formData.append('cover', data.coverimage as any);

                // Appeler l'API avec FormData
                const response = await fetch(`${API_CONFIG.baseURL}/books/${bookId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
                    },
                    body: formData,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Erreur lors de la mise à jour du livre');
                }

                const result = await response.json();
                return result.data;
            } else {
                // Si pas de nouvelle couverture, utiliser le service normal
                const result = await bookService.update(bookId, data);
                return result;
            }
        } catch (err) {
            console.error('Erreur lors de la mise à jour du livre:', err);
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        updateBook,
        isLoading,
        error,
    };
}; 