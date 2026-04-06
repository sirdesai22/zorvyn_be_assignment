import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { Role } from '../types';

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) return next(new AppError(401, 'Not authenticated'));
    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, 'Forbidden: insufficient permissions'));
    }
    next();
  };
}
