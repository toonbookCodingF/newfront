import dotenv from 'dotenv';
import path from 'path';

// Charger les variables d'environnement depuis le fichier .env dans src
dotenv.config({ path: path.resolve(__dirname, '../src/.env') });

// Configuration spécifique pour les tests
process.env.API_URL = 'https://backend-production-6328.up.railway.app/api';

// Vérifier que les variables requises sont présentes
const requiredEnvVars = ['TEST_USER_EMAIL', 'TEST_USER_PASSWORD'];

requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
        console.error(`Variable d'environnement manquante: ${envVar}`);
        console.error('Vérifiez que le fichier .env existe dans le dossier src/ et contient toutes les variables requises.');
        process.exit(1);
    }
}); 