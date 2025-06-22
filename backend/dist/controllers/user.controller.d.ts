import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
export declare const getUserProfile: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=user.controller.d.ts.map