import dotenv from 'dotenv';

dotenv.config();

export const env = {
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/octovote',
    jwtSecret: process.env.JWT_SECRET || 'secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || 3600,
};
