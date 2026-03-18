import { Response } from 'express';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: number = 200
): void => {
  res.status(statusCode).json({ success: true, data });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 400
): void => {
  res.status(statusCode).json({ success: false, error: message });
};