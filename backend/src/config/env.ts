import dotenv from 'dotenv';
import Joi from 'joi';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

// Define validation schema for environment variables
const envSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(5000),
    CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
    FIREBASE_PROJECT_ID: Joi.string().required().description('Firebase project ID'),
    FIREBASE_PRIVATE_KEY: Joi.string().required().description('Firebase private key'),
    FIREBASE_CLIENT_EMAIL: Joi.string().required().description('Firebase client email'),
    GOOGLE_API_KEY: Joi.string().required().description('Google Gemini API key'),
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
export default {
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
