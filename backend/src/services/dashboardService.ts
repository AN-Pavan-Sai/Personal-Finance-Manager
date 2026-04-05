import pool from '../config/database';
import { RowDataPacket } from 'mysql2';

interface SummaryRow extends RowDataPacket {
  total_amount: number;
  transaction_count: number;
}

interface DailyExpenseRow extends RowDataPacket {
  date: string;
  total: number;
  count: number;
}

interface CategoryRow extends RowDataPacket {
  category: string;
  total: number;
  count: number;
}

interface MonthlyRow extends RowDataPacket {
  month: string;
  total: number;
  count: number;
}

export async function getTodaySummary(userId: number) {
  const today = new Date().toISOString().split('T')[0];

  const [rows] = await pool.query<SummaryRow[]>(
    `SELECT COALESCE(SUM(amount), 0) as total_amount, COUNT(*) as transaction_count
     FROM transactions WHERE user_id = ? AND transaction_date = ?`,
    [userId, today]
  );

  return {
    todayExpenses: parseFloat(rows[0].total_amount as any) || 0,
    todayTransactions: rows[0].transaction_count,
  };
}

export async function getMonthSummary(userId: number, year?: number, month?: number) {
  const now = new Date();
  const y = year || now.getFullYear();
  const m = month || now.getMonth() + 1;
  const lastDay = new Date(y, m, 0).getDate();
  const startDate = `${y}-${String(m).padStart(2, '0')}-01`;
  const endDate = `${y}-${String(m).padStart(2, '0')}-${lastDay}`;

  const [rows] = await pool.query<SummaryRow[]>(
    `SELECT COALESCE(SUM(amount), 0) as total_amount, COUNT(*) as transaction_count
     FROM transactions WHERE user_id = ? AND transaction_date >= ? AND transaction_date <= ?`,
    [userId, startDate, endDate]
  );

  return {
    monthlyExpenses: parseFloat(rows[0].total_amount as any) || 0,
    monthlyTransactions: rows[0].transaction_count,
    year: y,
    month: m,
  };
}

export async function getDailyExpenses(userId: number, year?: number, month?: number) {
  const now = new Date();
  const y = year || now.getFullYear();
  const m = month || now.getMonth() + 1;
  const lastDay = new Date(y, m, 0).getDate();
  const startDate = `${y}-${String(m).padStart(2, '0')}-01`;
  const endDate = `${y}-${String(m).padStart(2, '0')}-${lastDay}`;

  const [rows] = await pool.query<DailyExpenseRow[]>(
    `SELECT DATE_FORMAT(transaction_date, '%Y-%m-%d') as date,
            SUM(amount) as total,
            COUNT(*) as count
     FROM transactions
     WHERE user_id = ? AND transaction_date >= ? AND transaction_date <= ?
     GROUP BY transaction_date
     ORDER BY transaction_date ASC`,
    [userId, startDate, endDate]
  );

  return rows.map((row) => ({
    date: row.date,
    total: parseFloat(row.total as any),
    count: row.count,
  }));
}

export async function getCategoryBreakdown(userId: number, year?: number, month?: number) {
  const now = new Date();
  const y = year || now.getFullYear();
  const m = month || now.getMonth() + 1;
  const lastDay = new Date(y, m, 0).getDate();
  const startDate = `${y}-${String(m).padStart(2, '0')}-01`;
  const endDate = `${y}-${String(m).padStart(2, '0')}-${lastDay}`;

  const [rows] = await pool.query<CategoryRow[]>(
    `SELECT category, SUM(amount) as total, COUNT(*) as count
     FROM transactions
     WHERE user_id = ? AND transaction_date >= ? AND transaction_date <= ?
     GROUP BY category
     ORDER BY total DESC`,
    [userId, startDate, endDate]
  );

  return rows.map((row) => ({
    category: row.category,
    total: parseFloat(row.total as any),
    count: row.count,
  }));
}

export async function getTopCategory(userId: number, year?: number, month?: number) {
  const breakdown = await getCategoryBreakdown(userId, year, month);

  if (breakdown.length === 0) {
    return { category: 'N/A', total: 0, count: 0 };
  }

  return breakdown[0];
}

export async function getDashboardSummary(userId: number) {
  const today = await getTodaySummary(userId);
  const monthly = await getMonthSummary(userId);
  const topCategory = await getTopCategory(userId);

  return {
    ...today,
    ...monthly,
    topCategory,
  };
}

export async function getMonthlySummaries(userId: number, year?: number) {
  const y = year || new Date().getFullYear();

  const [rows] = await pool.query<MonthlyRow[]>(
    `SELECT DATE_FORMAT(transaction_date, '%Y-%m') as month,
            SUM(amount) as total,
            COUNT(*) as count
     FROM transactions
     WHERE user_id = ? AND YEAR(transaction_date) = ?
     GROUP BY DATE_FORMAT(transaction_date, '%Y-%m')
     ORDER BY month ASC`,
    [userId, y]
  );

  return rows.map((row) => ({
    month: row.month,
    total: parseFloat(row.total as any),
    count: row.count,
  }));
}
