"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.runOrderGenerationJob = runOrderGenerationJob;
exports.startScheduler = startScheduler;
exports.shutdownScheduler = shutdownScheduler;
const subscription_model_1 = require("../subscriptions/subscription.model");
const product_model_1 = require("../products/product.model");
const order_model_1 = require("../orders/order.model");
const logger = {
    info: (msg) => console.info(`[Scheduler] ${msg}`),
    warn: (msg) => console.warn(`[Scheduler] ${msg}`),
    error: (msg) => console.error(`[Scheduler] ${msg}`),
};
/**
 * Advance next_run_at based on subscription frequency.
 * Mirrors Python's advance_next_run() function exactly.
 */
async function advanceNextRun(subscriptionId, frequency, currentRunAt) {
    const nextRun = new Date(currentRunAt);
    if (frequency === 'daily') {
        nextRun.setDate(nextRun.getDate() + 1);
    }
    else if (frequency === 'weekly') {
        nextRun.setDate(nextRun.getDate() + 7);
    }
    else {
        logger.error(`Unknown frequency: ${frequency}`);
        return;
    }
    await subscription_model_1.SubscriptionModel.updateOne({ _id: subscriptionId }, { $set: { next_run_at: nextRun } });
}
/**
 * Idempotent order generation job.
 * Processes all active subscriptions whose next_run_at <= now.
 * Mirrors the Python scheduler's run_order_generation_job() exactly.
 */
async function runOrderGenerationJob() {
    const now = new Date();
    logger.info(`Running order generation at ${now.toISOString()}`);
    let ordersCreated = 0;
    let ordersBlocked = 0;
    try {
        // Find all subscriptions due for order generation
        const dueSubscriptions = await subscription_model_1.SubscriptionModel.find({
            status: 'active',
            next_run_at: { $lte: now },
        });
        for (const sub of dueSubscriptions) {
            const subId = sub._id;
            const scheduledFor = sub.next_run_at;
            logger.info(`Processing subscription ${String(subId)}`);
            // ── Idempotency check ─────────────────────────────────────────────────
            const existingOrder = await order_model_1.OrderModel.findOne({
                subscription_id: String(subId),
                scheduled_for: scheduledFor,
            });
            if (existingOrder) {
                logger.info(`Order already exists for subscription ${String(subId)}, skipping`);
                await advanceNextRun(subId, sub.frequency, scheduledFor);
                continue;
            }
            // ── Inventory check ───────────────────────────────────────────────────
            let inventorySufficient = true;
            const inventoryCheck = [];
            for (const item of sub.items) {
                const product = await product_model_1.ProductModel.findOne({ sku: item.sku });
                if (!product || product.stock_on_hand < item.quantity) {
                    inventorySufficient = false;
                    inventoryCheck.push({
                        sku: item.sku,
                        required: item.quantity,
                        available: product ? product.stock_on_hand : 0,
                    });
                }
                else {
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
                    await order_model_1.OrderModel.create({
                        subscription_id: String(subId),
                        user_id: sub.user_id,
                        items: sub.items,
                        scheduled_for: scheduledFor,
                        status: 'blocked',
                        reason: 'insufficient_inventory',
                        inventory_check: inventoryCheck,
                        created_at: new Date(),
                    });
                    logger.warn(`Order blocked for subscription ${String(subId)} - insufficient inventory`);
                    ordersBlocked++;
                }
                catch (err) {
                    const e = err;
                    if (e.code === 11000) {
                        logger.info('Blocked order already exists (race condition)');
                    }
                    else {
                        logger.error(`Error creating blocked order: ${String(err)}`);
                    }
                }
            }
            else {
                // ── Create order and decrement inventory ──────────────────────────
                try {
                    await order_model_1.OrderModel.create({
                        subscription_id: String(subId),
                        user_id: sub.user_id,
                        items: sub.items,
                        scheduled_for: scheduledFor,
                        status: 'created',
                        created_at: new Date(),
                    });
                    // Decrement inventory atomically (mirrors Python $inc behaviour)
                    for (const item of sub.items) {
                        await product_model_1.ProductModel.updateOne({ sku: item.sku }, { $inc: { stock_on_hand: -item.quantity } });
                    }
                    logger.info(`Order created for subscription ${String(subId)}`);
                    ordersCreated++;
                }
                catch (err) {
                    const e = err;
                    if (e.code === 11000) {
                        logger.info('Order already exists (race condition during creation)');
                    }
                    else {
                        logger.error(`Error creating order: ${String(err)}`);
                    }
                }
            }
            // ── Advance next_run_at regardless of order outcome ───────────────────
            await advanceNextRun(subId, sub.frequency, scheduledFor);
        }
        logger.info(`Order generation complete: ${ordersCreated} created, ${ordersBlocked} blocked`);
    }
    catch (err) {
        logger.error(`Error in order generation job: ${String(err)}`);
        throw err;
    }
}
// ─── Cron scheduler ──────────────────────────────────────────────────────────
let schedulerTask = null;
/**
 * Start the background cron scheduler.
 * Runs every hour (mirrors Python APScheduler interval hours=1).
 */
async function startScheduler() {
    if (schedulerTask)
        return; // already running
    const cron = await Promise.resolve().then(() => __importStar(require('node-cron')));
    schedulerTask = cron.schedule('0 * * * *', // every hour at minute 0
    () => {
        runOrderGenerationJob().catch((err) => {
            console.error('[Scheduler] Unhandled error in cron job:', err);
        });
    }, { scheduled: true, timezone: 'UTC' });
    logger.info('Scheduler started (runs every hour)');
}
/**
 * Stop the background scheduler gracefully.
 */
function shutdownScheduler() {
    if (schedulerTask) {
        schedulerTask.stop();
        schedulerTask = null;
        logger.info('Scheduler shutdown');
    }
}
//# sourceMappingURL=scheduler.service.js.map