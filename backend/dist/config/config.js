"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
// Parse string to array
const parseStringToArray = (value) => {
    try {
        return JSON.parse(value);
    }
    catch (error) {
        return value.split(',').map(item => item.trim());
    }
};
// Configuration object
exports.config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),
    apiV1Str: process.env.API_V1_STR || '/api/v1',
    projectName: process.env.PROJECT_NAME || 'AI Tutor',
    debug: process.env.DEBUG === 'True' || process.env.DEBUG === 'true',
    cors: {
        origins: process.env.BACKEND_CORS_ORIGINS
            ? parseStringToArray(process.env.BACKEND_CORS_ORIGINS)
            : ['http://localhost:3000']
    },
    firebase: {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        clientId: process.env.FIREBASE_CLIENT_ID,
        authUri: process.env.FIREBASE_AUTH_URI,
        tokenUri: process.env.FIREBASE_TOKEN_URI,
        authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL,
        universeDomain: process.env.FIREBASE_UNIVERSE_DOMAIN || 'googleapis.com',
        databaseUrl: process.env.FIREBASE_DATABASE_URL,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    },
    gemini: {
        apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
        model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
        maxTokens: parseInt(process.env.GEMINI_MAX_TOKENS || '2048', 10),
        temperature: parseFloat(process.env.GEMINI_TEMPERATURE || '0.7'),
    },
    tts: {
        languageCode: process.env.TTS_LANGUAGE_CODE || 'en-US',
        voiceName: process.env.TTS_VOICE_NAME || 'en-US-Neural2-A',
    },
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    },
    logging: {
        level: process.env.LOG_LEVEL?.toLowerCase() || 'info',
    },
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development' || !process.env.NODE_ENV,
    isTest: process.env.NODE_ENV === 'test',
};
// Validate required environment variables
const requiredEnvVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL',
    'GEMINI_API_KEY',
];
// In development mode, we can continue without all required variables
if (process.env.NODE_ENV === 'production') {
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new Error(`Missing required environment variable: ${envVar}`);
        }
    }
}
//# sourceMappingURL=config.js.map