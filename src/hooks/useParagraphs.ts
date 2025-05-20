import { useState, useEffect, useCallback } from 'react';
import { API_CONFIG, ENDPOINTS } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Paragraph {
  id: number;
  content: string;
  type: string;
  chapter_id: number;
  createdat: string;
}

export const useParagraphs = (chapterId: string) => {
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParagraphs = useCallback(async () => {
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

      const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.paragraphs.getByChapterId(chapterId)}`, {
        headers,
      });

      const data = await response.json();

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
  }, [chapterId]);

  useEffect(() => {
    if (chapterId) {
      fetchParagraphs();
    }
  }, [chapterId, fetchParagraphs]);

  return { paragraphs, loading, error, refresh: fetchParagraphs };
}; 