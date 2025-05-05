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

  const createChapter = async (bookId: number, title: string): Promise<CreateChapterResponse> => {
    try {
      setIsLoading(true);
      setError(null);
      return await chapterService.createChapter({
        title,
        book_id: bookId,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createBookContent = async (chapterId: number, content: string): Promise<CreateBookContentResponse> => {
    try {
      setIsLoading(true);
      setError(null);
      return await chapterService.createBookContent({
        content,
        chapter_id: chapterId,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
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