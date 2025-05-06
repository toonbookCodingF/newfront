import { Alert } from 'react-native';

export async function handleApiError(response: Response, defaultMessage: string) {
  try {
    const errorData = await response.json();
    throw new Error(errorData.message || defaultMessage);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(defaultMessage);
  }
}

export function handleNetworkError(error: any, defaultMessage: string) {
  if (error instanceof Error) {
    Alert.alert('Erreur', error.message);
  } else {
    Alert.alert('Erreur', defaultMessage);
  }
} 