import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import * as ImagePicker from 'expo-image-picker';
import { FormInput } from '../atoms/FormInput';
import { ImageUploadSection } from '../molecules/ImageUploadSection';
import { apiFetch } from '../services/api/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UploadeOeuvreGraphNavigationProp = NativeStackNavigationProp<RootStackParamList, 'UploadeOeuvreGraph'>;

interface ChapterResponse {
    status: number;
    message: string;
    data: {
        id: number;
        title: string;
        book_id: number;
        status: string;
        order: number;
    }
}

interface ImageAsset {
    uri: string;
    fileName: string;
    type: string;
    size: number;
}

export default function UploadeOeuvreGraph() {
    const route = useRoute();
    const navigation = useNavigation<UploadeOeuvreGraphNavigationProp>();
    const { bookId } = route.params as { bookId: string };
    const [chapterTitle, setChapterTitle] = useState('');
    const [images, setImages] = useState<ImageAsset[]>([]);
    const [uploading, setUploading] = useState(false);

    const pickImages = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permission requise',
                    'Désolé, nous avons besoin de l\'accès à votre galerie pour télécharger des images.'
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                quality: 1,
                selectionLimit: 10,
                presentationStyle: ImagePicker.UIImagePickerPresentationStyle.FULL_SCREEN,
            });

            if (!result.canceled) {
                const newImages = await Promise.all(
                    result.assets.map(async (asset) => {
                        const response = await fetch(asset.uri);
                        const blob = await response.blob();

                        return {
                            uri: asset.uri,
                            fileName: `image_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`,
                            type: blob.type,
                            size: blob.size
                        };
                    })
                );

                setImages((prevImages) => [...prevImages, ...newImages]);
            }
        } catch (error) {
            console.error('Erreur sélection images :', error);
            Alert.alert('Erreur', 'Une erreur est survenue lors de la sélection des images.');
        }
    };

    const uploadImages = async () => {
        if (images.length === 0) {
            Alert.alert('Erreur', 'Veuillez sélectionner au moins une image.');
            return;
        }

        if (!chapterTitle.trim()) {
            Alert.alert('Erreur', 'Veuillez entrer un titre pour le chapitre.');
            return;
        }

        setUploading(true);

        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                throw new Error('Non authentifié. Veuillez vous reconnecter.');
            }

            // 1. Créer le chapitre
            const chapterData = {
                title: chapterTitle,
                book_id: parseInt(bookId),
                status: 'published',
                order: 1,
            };

            console.log('Envoi des données du chapitre:', chapterData);

            const chapterResponse = await apiFetch<ChapterResponse>('/chapters/create', {
                method: 'POST',
                body: JSON.stringify(chapterData),
            });

            console.log('Réponse création chapitre:', chapterResponse);

            if (!chapterResponse.data?.data?.id) {
                throw new Error('Erreur lors de la création du chapitre: Structure de réponse invalide');
            }

            const chapterId = chapterResponse.data.data.id;

            // 2. Envoyer les images
            for (let i = 0; i < images.length; i++) {
                const image = images[i];

                if (image.size > 5 * 1024 * 1024) {
                    throw new Error(`L'image ${i + 1} dépasse la taille maximale de 5MB`);
                }

                const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                if (!allowedTypes.includes(image.type)) {
                    throw new Error(`L'image ${i + 1} n'est pas dans un format supporté (JPEG, PNG, GIF, WEBP)`);
                }

                const response = await fetch(image.uri);
                const blob = await response.blob();
                const imageFile = new File([blob], image.fileName, { type: image.type });

                const formData = new FormData();
                formData.append('image', imageFile);
                formData.append('chapter_id', chapterId.toString());
                formData.append('type', 'image');
                formData.append('order', (i + 1).toString());

                console.log('Envoi de l\'image:', {
                    chapter_id: chapterId,
                    order: i + 1,
                    fileName: image.fileName,
                    size: image.size,
                    type: image.type
                });

                const uploadResponse = await fetch('http://localhost:3000/api/bookcontents', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                    body: formData,
                    signal: AbortSignal.timeout(30000)
                }).catch(error => {
                    if (error.name === 'AbortError') {
                        throw new Error('Le temps d\'upload a dépassé la limite de 30 secondes');
                    }
                    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                        throw new Error('Erreur de connexion au serveur. Vérifiez votre connexion internet.');
                    }
                    throw error;
                });

                if (!uploadResponse.ok) {
                    let errorMessage = uploadResponse.statusText;
                    try {
                        const errorData = await uploadResponse.json();
                        errorMessage = errorData.message || errorMessage;
                    } catch (e) {
                        console.error('Erreur lors de la lecture de la réponse d\'erreur:', e);
                    }

                    console.error('Erreur upload image:', {
                        status: uploadResponse.status,
                        statusText: uploadResponse.statusText,
                        error: errorMessage
                    });
                    throw new Error(`Erreur upload image: ${errorMessage}`);
                }

                const uploadData = await uploadResponse.json();
                console.log('Réponse upload image:', uploadData);
            }

            Alert.alert(
                'Succès',
                'Chapitre et images enregistrés avec succès !',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            setImages([]);
                            setChapterTitle('');
                            navigation.goBack();
                        },
                    },
                ]
            );
        } catch (error) {
            console.error('Erreur upload :', error);
            Alert.alert(
                'Erreur',
                error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'enregistrement.'
            );
        } finally {
            setUploading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <FormInput
                    label="Titre du chapitre"
                    value={chapterTitle}
                    onChangeText={setChapterTitle}
                    placeholder="Ex: Chapitre 1 – L'aventure commence"
                    containerStyle={styles.inputContainer}
                    labelStyle={styles.label}
                    inputStyle={styles.inputText}
                    placeholderTextColor="#ffffff80"
                />

                <ImageUploadSection
                    images={images}
                    onPickImages={pickImages}
                    onUpload={uploadImages}
                    uploading={uploading}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#800080',
    },
    content: {
        padding: 20,
    },
    inputContainer: {
        backgroundColor: 'transparent',
    },
    label: {
        color: '#ffffff',
    },
    inputText: {
        color: '#ffffff',
        borderBottomColor: '#ffffff',
        borderBottomWidth: 1,
        backgroundColor: 'transparent',
    },
}); 