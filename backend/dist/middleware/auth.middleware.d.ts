import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
export interface AuthenticatedRequest extends Request {
    user?: admin.auth.DecodedIdToken;
}
export declare const authenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void | Response>;
//# sourceMappingURL=auth.middleware.d.ts.map