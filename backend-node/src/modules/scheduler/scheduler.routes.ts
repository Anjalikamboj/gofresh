import { Router } from 'express';
import { triggerScheduler } from './scheduler.controller';

const router = Router();

// POST /api/scheduler/run — public endpoint (mirrors Python backend, no auth)
router.post('/run', triggerScheduler);

export default router;
