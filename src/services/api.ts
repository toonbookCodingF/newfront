import axios from 'axios';
import { API_CONFIG } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkInternetConnection, showNoInternetAlert, handleNetworkError } from '../utils/networkUtils';

const TIMEOUT_DURATION = 15000; // 15 secondes

const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: TIMEOUT_DURATION,
  headers: API_CONFIG.headers,
});

// Intercepteur pour vérifier la connexion internet
api.interceptors.request.use(async (config) => {
  const isConnected = await checkInternetConnection();
  if (!isConnected) {
    showNoInternetAlert();
    return Promise.reject(new Error('Pas de connexion internet'));
  }
  return config;
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Gérer les erreurs de timeout
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      showNoInternetAlert();
      return Promise.reject(new Error('La requête a pris trop de temps. Vérifiez votre connexion internet.'));
    }

    // Gérer les erreurs de réseau
    if (handleNetworkError(error)) {
      return Promise.reject(error);
    }

    // Gérer les erreurs d'authentification
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userData');
    }

    return Promise.reject(error);
  }
);

export default api; 