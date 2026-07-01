import { env } from './environment';
import mongoose from 'mongoose';

export async function connectDB(uri: string = env.mongoUri): Promise<typeof mongoose> {
    mongoose.set('strictQuery', true);
    return mongoose.connect(uri);
}

export async function disconnectDB(uri: string = env.mongoUri): Promise<void> {
    await mongoose.disconnect();
}
