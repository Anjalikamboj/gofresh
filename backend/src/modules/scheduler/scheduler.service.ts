import { SubscriptionModel } from '../subscriptions/subscription.model';
import { ProductModel } from '../products/product.model';
import { OrderModel } from '../orders/order.model';
import { InventoryCheckItem } from '../orders/order.types';

const logger = {
  info: (msg: string) => console.info(`[Scheduler] ${msg}`),
  warn: (msg: string) => console.warn(`[Scheduler] ${msg}`),
  error: (msg: string) => console.error(`[Scheduler] ${msg}`),
};

/**
 * Advance next_run_at based on subscription frequency.
 * Mirrors Python's advance_next_run() function exactly.
 */
async function advanceNextRun(
  subscriptionId: unknown,
  frequency: string,
  currentRunAt: Date,
): Promise<void> {
  const nextRun = new Date(currentRunAt);

  if (frequency === 'daily') {
    nextRun.setDate(nextRun.getDate() + 1);
  } else if (frequency === 'weekly') {
    nextRun.setDate(nextRun.getDate() + 7);
  } else {
    logger.error(`Unknown frequency: ${frequency}`);
    return;
  }

  await SubscriptionModel.updateOne(
    { _id: subscriptionId },
    { $set: { next_run_at: nextRun } },
  );
}

/**
 * Idempotent order generation job.
 * Processes all active subscriptions whose next_run_at <= now.
 * Mirrors the Python scheduler's run_order_generation_job() exactly.
 */
export async function runOrderGenerationJob(): Promise<void> {
  const now = new Date();
  logger.info(`Running order generation at ${now.toISOString()}`);

  let ordersCreated = 0;
  let ordersBlocked = 0;

  try {
    // Find all subscriptions due for order generation
    const dueSubscriptions = await SubscriptionModel.find({
      status: 'active',
      next_run_at: { $lte: now },
    });

    for (const sub of dueSubscriptions) {
      const subId = sub._id;
      const scheduledFor = sub.next_run_at;

      logger.info(`Processing subscription ${String(subId)}`);

      // ── Idempotency check ─────────────────────────────────────────────────
      const existingOrder = await OrderModel.findOne({
        subscription_id: String(subId),
        scheduled_for: scheduledFor,
      });

      if (existingOrder) {
        logger.info(
          `Order already exists for subscription ${String(subId)}, skipping`,
        );
        await advanceNextRun(subId, sub.frequency, scheduledFor);
        continue;
      }

      // ── Inventory check ───────────────────────────────────────────────────
      let inventorySufficient = true;
      const inventoryCheck: InventoryCheckItem[] = [];

      for (const item of sub.items) {
        const product = await ProductModel.findOne({ sku: item.sku });

        if (!product || product.stock_on_hand < item.quantity) {
          inventorySufficient = false;
          inventoryCheck.push({
            sku: item.sku,
            required: item.quantity,
            available: product ? product.stock_on_hand : 0,
          });
        } else {
          inventoryCheck.push({
            sku: item.sku,
            required: item.quantity,
            available: product.stock_on_hand,
          });
        }
      }

      // ── Create blocked order (no stock deduction) ─────────────────────────
      if (!inventorySufficient) {
        try {
          await OrderModel.create({
            subscription_id: String(subId),
            user_id: sub.user_id,
            items: sub.items,
            scheduled_for: scheduledFor,
            status: 'blocked',
            reason: 'insufficient_inventory',
            inventory_check: inventoryCheck,
            created_at: new Date(),
          });
          logger.warn(
            `Order blocked for subscription ${String(subId)} - insufficient inventory`,
          );
          ordersBlocked++;
        } catch (err: unknown) {
          const e = err as { code?: number };
          if (e.code === 11000) {
            logger.info('Blocked order already exists (race condition)');
          } else {
            logger.error(`Error creating blocked order: ${String(err)}`);
          }
        }
      } else {
        // ── Create order and decrement inventory ──────────────────────────
        try {
          await OrderModel.create({
            subscription_id: String(subId),
            user_id: sub.user_id,
            items: sub.items,
            scheduled_for: scheduledFor,
            status: 'created',
            created_at: new Date(),
          });

          // Decrement inventory atomically (mirrors Python $inc behaviour)
          for (const item of sub.items) {
            await ProductModel.updateOne(
              { sku: item.sku },
              { $inc: { stock_on_hand: -item.quantity } },
            );
          }

          logger.info(`Order created for subscription ${String(subId)}`);
          ordersCreated++;
        } catch (err: unknown) {
          const e = err as { code?: number };
          if (e.code === 11000) {
            logger.info('Order already exists (race condition during creation)');
          } else {
            logger.error(`Error creating order: ${String(err)}`);
          }
        }
      }

      // ── Advance next_run_at regardless of order outcome ───────────────────
      await advanceNextRun(subId, sub.frequency, scheduledFor);
    }

    logger.info(
      `Order generation complete: ${ordersCreated} created, ${ordersBlocked} blocked`,
    );
  } catch (err: unknown) {
    logger.error(`Error in order generation job: ${String(err)}`);
    throw err;
  }
}

// ─── Cron scheduler ──────────────────────────────────────────────────────────

let schedulerTask: ReturnType<typeof import('node-cron').schedule> | null = null;

/**
 * Start the background cron scheduler.
 * Runs every hour (mirrors Python APScheduler interval hours=1).
 */
export async function startScheduler(): Promise<void> {
  if (schedulerTask) return; // already running

  const cron = await import('node-cron');

  schedulerTask = cron.schedule(
    '0 * * * *', // every hour at minute 0
    () => {
      runOrderGenerationJob().catch((err: unknown) => {
        console.error('[Scheduler] Unhandled error in cron job:', err);
      });
    },
    { scheduled: true, timezone: 'UTC' },
  );

  logger.info('Scheduler started (runs every hour)');
}

/**
 * Stop the background scheduler gracefully.
 */
export function shutdownScheduler(): void {
  if (schedulerTask) {
    schedulerTask.stop();
    schedulerTask = null;
    logger.info('Scheduler shutdown');
  }
}
