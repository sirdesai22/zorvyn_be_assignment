export const ROLES = {
  ADMIN: 'admin',
  ANALYST: 'analyst',
  VIEWER: 'viewer',
} as const;

export const RECORD_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;

export const USER_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export const JWT_SECRET = process.env.JWT_SECRET || 'zorvyn_jwt_secret_key_2024';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;
