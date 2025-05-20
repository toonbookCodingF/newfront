import { useState } from 'react';
import { chapterService } from '../services/api/chapters';

interface CreateChapterResponse {
  id: number;
  title: string;
  bookId: number;
}

interface CreateBookContentResponse {
  id: number;
  content: string;
  chapterId: number;
}

export const useCreateChapter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createChapter = async (bookId: number, title: string, order?: number): Promise<CreateChapterResponse> => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Création de chapitre - Paramètres reçus:', { bookId, title, order });
      
      // S'assurer que l'ordre est un nombre valide et positif
      const validOrder = (typeof order === 'number' && !isNaN(order) && order > 0) ? order : 1;
      console.log('Ordre validé:', validOrder);
      
      const result = await chapterService.createChapter({
        title,
        book_id: bookId,
        order: validOrder,
      });
      console.log('Chapitre créé avec succès:', result);

      return result;
    } catch (err) {
      console.error('Erreur détaillée:', err);
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createBookContent = async (
    chapterId: number, 
    content: string, 
    order?: number,
    image?: string,
    type: string = 'text'
  ): Promise<CreateBookContentResponse> => {
    try {
      setIsLoading(true);
      setError(null);
      return await chapterService.createBookContent({
        content,
        chapter_id: chapterId,
        order,
        image,
        type,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createChapter,
    createBookContent,
    isLoading,
    error,
  };
}; 