"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const firebase_1 = require("../config/firebase");
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Access token required'
            });
        }
        // Verify Firebase ID token
        const decodedToken = await firebase_1.auth.verifyIdToken(token);
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            name: decodedToken.name
        };
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(403).json({
            success: false,
            error: 'Invalid or expired token'
        });
    }
};
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=auth.js.map