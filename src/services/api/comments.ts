import { API_CONFIG, ENDPOINTS } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Comment {
    id: string;
    content: string;
    bookContent_id: number;
    chapter_id?: number;
    user_id: number;
    parentComment_id?: number | null;
    like: number;
    visible: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateCommentData {
    content: string;
    bookContent_id: number;
    chapter_id?: number;
    user_id: number;
    parentComment_id?: number | null;
    like?: number;
    visible?: boolean;
}

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Une erreur est survenue');
    }
    return response.json();
};

export const commentService = {
    getCommentsByBookContent: async (bookContentId: string): Promise<Comment[]> => {
        console.log('Service: Tentative de récupération des commentaires pour bookContentId:', bookContentId);
        
        const token = await AsyncStorage.getItem('token');
        console.log('Service: Token récupéré:', token ? 'Présent' : 'Absent');
        
        if (!token) {
            console.error('Service: Token non trouvé dans AsyncStorage');
            throw new Error('Utilisateur non connecté');
        }

        try {
            // Essayer d'abord sans pagination
            const url = `${API_CONFIG.baseURL}/comments?bookContent_id=${bookContentId}`;
            console.log('Service: URL de la requête:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    ...API_CONFIG.headers,
                    Authorization: `Bearer ${token}`,
                },
            });
            
            console.log('Service: Statut de la réponse:', response.status);
            console.log('Service: Headers de la réponse:', response.headers);
            
            // Vérifier le type de contenu de la réponse
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Service: Réponse non-JSON reçue:', text);
                throw new Error('Réponse invalide du serveur');
            }

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Service: Erreur détaillée du serveur:', errorData);
                throw new Error(errorData.message || 'Erreur lors de la récupération des commentaires');
            }
            
            const result = await response.json();
            console.log('Service: Commentaires reçus:', result);

            // Vérifier si la réponse contient un tableau de commentaires
            if (!Array.isArray(result)) {
                console.error('Service: Réponse invalide - tableau de commentaires attendu:', result);
                throw new Error('Format de réponse invalide');
            }

            return result;
        } catch (error) {
            console.error('Service: Erreur lors de la récupération des commentaires:', error);
            throw error;
        }
    },

    createComment: async (data: CreateCommentData): Promise<Comment> => {
        console.log('Service: Tentative de création de commentaire avec données:', data);
        
        const token = await AsyncStorage.getItem('token');
        console.log('Service: Token récupéré:', token ? 'Présent' : 'Absent');
        
        if (!token) {
            console.error('Service: Token non trouvé dans AsyncStorage');
            throw new Error('Utilisateur non connecté');
        }

        const userDataStr = await AsyncStorage.getItem('userData');
        console.log('Service: Données utilisateur récupérées:', userDataStr ? 'Présentes' : 'Absentes');
        
        if (!userDataStr) {
            console.error('Service: Données utilisateur non trouvées dans AsyncStorage');
            throw new Error('Données utilisateur non trouvées');
        }
        
        const userData = JSON.parse(userDataStr);
        console.log('Service: Données utilisateur parsées:', userData);
        
        const commentData = {
            ...data,
            user_id: userData.id,
            like: data.like || 0,
            visible: data.visible ?? true
        };
        console.log('Service: Données du commentaire à envoyer:', commentData);
        
        try {
            const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.comments.create}`, {
                method: 'POST',
                headers: {
                    ...API_CONFIG.headers,
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(commentData),
            });
            
            console.log('Service: Statut de la réponse:', response.status);
            
            // Vérifier le type de contenu de la réponse
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Service: Réponse non-JSON reçue:', text);
                throw new Error('Réponse invalide du serveur');
            }

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Service: Erreur détaillée du serveur:', errorData);
                throw new Error(errorData.message || 'Erreur lors de la création du commentaire');
            }
            
            const result = await response.json();
            console.log('Service: Réponse de création de commentaire:', result);
            return result;
        } catch (error) {
            console.error('Service: Erreur lors de la création du commentaire:', error);
            throw error;
        }
    },

    updateComment: async (id: string, content: string): Promise<Comment> => {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.comments.update(id)}`, {
            method: 'PUT',
            headers: {
                ...API_CONFIG.headers,
                Authorization: token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({ content }),
        });
        return handleResponse(response);
    },

    deleteComment: async (id: string): Promise<void> => {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.comments.update(id)}`, {
            method: 'DELETE',
            headers: {
                ...API_CONFIG.headers,
                Authorization: token ? `Bearer ${token}` : '',
            },
        });
        return handleResponse(response);
    },
}; 