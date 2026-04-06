import bcrypt from 'bcryptjs';
import { store } from '../data/store';
import { AppError } from '../middleware/errorHandler';
import { USER_STATUSES } from '../config/constants';
import { User, SafeUser, Role, UserStatus } from '../types';

function sanitizeUser(user: User): SafeUser {
  const { passwordHash, ...safe } = user;
  return safe;
}

interface UserFilters {
  role?: string;
  status?: string;
}

export function getUsers(filters: UserFilters = {}): SafeUser[] {
  let users = store.users;
  if (filters.role) users = users.filter(u => u.role === filters.role);
  if (filters.status) users = users.filter(u => u.status === filters.status);
  return users.map(sanitizeUser);
}

export function getUserById(id: number): SafeUser {
  const user = store.users.find(u => u.id === id);
  if (!user) throw new AppError(404, 'User not found');
  return sanitizeUser(user);
}

interface CreateUserInput {
  username: string;
  password: string;
  role: Role;
  status?: UserStatus;
}

export async function createUser(input: CreateUserInput): Promise<SafeUser> {
  const existing = store.users.find(u => u.username === input.username);
  if (existing) throw new AppError(409, 'Username already exists');
  const passwordHash = await bcrypt.hash(input.password, 10);
  const now = new Date().toISOString();
  const user: User = {
    id: store.nextUserId++,
    username: input.username,
    passwordHash,
    role: input.role,
    status: input.status || USER_STATUSES.ACTIVE,
    createdAt: now,
    updatedAt: now,
  };
  store.users.push(user);
  return sanitizeUser(user);
}

interface UpdateUserInput {
  username?: string;
  password?: string;
  role?: Role;
  status?: UserStatus;
}

export async function updateUser(id: number, updates: UpdateUserInput): Promise<SafeUser> {
  const user = store.users.find(u => u.id === id);
  if (!user) throw new AppError(404, 'User not found');
  if (updates.username && updates.username !== user.username) {
    const existing = store.users.find(u => u.username === updates.username);
    if (existing) throw new AppError(409, 'Username already exists');
    user.username = updates.username;
  }
  if (updates.password) user.passwordHash = await bcrypt.hash(updates.password, 10);
  if (updates.role) user.role = updates.role;
  if (updates.status) user.status = updates.status;
  user.updatedAt = new Date().toISOString();
  return sanitizeUser(user);
}

export function deactivateUser(id: number): SafeUser {
  const user = store.users.find(u => u.id === id);
  if (!user) throw new AppError(404, 'User not found');
  user.status = USER_STATUSES.INACTIVE;
  user.updatedAt = new Date().toISOString();
  return sanitizeUser(user);
}

export async function authenticateUser(username: string, password: string): Promise<SafeUser> {
  const user = store.users.find(u => u.username === username);
  if (!user) throw new AppError(401, 'Invalid credentials');
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new AppError(401, 'Invalid credentials');
  if (user.status === USER_STATUSES.INACTIVE) throw new AppError(403, 'Account is inactive');
  return sanitizeUser(user);
}
