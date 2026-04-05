import { Router, Response } from 'express';
import { z } from 'zod';
import { authenticate, AuthRequest } from '../middleware/auth';
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from '../services/transactionService';

const router = Router();

const CATEGORIES = [
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
] as const;

const PAYMENT_METHODS = [
  'Cash',
  'Online Payment',
  'Net Banking',
  'Credit Card',
  'Debit Card',
  'UPI',
] as const;

const createTransactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  category: z.enum(CATEGORIES),
  paymentMethod: z.enum(PAYMENT_METHODS),
  description: z.string().max(500).optional(),
  transactionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
});

const updateTransactionSchema = z.object({
  amount: z.number().positive('Amount must be positive').optional(),
  category: z.enum(CATEGORIES).optional(),
  paymentMethod: z.enum(PAYMENT_METHODS).optional(),
  description: z.string().max(500).optional(),
  transactionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').optional(),
});

router.use(authenticate);

router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = createTransactionSchema.parse(req.body);
    const transaction = await createTransaction({
      userId: req.userId!,
      ...data,
    });
    res.status(201).json(transaction);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.issues[0].message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(String(req.query.page || '1'));
    const limit = parseInt(String(req.query.limit || '20'));
    const startDate = req.query.startDate ? String(req.query.startDate) : undefined;
    const endDate = req.query.endDate ? String(req.query.endDate) : undefined;

    const result = await getTransactions(req.userId!, page, limit, startDate, endDate);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const transaction = await getTransactionById(parseInt(String(req.params.id)), req.userId!);
    res.json(transaction);
  } catch (error: any) {
    if (error.message === 'Transaction not found') {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = updateTransactionSchema.parse(req.body);
    const transaction = await updateTransaction(parseInt(String(req.params.id)), req.userId!, data);
    res.json(transaction);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.issues[0].message });
      return;
    }
    if (error.message === 'Transaction not found') {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await deleteTransaction(parseInt(String(req.params.id)), req.userId!);
    res.json(result);
  } catch (error: any) {
    if (error.message === 'Transaction not found') {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
