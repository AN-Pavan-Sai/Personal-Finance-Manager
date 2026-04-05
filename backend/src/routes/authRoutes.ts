import { Router, Response } from 'express';
import { z } from 'zod';
import { registerUser, loginUser, getUserById } from '../services/authService';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

router.post('/register', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);
    const result = await registerUser(name, email, password);
    res.status(201).json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.issues[0].message });
      return;
    }
    if (error.message === 'Email already registered') {
      res.status(409).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await loginUser(email, password);
    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.issues[0].message });
      return;
    }
    if (error.message === 'Invalid email or password') {
      res.status(401).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await getUserById(req.userId!);
    res.json(user);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
