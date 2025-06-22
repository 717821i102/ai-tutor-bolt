"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const joi_1 = __importDefault(require("joi"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
// Define validation schema for environment variables
const envSchema = joi_1.default.object()
    .keys({
    NODE_ENV: joi_1.default.string().valid('development', 'production', 'test').default('development'),
    PORT: joi_1.default.number().default(5000),
    CORS_ORIGIN: joi_1.default.string().default('http://localhost:3000'),
    FIREBASE_PROJECT_ID: joi_1.default.string().required().description('Firebase project ID'),
    FIREBASE_PRIVATE_KEY: joi_1.default.string().required().description('Firebase private key'),
    FIREBASE_CLIENT_EMAIL: joi_1.default.string().required().description('Firebase client email'),
    GOOGLE_API_KEY: joi_1.default.string().required().description('Google Gemini API key'),
})
    .unknown();
// Validate environment variables against schema
const { value: envVars, error } = envSchema
    .prefs({ errors: { label: 'key' } })
    .validate(process.env);
if (error) {
    throw new Error(`Environment validation error: ${error.message}`);
}
// Export validated environment variables
exports.default = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    corsOrigin: envVars.CORS_ORIGIN,
    firebase: {
        projectId: envVars.FIREBASE_PROJECT_ID,
        privateKey: envVars.FIREBASE_PRIVATE_KEY,
        clientEmail: envVars.FIREBASE_CLIENT_EMAIL,
    },
    google: {
        apiKey: envVars.GOOGLE_API_KEY,
    },
    isProduction: envVars.NODE_ENV === 'production',
    isDevelopment: envVars.NODE_ENV === 'development',
    isTest: envVars.NODE_ENV === 'test',
};
//# sourceMappingURL=env.js.map