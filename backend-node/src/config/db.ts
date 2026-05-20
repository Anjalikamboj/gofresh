import mongoose from 'mongoose';
import { env } from './env';

let isConnected = false;

export async function connectDatabase(): Promise<void> {
  if (isConnected) return;

  const mongoUri = `${env.MONGO_URL.replace(/\/$/, '')}/${env.MONGO_DB_NAME}`;

  await mongoose.connect(mongoUri, {
    autoIndex: true,
  });

  isConnected = true;
  console.info(`[DB] Connected to MongoDB: ${env.MONGO_DB_NAME}`);
}

export async function closeDatabase(): Promise<void> {
  if (!isConnected) return;
  await mongoose.connection.close();
  isConnected = false;
  console.info('[DB] MongoDB connection closed');
}
