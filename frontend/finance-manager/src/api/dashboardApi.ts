import api from './axios';
import type { DashboardSummary, DailyExpense, CategoryBreakdown, MonthlySummary } from '../types';

export async function getDashboardSummaryApi(): Promise<DashboardSummary> {
  const { data } = await api.get<DashboardSummary>('/dashboard/summary');
  return data;
}

export async function getDailyExpensesApi(year?: number, month?: number): Promise<DailyExpense[]> {
  const params: Record<string, number> = {};
  if (year) params.year = year;
  if (month) params.month = month;
  const { data } = await api.get<DailyExpense[]>('/dashboard/daily-expenses', { params });
  return data;
}

export async function getCategoryBreakdownApi(year?: number, month?: number): Promise<CategoryBreakdown[]> {
  const params: Record<string, number> = {};
  if (year) params.year = year;
  if (month) params.month = month;
  const { data } = await api.get<CategoryBreakdown[]>('/dashboard/category-breakdown', { params });
  return data;
}

export async function getMonthlySummaryApi(year?: number): Promise<MonthlySummary[]> {
  const params: Record<string, number> = {};
  if (year) params.year = year;
  const { data } = await api.get<MonthlySummary[]>('/dashboard/monthly-summary', { params });
  return data;
}
