import jwt from 'jsonwebtoken';
import { env } from '../config/environment';
import { TokenPayload } from '../interface/jwt.interface';

export const signToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, env.jwtSecret, {
        expiresIn: env.jwtExpiresIn,
    } as jwt.SignOptions);
};

export const verifyToken = (token: string): TokenPayload => {
    return jwt.verify(token, env.jwtSecret) as TokenPayload;
};
