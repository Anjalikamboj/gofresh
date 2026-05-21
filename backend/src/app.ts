import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import apiRoutes from './routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app: Application = express();

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://www.khetise.in', 'https://khetise.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['*'],
  }),
);

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api', apiRoutes);

// ── Centralized error handler (must be last middleware) ───────────────────────
app.use(errorMiddleware);

export default app;
