import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface TransactionRow extends RowDataPacket {
  id: number;
  user_id: number;
  amount: number;
  category: string;
  payment_method: string;
  description: string;
  transaction_date: string;
  created_at: Date;
}

interface CountRow extends RowDataPacket {
  total: number;
}

export interface CreateTransactionData {
  userId: number;
  amount: number;
  category: string;
  paymentMethod: string;
  description?: string;
  transactionDate: string;
}

export interface UpdateTransactionData {
  amount?: number;
  category?: string;
  paymentMethod?: string;
  description?: string;
  transactionDate?: string;
}

export async function createTransaction(data: CreateTransactionData) {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO transactions (user_id, amount, category, payment_method, description, transaction_date)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [data.userId, data.amount, data.category, data.paymentMethod, data.description || '', data.transactionDate]
  );

  const [rows] = await pool.query<TransactionRow[]>(
    'SELECT * FROM transactions WHERE id = ?',
    [result.insertId]
  );

  return rows[0];
}

export async function getTransactions(
  userId: number,
  page: number = 1,
  limit: number = 20,
  startDate?: string,
  endDate?: string
) {
  let countQuery = 'SELECT COUNT(*) as total FROM transactions WHERE user_id = ?';
  let dataQuery = 'SELECT * FROM transactions WHERE user_id = ?';
  const params: any[] = [userId];

  if (startDate) {
    countQuery += ' AND transaction_date >= ?';
    dataQuery += ' AND transaction_date >= ?';
    params.push(startDate);
  }

  if (endDate) {
    countQuery += ' AND transaction_date <= ?';
    dataQuery += ' AND transaction_date <= ?';
    params.push(endDate);
  }

  dataQuery += ' ORDER BY transaction_date DESC, created_at DESC LIMIT ? OFFSET ?';

  const [countRows] = await pool.query<CountRow[]>(countQuery, params);
  const total = countRows[0].total;

  const offset = (page - 1) * limit;
  const [rows] = await pool.query<TransactionRow[]>(dataQuery, [...params, limit, offset]);

  return {
    transactions: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getTransactionById(id: number, userId: number) {
  const [rows] = await pool.query<TransactionRow[]>(
    'SELECT * FROM transactions WHERE id = ? AND user_id = ?',
    [id, userId]
  );

  if (rows.length === 0) {
    throw new Error('Transaction not found');
  }

  return rows[0];
}

export async function updateTransaction(id: number, userId: number, data: UpdateTransactionData) {
  await getTransactionById(id, userId);

  const fields: string[] = [];
  const values: any[] = [];

  if (data.amount !== undefined) {
    fields.push('amount = ?');
    values.push(data.amount);
  }
  if (data.category !== undefined) {
    fields.push('category = ?');
    values.push(data.category);
  }
  if (data.paymentMethod !== undefined) {
    fields.push('payment_method = ?');
    values.push(data.paymentMethod);
  }
  if (data.description !== undefined) {
    fields.push('description = ?');
    values.push(data.description);
  }
  if (data.transactionDate !== undefined) {
    fields.push('transaction_date = ?');
    values.push(data.transactionDate);
  }

  if (fields.length === 0) {
    throw new Error('No fields to update');
  }

  values.push(id, userId);

  await pool.query(
    `UPDATE transactions SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
    values
  );

  return getTransactionById(id, userId);
}

export async function deleteTransaction(id: number, userId: number) {
  await getTransactionById(id, userId);

  await pool.query('DELETE FROM transactions WHERE id = ? AND user_id = ?', [id, userId]);

  return { message: 'Transaction deleted successfully' };
}
