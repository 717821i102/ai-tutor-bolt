"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = void 0;
const error_middleware_1 = require("../middleware/error.middleware");
const getUserProfile = async (req, res) => {
    try {
        // The user data is already available from the authentication middleware
        const userData = req.user;
        if (!userData) {
            throw new error_middleware_1.ApiError(404, 'User not found');
        }
        // In a real implementation, you might want to fetch additional user data from your database
        return res.status(200).json({
            success: true,
            data: {
                uid: userData.uid,
                email: userData.email,
                name: userData.name || 'User',
                picture: userData.picture,
                emailVerified: userData.email_verified,
            },
        });
    }
    catch (error) {
        if (error instanceof error_middleware_1.ApiError) {
            throw error;
        }
        console.error('Error in getUserProfile:', error);
        throw new error_middleware_1.ApiError(500, 'Failed to retrieve user profile');
    }
};
exports.getUserProfile = getUserProfile;
//# sourceMappingURL=user.controller.js.map