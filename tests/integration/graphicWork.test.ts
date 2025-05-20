import request from 'supertest';
import { API_CONFIG } from '@/config/api';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Charger les variables d'environnement de test depuis le dossier tests
dotenv.config({ path: path.join(__dirname, '../.env.test') });

// URL de l'API pour les tests
const API_URL = process.env.API_URL || 'https://backend-production-6328.up.railway.app/api';

describe('Graphic Work Upload API', () => {
    let authToken: string;

    // Augmenter le timeout à 30 secondes
    jest.setTimeout(30000);

    beforeAll(async () => {
        try {
            // Vérifier que les variables d'environnement sont disponibles
            if (!process.env.TEST_USER_EMAIL || !process.env.TEST_USER_PASSWORD) {
                throw new Error('Variables d\'environnement manquantes. Vérifiez le fichier .env.test');
            }

            console.log('Tentative de connexion à:', API_URL);

            // Simuler une connexion pour obtenir un token
            const loginResponse = await request(API_URL)
                .post('/users/login')
                .send({
                    email: process.env.TEST_USER_EMAIL,
                    password: process.env.TEST_USER_PASSWORD
                });

            console.log('Login response:', loginResponse.body);

            if (loginResponse.status === 401) {
                throw new Error(`Erreur d'authentification: ${loginResponse.body.message}`);
            }

            if (!loginResponse.body.data?.token) {
                throw new Error(`Structure de réponse invalide: ${JSON.stringify(loginResponse.body)}`);
            }

            authToken = loginResponse.body.data.token;
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            throw error;
        }
    });

    it('should upload a graphic work successfully', async () => {
        // Chemin vers un fichier de test
        const testFilePath = path.join(__dirname, 'test-image.jpg');

        // Créer un fichier de test temporaire si nécessaire
        if (!fs.existsSync(testFilePath)) {
            // Créer un fichier image vide pour le test
            fs.writeFileSync(testFilePath, '');
        }

        try {
            const response = await request(API_URL)
                .post('/books')
                .set('Authorization', `Bearer ${authToken}`)
                .field('title', 'Test Graphic Work')
                .field('description', 'Test Description')
                .field('category_id', '1')
                .field('booktype_id', '1')
                .field('status', 'published')
                .field('user_id', '1')
                .attach('cover', testFilePath);

            console.log('Upload response:', response.body);

            // Vérifier si la réponse contient un message d'erreur
            if (response.status === 400) {
                console.error('Erreur de validation:', response.body);
                throw new Error(`Erreur de validation: ${JSON.stringify(response.body)}`);
            }

            expect(response.status).toBe(201);
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data).toHaveProperty('cover');
            expect(response.body.message).toBe('book created successfully');
        } catch (error) {
            console.error('Erreur lors du test d\'upload:', error);
            throw error;
        } finally {
            // Nettoyer le fichier de test
            if (fs.existsSync(testFilePath)) {
                fs.unlinkSync(testFilePath);
            }
        }
    });

    it('should handle invalid file types', async () => {
        const testFilePath = path.join(__dirname, 'test.txt');
        fs.writeFileSync(testFilePath, 'test content');

        try {
            const response = await request(API_URL)
                .post('/books')
                .set('Authorization', `Bearer ${authToken}`)
                .field('title', 'Test Invalid File')
                .field('description', 'Test Description')
                .field('category_id', '1')
                .field('booktype_id', '1')
                .field('status', 'published')
                .field('user_id', '1')
                .attach('cover', testFilePath);

            console.log('Invalid file response:', response.body);

            // Accepter soit 400 soit 500 comme code d'erreur valide
            expect([400, 500]).toContain(response.status);

            // Vérifier si la réponse contient un message d'erreur ou est vide
            if (Object.keys(response.body).length > 0) {
                expect(response.body).toHaveProperty('error');
            }
        } catch (error) {
            console.error('Erreur lors du test de fichier invalide:', error);
            throw error;
        } finally {
            // Nettoyer le fichier de test
            if (fs.existsSync(testFilePath)) {
                fs.unlinkSync(testFilePath);
            }
        }
    });
}); 