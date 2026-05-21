import dotenv from 'dotenv';

dotenv.config();

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: parseInt(process.env.PORT ?? '4000', 10),
  MONGO_URL: requireEnv('MONGO_URL', 'mongodb://localhost:27017/'),
  MONGO_DB_NAME: requireEnv('MONGO_DB_NAME', 'khetise'),
  JWT_SECRET_KEY: requireEnv(
    'JWT_SECRET_KEY',
    'your-secret-key-change-in-production-09876543210',
  ),
  JWT_ALGORITHM: 'HS256' as const,
  // 7 days in seconds (matching Python backend: 60 * 24 * 7 minutes)
  ACCESS_TOKEN_EXPIRE_SECONDS: 60 * 60 * 24 * 7,
};
