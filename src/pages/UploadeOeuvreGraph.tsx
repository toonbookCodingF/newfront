import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import * as ImagePicker from 'expo-image-picker';
import { FormInput } from '../atoms/FormInput';
import { Button } from '../atoms/Button';
import { ImagePreview } from '../molecules/ImagePreview';
import { apiFetch } from '../services/api/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UploadeOeuvreGraphNavigationProp = NativeStackNavigationProp<RootStackParamList, 'UploadeOeuvreGraph'>;

interface ChapterResponse {
    data: {
        message: string;
        data: {
            id: number;
            title: string;
            book_id: number;
            status: string;
            order: number;
        }
    }
}

export default function UploadeOeuvreGraph() {
    const route = useRoute();
    const navigation = useNavigation<UploadeOeuvreGraphNavigationProp>();
    const { bookId } = route.params as { bookId: string };
    const [chapterTitle, setChapterTitle] = useState('');
    const [images, setImages] = useState<string[]>([]);
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
            });

            if (!result.canceled) {
                const uris = result.assets.map((asset) => asset.uri);
                setImages((prevImages) => [...prevImages, ...uris]);
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

            console.log('Réponse création chapitre complète:', JSON.stringify(chapterResponse, null, 2));

            if (!chapterResponse.data?.data?.data?.id) {
                console.error('Structure de réponse invalide:', chapterResponse);
                throw new Error('Erreur lors de la création du chapitre: Structure de réponse invalide');
            }

            const chapterId = chapterResponse.data.data.data.id;
            console.log('ID du chapitre créé:', chapterId);

            // 2. Uploader les images
            const token = await AsyncStorage.getItem('token');
            const formData = new FormData();

            // Ajouter le chapter_id en premier
            formData.append('chapter_id', chapterId.toString());

            // Ajouter chaque image
            for (const uri of images) {
                const fileName = uri.split('/').pop();
                const fileType = fileName?.split('.').pop() || 'jpg';

                formData.append('files', {
                    uri,
                    name: `image_${Date.now()}.${fileType}`,
                    type: `image/${fileType}`,
                } as any);
            }

            console.log('Envoi des données du contenu:', {
                chapter_id: chapterId,
                nombre_images: images.length,
                formData: formData
            });

            const response = await fetch('http://localhost:3000/api/bookcontents', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Réponse serveur:', errorText);
                throw new Error(`Erreur serveur (${response.status}): ${errorText}`);
            }

            const contentResponse = await response.json();
            console.log('Réponse upload contenu:', contentResponse);

            Alert.alert(
                'Succès',
                'Chapitre et images uploadés avec succès !',
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
                error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'upload.'
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
                />

                <Button
                    title="Choisir des images"
                    onPress={pickImages}
                    disabled={uploading}
                    style={styles.button}
                />

                {images.length > 0 && (
                    <>
                        <ImagePreview images={images} />
                        <Button
                            title={uploading ? 'Upload en cours...' : 'Uploader les images'}
                            onPress={uploadImages}
                            disabled={uploading}
                            style={styles.button}
                        />
                    </>
                )}
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
    button: {
        marginVertical: 10,
    },
}); 