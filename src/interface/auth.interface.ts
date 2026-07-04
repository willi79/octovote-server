import { Request } from 'express';

import { TokenPayload } from './jwt.interface';
import { UserInterface } from '../model/user';

export interface AuthenticatedRequest extends Request {
    user?: TokenPayload;
}

export interface AuthResult {
    token: string;
    user: UserInterface;
}
