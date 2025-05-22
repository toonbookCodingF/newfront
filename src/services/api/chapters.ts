import { API_CONFIG, ENDPOINTS } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wrapFetchWithNetworkError } from '../../utils/networkUtils';

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

export interface Chapter {
  id: number;
  title: string;
  book_id: number;
  status: string;
  order: number;
  createdat: string;
  updated_at: string;
}

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  return {
    ...API_CONFIG.headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const chapterService = {
  async getByBookId(bookId: number): Promise<Chapter[]> {
    try {
      const headers = await getAuthHeaders();
      const response = await wrapFetchWithNetworkError(
        `${API_CONFIG.baseURL}${ENDPOINTS.chapters.getByBookId(bookId.toString())}`,
        { headers }
      );
      const data = await response.json();
      return data || [];
    } catch (error) {
      throw error;
    }
  },

  async getById(id: number): Promise<Chapter> {
    try {
      const headers = await getAuthHeaders();
      const response = await wrapFetchWithNetworkError(
        `${API_CONFIG.baseURL}${ENDPOINTS.chapters.getById(id.toString())}`,
        { headers }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  async create(params: CreateChapterParams): Promise<Chapter> {
    try {
      const headers = await getAuthHeaders();
      const response = await wrapFetchWithNetworkError(
        `${API_CONFIG.baseURL}${ENDPOINTS.chapters.create}`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(params)
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  async update(id: number, params: UpdateChapterParams): Promise<Chapter> {
    try {
      const headers = await getAuthHeaders();
      const response = await wrapFetchWithNetworkError(
        `${API_CONFIG.baseURL}${ENDPOINTS.chapters.update(id.toString())}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify(params)
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      const headers = await getAuthHeaders();
      await wrapFetchWithNetworkError(
        `${API_CONFIG.baseURL}${ENDPOINTS.chapters.delete(id.toString())}`,
        {
          method: 'DELETE',
          headers
        }
      );
    } catch (error) {
      throw error;
    }
  },

  async createBookContent(params: CreateContentParams) {
    try {
      const headers = await getAuthHeaders();
      const response = await wrapFetchWithNetworkError(
        `${API_CONFIG.baseURL}${ENDPOINTS.paragraphs.create}`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            content: params.content,
            chapter_id: params.chapter_id,
            order: params.order ?? 1,
            image: params.image || null,
            type: params.type || "text",
          }),
        }
      );
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  async updateContent(contentId: number, params: UpdateContentParams) {
    try {
      const headers = await getAuthHeaders();
      const response = await wrapFetchWithNetworkError(
        `${API_CONFIG.baseURL}${ENDPOINTS.paragraphs.update(contentId.toString())}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify(params),
        }
      );
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}; 