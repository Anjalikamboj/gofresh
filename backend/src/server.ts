import { env } from './config/env';
import { connectDatabase, closeDatabase } from './config/db';
import { startScheduler, shutdownScheduler } from './modules/scheduler/scheduler.service';
import app from './app';

async function bootstrap(): Promise<void> {
  console.info('[Server] Starting KhetiSe backend...');

  // Connect to MongoDB
  await connectDatabase();

  // Start background scheduler
  await startScheduler();

  // Start HTTP server
  const server = app.listen(env.PORT, () => {
    console.info(`[Server] Listening on port ${env.PORT} (${env.NODE_ENV})`);
  });

  // ── Graceful shutdown ─────────────────────────────────────────────────────
  const gracefulShutdown = async (signal: string): Promise<void> => {
    console.info(`[Server] Received ${signal}, shutting down gracefully...`);

    server.close(async () => {
      shutdownScheduler();
      await closeDatabase();
      console.info('[Server] Shutdown complete');
      process.exit(0);
    });

    // Force exit after 10 seconds if graceful shutdown fails
    setTimeout(() => {
      console.error('[Server] Forced shutdown after timeout');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  process.on('unhandledRejection', (reason: unknown) => {
    console.error('[Server] Unhandled promise rejection:', reason);
  });

  process.on('uncaughtException', (err: Error) => {
    console.error('[Server] Uncaught exception:', err);
    process.exit(1);
  });
}

bootstrap().catch((err: unknown) => {
  console.error('[Server] Failed to start:', err);
  process.exit(1);
});
