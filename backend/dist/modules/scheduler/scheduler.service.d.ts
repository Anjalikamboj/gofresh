/**
 * Idempotent order generation job.
 * Processes all active subscriptions whose next_run_at <= now.
 * Mirrors the Python scheduler's run_order_generation_job() exactly.
 */
export declare function runOrderGenerationJob(): Promise<void>;
/**
 * Start the background cron scheduler.
 * Runs every hour (mirrors Python APScheduler interval hours=1).
 */
export declare function startScheduler(): Promise<void>;
/**
 * Stop the background scheduler gracefully.
 */
export declare function shutdownScheduler(): void;
//# sourceMappingURL=scheduler.service.d.ts.map