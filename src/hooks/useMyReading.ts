import { useState } from 'react';
import { myReadingsService, MyReading } from '../services/api/myreadings';

export const useMyReading = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createMyReading = async (bookId: number): Promise<MyReading> => {
        try {
            setLoading(true);
            setError(null);
            const reading = await myReadingsService.create(bookId);
            return reading;
        } catch (err: any) {
            const errorMessage = err.message || 'Une erreur est survenue lors de la création de la lecture';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        createMyReading,
        loading,
        error
    };
}; 