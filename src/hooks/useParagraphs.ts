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

        const token = await AsyncStorage.getItem("userToken");
        const headers = {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        };

        const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.paragraphs.getByChapterId(chapterId)}`, {
          headers,
        });

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: Impossible de récupérer les paragraphes`);
        }

        const data = await response.json();
        setParagraphs(data);
      } catch (err) {
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