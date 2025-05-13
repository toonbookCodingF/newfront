export const API_CONFIG = {
  baseURL: 'http://10.0.2.2:3000/api',
  imageBaseURL: 'http://10.0.2.2:3000',
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
  imageBaseURL: API_CONFIG.imageBaseURL
});

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
}; 