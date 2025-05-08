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

type UploadeOeuvreGraphNavigationProp = NativeStackNavigationProp<RootStackParamList, 'UploadeOeuvreGraph'>;

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
            const chapterResponse = await apiFetch('/chapters/create', {
                method: 'POST',
                body: JSON.stringify({
                    title: chapterTitle,
                    book_id: parseInt(bookId),
                    status: 'published',
                    order: 1,
                }),
            }) as Response;

            if (!chapterResponse.ok) {
                throw new Error('Erreur lors de la création du chapitre');
            }

            const chapterData = await chapterResponse.json();
            const chapterId = chapterData.data.id;

            // 2. Uploader les images
            const formData = new FormData();
            images.forEach((uri, index) => {
                const fileName = uri.split('/').pop();
                const fileType = fileName?.split('.').pop();

                formData.append('files', {
                    uri,
                    name: fileName,
                    type: `image/${fileType}`,
                } as any);
            });

            formData.append('chapter_id', chapterId.toString());

            const contentResponse = await apiFetch('/bookcontents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            }) as Response;

            if (!contentResponse.ok) {
                throw new Error('Erreur lors de l\'upload des images');
            }

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