import { body } from 'express-validator';
import { ROLES, USER_STATUSES } from '../config/constants';

export const createUserRules = [
  body('username').trim().notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters'),
  body('password').notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').notEmpty().withMessage('Role is required')
    .isIn(Object.values(ROLES)).withMessage(`Role must be one of: ${Object.values(ROLES).join(', ')}`),
  body('status').optional()
    .isIn(Object.values(USER_STATUSES)).withMessage(`Status must be one of: ${Object.values(USER_STATUSES).join(', ')}`),
];

export const updateUserRules = [
  body('username').optional().trim()
    .isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters'),
  body('password').optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional()
    .isIn(Object.values(ROLES)).withMessage(`Role must be one of: ${Object.values(ROLES).join(', ')}`),
  body('status').optional()
    .isIn(Object.values(USER_STATUSES)).withMessage(`Status must be one of: ${Object.values(USER_STATUSES).join(', ')}`),
];
