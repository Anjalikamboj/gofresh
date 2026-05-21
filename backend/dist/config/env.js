"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function requireEnv(key, fallback) {
    const value = process.env[key] ?? fallback;
    if (value === undefined) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}
exports.env = {
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    PORT: parseInt(process.env.PORT ?? '8001', 10),
    MONGO_URL: requireEnv('MONGO_URL', 'mongodb://localhost:27017/'),
    MONGO_DB_NAME: requireEnv('MONGO_DB_NAME', 'grofresh'),
    JWT_SECRET_KEY: requireEnv('JWT_SECRET_KEY', 'your-secret-key-change-in-production-09876543210'),
    JWT_ALGORITHM: 'HS256',
    // 7 days in seconds (matching Python backend: 60 * 24 * 7 minutes)
    ACCESS_TOKEN_EXPIRE_SECONDS: 60 * 60 * 24 * 7,
};
//# sourceMappingURL=env.js.map