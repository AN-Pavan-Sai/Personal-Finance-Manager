export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}

export interface Transaction {
  id: number;
  user_id: number;
  amount: number;
  category: Category;
  payment_method: PaymentMethod;
  description: string;
  transaction_date: string;
  created_at: string;
}

export type Category =
  | 'Food & Dining'
  | 'Transportation'
  | 'Shopping'
  | 'Bills & Utilities'
  | 'Entertainment'
  | 'Healthcare'
  | 'Education'
  | 'Rent'
  | 'Groceries'
  | 'Other';

export type PaymentMethod =
  | 'Cash'
  | 'Online Payment'
  | 'Net Banking'
  | 'Credit Card'
  | 'Debit Card'
  | 'UPI';

export const CATEGORIES: Category[] = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Bills & Utilities',
  'Entertainment',
  'Healthcare',
  'Education',
  'Rent',
  'Groceries',
  'Other',
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  'Cash',
  'Online Payment',
  'Net Banking',
  'Credit Card',
  'Debit Card',
  'UPI',
];

export interface DashboardSummary {
  todayExpenses: number;
  todayTransactions: number;
  monthlyExpenses: number;
  monthlyTransactions: number;
  year: number;
  month: number;
  topCategory: {
    category: string;
    total: number;
    count: number;
  };
}

export interface DailyExpense {
  date: string;
  total: number;
  count: number;
}

export interface CategoryBreakdown {
  category: string;
  total: number;
  count: number;
}

export interface MonthlySummary {
  month: string;
  total: number;
  count: number;
}

export interface PaginatedResponse<T> {
  transactions: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface CreateTransactionData {
  amount: number;
  category: Category;
  paymentMethod: PaymentMethod;
  description?: string;
  transactionDate: string;
}
