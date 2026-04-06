export type Role = 'admin' | 'analyst' | 'viewer';
export type UserStatus = 'active' | 'inactive';
export type RecordType = 'income' | 'expense';

export interface User {
  id: number;
  username: string;
  passwordHash: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SafeUser {
  id: number;
  username: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialRecord {
  id: number;
  amount: number;
  type: RecordType;
  category: string;
  date: string;
  notes: string | null;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface AuthPayload {
  id: number;
  username: string;
  role: Role;
}

export interface JwtPayload extends AuthPayload {
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
