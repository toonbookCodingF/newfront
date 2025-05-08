import React from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';

interface ImagePreviewProps {
    images: string[];
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ images }) => {
    return (
        <ScrollView horizontal style={styles.scroll}>
            <View style={styles.imageRow}>
                {images.map((uri, index) => (
                    <Image key={index} source={{ uri }} style={styles.image} />
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scroll: {
        marginVertical: 20,
        width: '100%',
    },
    imageRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 180,
        height: 250,
        marginRight: 10,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 8,
    },
}); 