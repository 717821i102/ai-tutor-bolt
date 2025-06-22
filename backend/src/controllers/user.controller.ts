import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ApiError } from '../middleware/error.middleware';

export const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // The user data is already available from the authentication middleware
    const userData = req.user;
    
    if (!userData) {
      throw new ApiError(404, 'User not found');
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
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Error in getUserProfile:', error);
    throw new ApiError(500, 'Failed to retrieve user profile');
  }
};
