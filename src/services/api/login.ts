import { API_CONFIG, ENDPOINTS } from '../../config/api';

export interface LoginCredentials {
    email: string;
    password: string;
}

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
    }
    return response.json();
};

export const loginApi = {
    login: async (credentials: LoginCredentials) => {
        const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.auth.login}`, {
            method: 'POST',
            headers: API_CONFIG.headers,
            body: JSON.stringify(credentials),
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