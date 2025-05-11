import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ImageUploadButton } from '../atoms/ImageUploadButton';
import { ImagePreview } from './ImagePreview';
import { Button } from '../atoms/Button';

interface ImageUploadSectionProps {
    images: Array<{ uri: string; fileName: string; type: string; size: number }>;
    onPickImages: () => void;
    onUpload: () => void;
    uploading: boolean;
}

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
    images,
    onPickImages,
    onUpload,
    uploading
}) => {
    return (
        <View style={styles.container}>
            <ImageUploadButton onPress={onPickImages} disabled={uploading} />

            {images.length > 0 && (
                <>
                    <ImagePreview images={images.map(img => img.uri)} />
                    <Button
                        title={uploading ? 'Enregistrement en cours...' : 'Enregistrer le chapitre'}
                        onPress={onUpload}
                        disabled={uploading}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
}); 