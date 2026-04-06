import bcrypt from 'bcryptjs';
import { store } from './store';
import { Role, UserStatus, RecordType } from '../types';

interface SeedUser {
  username: string;
  password: string;
  role: Role;
  status: UserStatus;
}

interface SeedRecord {
  amount: number;
  type: RecordType;
  category: string;
  date: string;
  notes: string;
  createdBy: number;
}

export async function seed(): Promise<void> {
  const users: SeedUser[] = [
    { username: 'admin', password: 'Admin@1234', role: 'admin', status: 'active' },
    { username: 'jane_analyst', password: 'Analyst@1234', role: 'analyst', status: 'active' },
    { username: 'viewer_bob', password: 'Viewer@1234', role: 'viewer', status: 'active' },
    { username: 'inactive_user', password: 'Inactive@1234', role: 'viewer', status: 'inactive' },
  ];

  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    store.users.push({
      id: store.nextUserId++,
      username: u.username,
      passwordHash,
      role: u.role,
      status: u.status,
      createdAt: new Date('2024-01-01T00:00:00.000Z').toISOString(),
      updatedAt: new Date('2024-01-01T00:00:00.000Z').toISOString(),
    });
  }

  const records: SeedRecord[] = [
    { amount: 5000.00, type: 'income', category: 'Salary', date: '2024-01-05', notes: 'January salary', createdBy: 1 },
    { amount: 1200.00, type: 'expense', category: 'Rent', date: '2024-01-08', notes: 'Monthly rent', createdBy: 1 },
    { amount: 150.75, type: 'expense', category: 'Groceries', date: '2024-01-15', notes: 'Weekly groceries', createdBy: 2 },
    { amount: 800.00, type: 'income', category: 'Freelance', date: '2024-01-20', notes: 'Web design project', createdBy: 2 },
    { amount: 85.00, type: 'expense', category: 'Utilities', date: '2024-01-25', notes: 'Electric bill', createdBy: 1 },
    { amount: 5000.00, type: 'income', category: 'Salary', date: '2024-02-05', notes: 'February salary', createdBy: 1 },
    { amount: 1200.00, type: 'expense', category: 'Rent', date: '2024-02-08', notes: 'Monthly rent', createdBy: 1 },
    { amount: 200.50, type: 'expense', category: 'Groceries', date: '2024-02-14', notes: 'Valentine groceries', createdBy: 2 },
    { amount: 120.00, type: 'expense', category: 'Entertainment', date: '2024-02-20', notes: 'Streaming subscriptions', createdBy: 2 },
    { amount: 950.00, type: 'income', category: 'Freelance', date: '2024-02-25', notes: 'Logo design', createdBy: 2 },
    { amount: 5000.00, type: 'income', category: 'Salary', date: '2024-03-05', notes: 'March salary', createdBy: 1 },
    { amount: 1200.00, type: 'expense', category: 'Rent', date: '2024-03-08', notes: 'Monthly rent', createdBy: 1 },
    { amount: 175.25, type: 'expense', category: 'Groceries', date: '2024-03-15', notes: 'Weekly groceries', createdBy: 2 },
    { amount: 90.00, type: 'expense', category: 'Utilities', date: '2024-03-20', notes: 'Water bill', createdBy: 1 },
    { amount: 60.00, type: 'expense', category: 'Entertainment', date: '2024-03-28', notes: 'Movie tickets', createdBy: 2 },
  ];

  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    const createdAt = new Date(`${r.date}T10:00:00.000Z`).toISOString();
    store.records.push({
      id: store.nextRecordId++,
      amount: r.amount,
      type: r.type,
      category: r.category,
      date: r.date,
      notes: r.notes || null,
      createdBy: r.createdBy,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    });
  }

  store.records[13].deletedAt = new Date('2024-03-29T10:00:00.000Z').toISOString();

  console.log(`Seeded ${store.users.length} users and ${store.records.length} records.`);
}
