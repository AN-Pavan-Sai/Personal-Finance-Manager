import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import {
  getDashboardSummary,
  getDailyExpenses,
  getCategoryBreakdown,
  getMonthlySummaries,
} from '../services/dashboardService';

const router = Router();

router.use(authenticate);

router.get('/summary', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const summary = await getDashboardSummary(req.userId!);
    res.json(summary);
  } catch (error: any) {
    console.error('Summary API Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/daily-expenses', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;
    const month = req.query.month ? parseInt(req.query.month as string) : undefined;
    const data = await getDailyExpenses(req.userId!, year, month);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/category-breakdown', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;
    const month = req.query.month ? parseInt(req.query.month as string) : undefined;
    const data = await getCategoryBreakdown(req.userId!, year, month);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/monthly-summary', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;
    const data = await getMonthlySummaries(req.userId!, year);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
