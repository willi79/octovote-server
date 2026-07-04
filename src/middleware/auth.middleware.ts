import { NextFunction, Response } from 'express';

import { AuthenticatedRequest } from '../interface/auth.interface';
import { verifyToken } from '../util/jwt.util';
import { UserRole } from '../model/user';

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const header: string | undefined = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Missing or invalid Authorization header' });
        return;
    }

    const token: string = header.split(' ')[1];

    try {
        req.user = verifyToken(token);
        next();
    } catch {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export const requireRole = (roles: UserRole[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({ message: 'Insufficient permissions' });
            return;
        }

        next();
    };
};
