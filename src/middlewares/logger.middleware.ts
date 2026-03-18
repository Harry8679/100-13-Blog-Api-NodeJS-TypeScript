import { Request, Response, NextFunction } from 'express';

export const loggerMiddleware = (
  req: Request, res: Response, next: NextFunction
): void => {
  const start = Date.now();
  res.on('finish', () => {
    const ms    = Date.now() - start;
    const s     = res.statusCode;
    const color = s >= 500 ? '\x1b[31m' : s >= 400 ? '\x1b[33m' : '\x1b[32m';
    console.log(`  ${color}${s}\x1b[0m ${req.method.padEnd(6)} ${req.url} — ${ms}ms`);
  });
  next();
};