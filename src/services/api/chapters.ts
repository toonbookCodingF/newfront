import { API_CONFIG, ENDPOINTS } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleApiError, handleNetworkError } from '../../Errorhandler';

type CreateChapterParams = {
  title: string;
  book_id: number;
  status?: string;
  order?: number;
};

type CreateContentParams = {
  content: string;
  chapter_id: number;
  order?: number;
  image?: string | null;
  type?: string;
};

export type UpdateChapterParams = {
  title?: string;
  status?: string;
  order?: number;
};

export type UpdateContentParams = {
  content?: string;
  order?: number;
  image?: string | null;
  type?: string;
};

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  return {
    ...API_CONFIG.headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const chapterService = {
  async createChapter(params: CreateChapterParams) {
    try {
      const headers = await getAuthHeaders();
     

      const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.chapters.create}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...params,
          status: params.status || "published",
          order: params.order ?? 1,
        }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token manquant ou invalide');
        }
        throw new Error(`Erreur ${response.status}: ${responseText}`);
      }

      const result = JSON.parse(responseText);
      const chapterId = result.data?.id;
      if (!chapterId) throw new Error("ID du chapitre introuvable dans la réponse.");

      return { id: chapterId, title: params.title, bookId: params.book_id };
    } catch (error: any) {
      console.error('Erreur lors de la création du chapitre:', error);
      throw new Error(error.message || "Une erreur est survenue lors de la création du chapitre");
    }
  },

  async createBookContent(params: CreateContentParams) {
    try {
      const headers = await getAuthHeaders();
  

      const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.paragraphs.create}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          content: params.content,
          chapter_id: params.chapter_id,
          order: params.order ?? 1,
          image: params.image || null,
          type: params.type || "text",
        }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token manquant ou invalide');
        }
        throw new Error(`Erreur ${response.status}: ${responseText}`);
      }

      return JSON.parse(responseText);
    } catch (error: any) {
      console.error('Erreur lors de la création du contenu:', error);
      throw new Error(error.message || "Une erreur est survenue lors de la création du contenu");
    }
  },

  async updateChapter(chapterId: number, params: UpdateChapterParams) {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.chapters.update(chapterId.toString())}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour du chapitre');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du chapitre:', error);
      throw new Error(error.message || "Une erreur est survenue lors de la mise à jour du chapitre");
    }
  },

  async updateContent(contentId: number, params: UpdateContentParams) {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.paragraphs.update(contentId.toString())}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour du contenu');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du contenu:', error);
      throw new Error(error.message || "Une erreur est survenue lors de la mise à jour du contenu");
    }
  }
}; 