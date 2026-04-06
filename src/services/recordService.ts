import { store } from '../data/store';
import { AppError } from '../middleware/errorHandler';
import { PAGINATION } from '../config/constants';
import { FinancialRecord, PaginatedResult, RecordType } from '../types';

function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

interface RecordFilters {
  startDate?: string;
  endDate?: string;
  category?: string;
  type?: RecordType;
  page?: string;
  pageSize?: string;
}

export function getRecords(filters: RecordFilters = {}): PaginatedResult<FinancialRecord> {
  const p = parseInt(filters.page || '') || PAGINATION.DEFAULT_PAGE;
  const ps = Math.min(parseInt(filters.pageSize || '') || PAGINATION.DEFAULT_PAGE_SIZE, PAGINATION.MAX_PAGE_SIZE);

  let records = store.records.filter(r => r.deletedAt === null);
  if (filters.type) records = records.filter(r => r.type === filters.type);
  if (filters.category) records = records.filter(r => r.category.toLowerCase() === filters.category!.toLowerCase());
  if (filters.startDate) records = records.filter(r => r.date >= filters.startDate!);
  if (filters.endDate) records = records.filter(r => r.date <= filters.endDate!);

  const total = records.length;
  const totalPages = Math.ceil(total / ps);
  const start = (p - 1) * ps;
  const data = records.slice(start, start + ps);

  return { data, meta: { page: p, pageSize: ps, total, totalPages } };
}

export function getRecordById(id: number): FinancialRecord {
  const record = store.records.find(r => r.id === id && r.deletedAt === null);
  if (!record) throw new AppError(404, 'Record not found');
  return record;
}

interface CreateRecordInput {
  amount: number;
  type: RecordType;
  category: string;
  date: string;
  notes?: string | null;
  createdBy: number;
}

export function createRecord(input: CreateRecordInput): FinancialRecord {
  const now = new Date().toISOString();
  const record: FinancialRecord = {
    id: store.nextRecordId++,
    amount: parseFloat(String(input.amount)),
    type: input.type,
    category: toTitleCase(input.category),
    date: input.date,
    notes: input.notes || null,
    createdBy: input.createdBy,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };
  store.records.push(record);
  return record;
}

interface UpdateRecordInput {
  amount?: number;
  type?: RecordType;
  category?: string;
  date?: string;
  notes?: string | null;
}

export function updateRecord(id: number, updates: UpdateRecordInput): FinancialRecord {
  const record = store.records.find(r => r.id === id && r.deletedAt === null);
  if (!record) throw new AppError(404, 'Record not found');
  if (updates.amount !== undefined) record.amount = parseFloat(String(updates.amount));
  if (updates.type) record.type = updates.type;
  if (updates.category) record.category = toTitleCase(updates.category);
  if (updates.date) record.date = updates.date;
  if (updates.notes !== undefined) record.notes = updates.notes;
  record.updatedAt = new Date().toISOString();
  return record;
}

export function deleteRecord(id: number): FinancialRecord {
  const record = store.records.find(r => r.id === id && r.deletedAt === null);
  if (!record) throw new AppError(404, 'Record not found');
  record.deletedAt = new Date().toISOString();
  record.updatedAt = record.deletedAt;
  return record;
}
