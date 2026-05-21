// Augment Express Request to carry decoded JWT payload
declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        user_id: string;
        role: string;
      };
    }
  }
}

export {};
