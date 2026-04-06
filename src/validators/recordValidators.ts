import { body, query, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { RECORD_TYPES } from '../config/constants';

export const createRecordRules: ValidationChain[] = [
  body('amount').notEmpty().withMessage('Amount is required')
    .isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
  body('type').notEmpty().withMessage('Type is required')
    .isIn(Object.values(RECORD_TYPES)).withMessage(`Type must be one of: ${Object.values(RECORD_TYPES).join(', ')}`),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('date').notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Date must be a valid ISO date (YYYY-MM-DD)'),
  body('notes').optional().isString(),
];

export const updateRecordRules: ValidationChain[] = [
  body('amount').optional()
    .isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
  body('type').optional()
    .isIn(Object.values(RECORD_TYPES)).withMessage(`Type must be one of: ${Object.values(RECORD_TYPES).join(', ')}`),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('date').optional()
    .isISO8601().withMessage('Date must be a valid ISO date (YYYY-MM-DD)'),
  body('notes').optional().isString(),
];

export const listRecordRules: ValidationChain[] = [
  query('startDate').optional().isISO8601().withMessage('startDate must be a valid ISO date'),
  query('endDate').optional().isISO8601().withMessage('endDate must be a valid ISO date'),
  query('type').optional().isIn(Object.values(RECORD_TYPES)).withMessage(`type must be one of: ${Object.values(RECORD_TYPES).join(', ')}`),
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).withMessage('pageSize must be between 1 and 100'),
];

export function validate(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: {
        code: 400,
        message: 'Validation failed',
        details: errors.array().map(e => ({ field: (e as { path: string }).path, message: e.msg })),
      },
    });
    return;
  }
  next();
}
