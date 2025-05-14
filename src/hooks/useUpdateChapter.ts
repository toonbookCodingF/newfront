import { useState } from 'react';
import { chapterService, UpdateChapterParams, UpdateContentParams } from '../services/api/chapters';

export const useUpdateChapter = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateChapter = async (chapterId: number, data: UpdateChapterParams) => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await chapterService.updateChapter(chapterId, data);
            return result;
        } catch (err) {
            console.error('Erreur lors de la mise à jour du chapitre:', err);
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const updateContent = async (contentId: number, data: UpdateContentParams) => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await chapterService.updateContent(contentId, data);
            return result;
        } catch (err) {
            console.error('Erreur lors de la mise à jour du contenu:', err);
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        updateChapter,
        updateContent,
        isLoading,
        error,
    };
}; 