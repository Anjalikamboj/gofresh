"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const scheduler_service_1 = require("./modules/scheduler/scheduler.service");
const app_1 = __importDefault(require("./app"));
async function bootstrap() {
    console.info('[Server] Starting GroFresh backend...');
    // Connect to MongoDB
    await (0, db_1.connectDatabase)();
    // Start background scheduler
    await (0, scheduler_service_1.startScheduler)();
    // Start HTTP server
    const server = app_1.default.listen(env_1.env.PORT, () => {
        console.info(`[Server] Listening on port ${env_1.env.PORT} (${env_1.env.NODE_ENV})`);
    });
    // ── Graceful shutdown ─────────────────────────────────────────────────────
    const gracefulShutdown = async (signal) => {
        console.info(`[Server] Received ${signal}, shutting down gracefully...`);
        server.close(async () => {
            (0, scheduler_service_1.shutdownScheduler)();
            await (0, db_1.closeDatabase)();
            console.info('[Server] Shutdown complete');
            process.exit(0);
        });
        // Force exit after 10 seconds if graceful shutdown fails
        setTimeout(() => {
            console.error('[Server] Forced shutdown after timeout');
            process.exit(1);
        }, 10000);
    };
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('unhandledRejection', (reason) => {
        console.error('[Server] Unhandled promise rejection:', reason);
    });
    process.on('uncaughtException', (err) => {
        console.error('[Server] Uncaught exception:', err);
        process.exit(1);
    });
}
bootstrap().catch((err) => {
    console.error('[Server] Failed to start:', err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map