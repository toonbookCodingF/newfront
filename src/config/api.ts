export const API_CONFIG = {
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
    register: '/users/register',
    logout: '/users/logout',
  },
  user: {
    profile: '/users/profile',
    update: '/users/update',
  },
}; 