import { API_CONFIG, ENDPOINTS } from '../config/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.auth.login}`, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  register: async (data: RegisterData) => {
    const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.auth.register}`, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  logout: async () => {
    const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.auth.logout}`, {
      method: 'POST',
      headers: API_CONFIG.headers,
    });
    await handleResponse(response);
    localStorage.removeItem('token');
  },
}; 