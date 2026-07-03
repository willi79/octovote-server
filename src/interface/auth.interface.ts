import { Request } from 'express';

import { TokenPayload } from './jwt.interface';

export interface AuthenticatedRequest extends Request {
    user?: TokenPayload;
}
