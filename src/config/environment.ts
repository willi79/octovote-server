import dotenv from 'dotenv';

dotenv.config();

export const env = {
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/octovote',
    jwtSecret: process.env.JWT_SECRET || 'secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || 3600,
    adminEmail: process.env.ADMIN_EMAIL || 'admin123@gmail.com',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
    adminName: process.env.ADMIN_NAME || 'Administrator',
    seedAdmin: process.env.SEED_ADMIN || 'false',
};
