import { store } from '../data/store';
import { FinancialRecord, RecordType } from '../types';

function getActiveRecords(): FinancialRecord[] {
  return store.records.filter(r => r.deletedAt === null);
}

export interface Summary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
}

export function getSummary(): Summary {
  const records = getActiveRecords();
  const totalIncome = records.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0);
  const totalExpenses = records.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
  return {
    totalIncome: parseFloat(totalIncome.toFixed(2)),
    totalExpenses: parseFloat(totalExpenses.toFixed(2)),
    netBalance: parseFloat((totalIncome - totalExpenses).toFixed(2)),
  };
}

interface CategoryTotals {
  income: number;
  expense: number;
}

interface CategoryBreakdown {
  category: string;
  income: number;
  expense: number;
}

export function getCategoryBreakdown(): CategoryBreakdown[] {
  const records = getActiveRecords();
  const breakdown: Record<string, CategoryTotals> = {};
  for (const r of records) {
    if (!breakdown[r.category]) breakdown[r.category] = { income: 0, expense: 0 };
    breakdown[r.category][r.type] = parseFloat((breakdown[r.category][r.type] + r.amount).toFixed(2));
  }
  return Object.entries(breakdown).map(([category, totals]) => ({ category, ...totals }));
}

export function getRecent(limit: string | number = 10): FinancialRecord[] {
  const records = getActiveRecords();
  return [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, parseInt(String(limit)));
}

interface MonthlyTrend {
  month: string;
  income: number;
  expense: number;
  netBalance: number;
}

export function getMonthlyTrends(year?: string): MonthlyTrend[] {
  const records = getActiveRecords();
  const filtered = year ? records.filter(r => r.date.startsWith(year)) : records;

  const months: Record<string, { month: string; income: number; expense: number }> = {};
  for (const r of filtered) {
    const month = r.date.substring(0, 7);
    if (!months[month]) months[month] = { month, income: 0, expense: 0 };
    months[month][r.type as RecordType] = parseFloat((months[month][r.type as RecordType] + r.amount).toFixed(2));
  }

  return Object.values(months)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(m => ({ ...m, netBalance: parseFloat((m.income - m.expense).toFixed(2)) }));
}
