import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { runOrderGenerationJob } from './scheduler.service';
import { ApiError } from '../../utils/ApiError';

// POST /api/scheduler/run
export const triggerScheduler = catchAsync(
  async (_req: Request, res: Response) => {
    try {
      await runOrderGenerationJob();
      res.status(200).json({ message: 'Scheduler triggered successfully' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw ApiError.internal(message);
    }
  },
);
