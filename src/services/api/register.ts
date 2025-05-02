import { API_CONFIG, ENDPOINTS } from '../../config/api';

export interface RegisterData {
    email: string;
    password: string;
    name: string;
}

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
    }
    return response.json();
};

export const registerApi = {
    register: async (data: RegisterData) => {
        const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.auth.register}`, {
            method: 'POST',
            headers: API_CONFIG.headers,
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },
}; 