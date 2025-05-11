import { update } from "lodash";

export const API_CONFIG = {
  // Configuration pour le développement local (navigateur)
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  imageBaseURL: process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace('/api', '') : 'http://localhost:3000',

  // Configuration pour l'émulateur Android (décommenter ces lignes et commenter les lignes au-dessus)
  // baseURL: process.env.REACT_APP_API_URL || 'http://10.0.2.2:3000/api',
  // imageBaseURL: process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace('/api', '') : 'http://10.0.2.2:3000',

  staticPath: '/public',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

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