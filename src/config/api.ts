export const API_CONFIG = {
  //baseURL: 'http://10.0.2.2:3000/api',
  baseURL: 'http://localhost:3000/api',
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
    logout: '/users/logout'
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
    search: '/books/search',
  },
  booktypes: {
    getAll: '/booktypes',
  },
  categories: {
    getAll: '/categories',
  },
}; 