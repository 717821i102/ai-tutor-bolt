"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleProvider = exports.firestore = exports.auth = exports.app = void 0;
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
// Firebase configuration - replace with your own config
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};
// Validate Firebase configuration
const requiredEnvVars = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_STORAGE_BUCKET',
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
    'REACT_APP_FIREBASE_APP_ID'
];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
    console.warn('Missing Firebase configuration variables:', missingVars);
    console.warn('Using default configuration for development. Please update .env file for production.');
}
// Initialize Firebase
const app = (0, app_1.initializeApp)(firebaseConfig);
exports.app = app;
// Initialize Authentication
const auth = (0, auth_1.getAuth)(app);
exports.auth = auth;
// Initialize Firestore
const firestore = (0, firestore_1.getFirestore)(app);
exports.firestore = firestore;
// Initialize Google Auth Provider
const googleProvider = new auth_1.GoogleAuthProvider();
exports.googleProvider = googleProvider;
googleProvider.setCustomParameters({
    prompt: 'select_account'
});
//# sourceMappingURL=firebase.js.map