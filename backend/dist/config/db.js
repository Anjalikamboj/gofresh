"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
exports.closeDatabase = closeDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
let isConnected = false;
async function connectDatabase() {
    if (isConnected)
        return;
    const mongoUri = `${env_1.env.MONGO_URL.replace(/\/$/, '')}/${env_1.env.MONGO_DB_NAME}`;
    await mongoose_1.default.connect(mongoUri, {
        autoIndex: true,
    });
    isConnected = true;
    console.info(`[DB] Connected to MongoDB: ${env_1.env.MONGO_DB_NAME}`);
}
async function closeDatabase() {
    if (!isConnected)
        return;
    await mongoose_1.default.connection.close();
    isConnected = false;
    console.info('[DB] MongoDB connection closed');
}
//# sourceMappingURL=db.js.map