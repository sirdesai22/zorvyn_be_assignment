import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/constants';
import { store } from '../data/store';
import { AppError } from './errorHandler';
import { JwtPayload } from '../types';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError(401, 'No token provided'));
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const user = store.users.find(u => u.id === decoded.id);
    if (!user) return next(new AppError(401, 'Invalid token'));
    if (user.status === 'inactive') return next(new AppError(403, 'Account is inactive'));
    req.user = { id: user.id, username: user.username, role: user.role };
    next();
  } catch {
    return next(new AppError(401, 'Invalid or expired token'));
  }
}
