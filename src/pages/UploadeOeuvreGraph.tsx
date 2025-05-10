import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { FormInput } from '../atoms/FormInput';
import { Button } from '../atoms/Button';
import { ImagePreview } from '../molecules/ImagePreview';
import { apiFetch } from '../services/api/apiService';

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
                // Copier les images dans le dossier local
                const newImages = await Promise.all(
                    result.assets.map(async (asset) => {
                        const fileName = `image_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
                        const destination = `${FileSystem.documentDirectory}img/oeuvreGraph/${fileName}`;

                        // Créer le dossier s'il n'existe pas
                        await FileSystem.makeDirectoryAsync(
                            `${FileSystem.documentDirectory}img/oeuvreGraph`,
                            { intermediates: true }
                        );

                        // Copier l'image
                        await FileSystem.copyAsync({
                            from: asset.uri,
                            to: destination
                        });

                        return destination;
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

            if (!chapterResponse.data?.data?.data?.id) {
                throw new Error('Erreur lors de la création du chapitre: Structure de réponse invalide');
            }

            const chapterId = chapterResponse.data.data.data.id;

            // 2. Envoyer les URLs des images au backend
            const contentData = {
                chapter_id: chapterId,
                images: images.map(imagePath => ({
                    path: imagePath,
                    order: images.indexOf(imagePath) + 1
                }))
            };

            const response = await apiFetch('/bookcontents', {
                method: 'POST',
                body: JSON.stringify(contentData),
            });

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
                            title={uploading ? 'Enregistrement en cours...' : 'Enregistrer le chapitre'}
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