import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types';

const VALID_API_KEYS = new Set((process.env.API_KEYS ?? 'dev-key-123').split(','));

export function apiKeyAuth(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers['apikey'] as string | undefined;

  if (!apiKey || !VALID_API_KEYS.has(apiKey)) {
    const body: ApiError = { status: '401', message: 'Missing or invalid API key.' };
    res.status(401).json(body);
    return;
  }

  next();
}
