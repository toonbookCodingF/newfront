import { update } from "lodash";
import { Platform } from 'react-native';

// Déterminer l'URL de base en fonction de la plateforme
const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    // Pour l'émulateur Android
    return 'http://10.0.2.2:3000/api';
  } else if (Platform.OS === 'ios') {
    // Pour l'émulateur iOS
    return 'http://localhost:3000/api';
  } else {
    // Pour le développement web ou autres plateformes
    return 'http://localhost:3000/api';
  }
};

export const API_CONFIG = {
  baseURL: getBaseUrl(),
  imageBaseURL: getBaseUrl().replace('/api', ''),
  staticPath: '/public',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  uploadConfig: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    transformRequest: (data: any) => {
      return data;
    },
    timeout: 60000,
  }
};

// Log de la configuration pour le débogage
console.log('API Configuration:', {
  baseURL: API_CONFIG.baseURL,
  imageBaseURL: API_CONFIG.imageBaseURL,
  staticPath: API_CONFIG.staticPath,
  platform: Platform.OS
});

export const ENDPOINTS = {
  auth: {
    login: '/users/login',
    register: '/users/postUser',
    logout: '/users/logout',
    getbyid: (id: string) => `/users/getById/${id}`,
  },
  user: {
    profile: '/users/profile',
    update: '/users/update',
  },
  books: {
    getAll: '/books',
    getById: (id: string) => `/books/${id}`,
    create: '/books',
    update: (id: string) => `/books/${id}`,
    delete: (id: string) => `/books/${id}`, 
    getbyname: '/books/search',
  },
  chapters: {
    getByBookId: (bookId: string) => `/chapters/book/${bookId}`,
    create: '/chapters/create',
    update: (id: string) => `/chapters/${id}`,
    delete: (id: string) => `/chapters/${id}`,
  },
  paragraphs: {
    getByChapterId: (chapterId: string) => `/bookcontents/chapter/${chapterId}`,
    create: '/bookcontents',
    update: (id: string) => `/bookcontents/${id}`,
    delete: (id: string) => `/bookcontents/${id}`,
  },
  booktypes: {
    getAll: '/booktypes',
  },
  categories: {
    getAll: '/categories',
  },
  comments: {
    getAll: '/comments',
    create: '/comments',
    update: (id: string) => `/comments/${id}`,
    getOne: (id: string) => `/comments/${id}`,
    getAllCommentByBookContent: (bookContentId: string) => `/comments?bookContent_id=${bookContentId}`,
  },
}; 