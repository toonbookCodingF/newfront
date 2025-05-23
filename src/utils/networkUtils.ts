import { Alert, Platform } from 'react-native';

const TIMEOUT_DURATION = 15000; // 15 secondes

const showAlert = (title: string, message: string) => {
  // S'assurer que l'alerte est affichée sur le thread principal
  setTimeout(() => {
    Alert.alert(
      title,
      message,
      [{ text: 'OK', onPress: () => {} }],
      { cancelable: true }
    );
  }, 100);
};

export const showNoInternetAlert = () => {
  showAlert(
    'Erreur de connexion',
    'Pas de connexion internet. Veuillez vérifier votre connexion et réessayer.'
  );
};

export const showServerErrorAlert = () => {
  showAlert(
    'Erreur serveur',
    'Le serveur ne répond pas. Veuillez réessayer plus tard.'
  );
};

export const checkInternetConnection = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('https://www.google.com', {
      method: 'HEAD',
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const handleNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();
    const errorName = error.name.toLowerCase();

    // On ne garde que les erreurs qui indiquent vraiment un problème de connexion internet
    const networkErrorMessages = [
      'no internet connection',
      'pas de connexion internet',
      'network is unreachable',
      'no connection',
      'offline'
    ];

    return networkErrorMessages.some(msg => 
      errorMessage === msg || errorName === msg
    );
  }
  return false;
};

export const wrapFetchWithNetworkError = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  // Ne pas appliquer la gestion d'erreur réseau pour la page de login
  if (url.includes('/auth/login')) {
    return fetch(url, options);
  }

  try {
    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      showNoInternetAlert();
      throw new Error('Pas de connexion internet');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

    const fetchOptions = {
      ...options,
      signal: controller.signal
    };

    try {
      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);
      
      // Si la réponse n'est pas ok (erreur serveur), on affiche l'erreur
      if (!response.ok) {
        const errorData = await response.json();
        showServerErrorAlert();
        throw new Error(errorData.message || 'Erreur serveur');
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          showServerErrorAlert();
        } else if (error.message === 'Network request failed') {
          // Si on a internet mais que le serveur ne répond pas
          showServerErrorAlert();
        } else if (handleNetworkError(error)) {
          showNoInternetAlert();
        } else {
          showServerErrorAlert();
        }
      }
      throw error;
    }
  } catch (error) {
    throw error;
  }
}; 