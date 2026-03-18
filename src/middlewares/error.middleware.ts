import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public message:    string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorMiddleware = (
  err:   Error,
  req:   Request,
  res:   Response,
  _next: NextFunction
): void => {
  console.error(`❌ [${req.method}] ${req.url} —`, err.message);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, error: err.message });
    return;
  }

  if (err.message === 'POST_NOT_FOUND') {
    res.status(404).json({ success: false, error: 'Article introuvable' });
    return;
  }

  res.status(500).json({ success: false, error: 'Erreur interne du serveur' });
};