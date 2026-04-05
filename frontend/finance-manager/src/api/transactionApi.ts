import api from './axios';
import type { Transaction, PaginatedResponse, CreateTransactionData } from '../types';

export async function getTransactionsApi(
  page: number = 1,
  limit: number = 20,
  startDate?: string,
  endDate?: string
): Promise<PaginatedResponse<Transaction>> {
  const params: Record<string, string | number> = { page, limit };
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  const { data } = await api.get<PaginatedResponse<Transaction>>('/transactions', { params });
  return data;
}

export async function createTransactionApi(txnData: CreateTransactionData): Promise<Transaction> {
  const { data } = await api.post<Transaction>('/transactions', txnData);
  return data;
}

export async function updateTransactionApi(
  id: number,
  txnData: Partial<CreateTransactionData>
): Promise<Transaction> {
  const { data } = await api.put<Transaction>(`/transactions/${id}`, txnData);
  return data;
}

export async function deleteTransactionApi(id: number): Promise<void> {
  await api.delete(`/transactions/${id}`);
}
