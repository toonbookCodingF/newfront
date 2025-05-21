import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { myReadingsService } from '../services/api/myreadings';
import { bookService } from '../services/api/books';
import { BookCard } from '../atoms/BookCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LibraryStackParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { API_CONFIG } from '../config/api';

type NavigationProp = NativeStackNavigationProp<LibraryStackParamList>;

export const MyReadings: React.FC = () => {
    const [readings, setReadings] = useState<any[]>([]);
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigation = useNavigation<NavigationProp>();

    useEffect(() => {
        const loadReadings = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    throw new Error('Non authentifié');
                }

                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                const userId = decodedToken.id;

                const userReadings = await myReadingsService.getByUser(userId);
                setReadings(userReadings);

                // Charger les détails des livres
                const booksPromises = userReadings.map(reading => 
                    bookService.getById(reading.book_id.toString())
                );
                const booksData = await Promise.all(booksPromises);
                
                const formattedBooks = booksData.map(book => ({
                    ...book,
                    coverimage: book.cover && book.cover !== '' ? `${API_CONFIG.imageBaseURL}${API_CONFIG.staticPath}${book.cover}` : undefined
                }));
                setBooks(formattedBooks);
            } catch (err: any) {
                setError(err.message || 'Une erreur est survenue');
            } finally {
                setLoading(false);
            }
        };

        loadReadings();
    }, []);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#A020F0" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.error}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.header}>Mes Lectures</Text>
            </View>
            {books.length === 0 ? (
                <Text style={styles.emptyText}>Vous n'avez pas encore commencé de lecture</Text>
            ) : (
                <FlatList
                    data={books}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    renderItem={({ item }) => (
                        <BookCard
                            book={item}
                            onPress={(book) => navigation.navigate('OeuvrePage', { id: book.id.toString() })}
                        />
                    )}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#A020F0',
        padding: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        marginRight: 10,
    },
    header: {
        fontSize: 26,
        color: '#fff',
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    list: {
        paddingBottom: 20,
    },
    row: {
        justifyContent: 'space-between',
    },
    error: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    emptyText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#A020F0',
    },
}); 