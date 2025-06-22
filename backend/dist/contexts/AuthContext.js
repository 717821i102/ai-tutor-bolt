"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = useAuth;
exports.AuthProvider = AuthProvider;
const react_1 = __importStar(require("react"));
const auth_1 = require("firebase/auth");
const firebase_1 = require("../firebase");
// Create context
const AuthContext = (0, react_1.createContext)(undefined);
// Hook to use auth context
function useAuth() {
    const context = (0, react_1.useContext)(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
// Provider component
function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    // Convert Firebase User to UserProfile
    const mapUserToProfile = (user) => {
        if (!user)
            return null;
        return {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        };
    };
    // Sign up function
    async function signup(email, password, displayName) {
        try {
            const userCredential = await (0, auth_1.createUserWithEmailAndPassword)(firebase_1.auth, email, password);
            const user = userCredential.user;
            // Update the user's display name
            await (0, auth_1.updateProfile)(user, { displayName });
            // Return the updated user profile
            return {
                uid: user.uid,
                email: user.email,
                displayName,
                photoURL: user.photoURL
            };
        }
        catch (error) {
            console.error('Error signing up:', error);
            throw error;
        }
    }
    // Login function
    async function login(email, password) {
        try {
            const userCredential = await (0, auth_1.signInWithEmailAndPassword)(firebase_1.auth, email, password);
            return userCredential.user;
        }
        catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    }
    // Google Sign-in function
    async function signInWithGoogle() {
        try {
            const result = await (0, auth_1.signInWithPopup)(firebase_1.auth, firebase_1.googleProvider);
            return result.user;
        }
        catch (error) {
            console.error('Error signing in with Google:', error);
            throw error;
        }
    }
    // Logout function
    async function logout() {
        try {
            await (0, auth_1.signOut)(firebase_1.auth);
        }
        catch (error) {
            console.error('Error logging out:', error);
            throw error;
        }
    }
    // Reset password function
    async function resetPassword(email) {
        try {
            await (0, auth_1.sendPasswordResetEmail)(firebase_1.auth, email);
        }
        catch (error) {
            console.error('Error resetting password:', error);
            throw error;
        }
    }
    // Update user profile function
    async function updateUserProfile(profile) {
        try {
            if (!firebase_1.auth.currentUser)
                throw new Error('No authenticated user');
            await (0, auth_1.updateProfile)(firebase_1.auth.currentUser, profile);
            // Update local user state
            setCurrentUser(prev => prev ? { ...prev, ...profile } : null);
        }
        catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    }
    // Effect to handle auth state changes
    (0, react_1.useEffect)(() => {
        const unsubscribe = (0, auth_1.onAuthStateChanged)(firebase_1.auth, (user) => {
            setCurrentUser(mapUserToProfile(user));
            setIsLoading(false);
        });
        // Cleanup subscription
        return unsubscribe;
    }, []);
    const value = {
        currentUser,
        isLoading,
        signup,
        login,
        signInWithGoogle,
        logout,
        resetPassword,
        updateUserProfile
    };
    return (<AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>);
}
//# sourceMappingURL=AuthContext.js.map