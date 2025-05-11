import { useState, useEffect } from 'react';
import { API_CONFIG, ENDPOINTS } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Paragraph {
  id: number;
  content: string;
}

export const useParagraphs = (chapterId: string) => {
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParagraphs = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error('Non authentifié. Veuillez vous reconnecter.');
        }

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        console.log('Fetching paragraphs for chapter:', chapterId);
        const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.paragraphs.getByChapterId(chapterId)}`, {
          headers,
        });

        console.log('Paragraphs response status:', response.status);
        const data = await response.json();
        console.log('Paragraphs response data:', data);

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: Impossible de récupérer les paragraphes`);
        }

        setParagraphs(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error('Erreur dans useParagraphs:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    if (chapterId) {
      fetchParagraphs();
    }
  }, [chapterId]);

  return { paragraphs, loading, error };
}; 