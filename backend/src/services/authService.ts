import pool from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<{ user: { id: number; name: string; email: string }; token: string }> {
  const [existing] = await pool.query<UserRow[]>(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );

  if (existing.length > 0) {
    throw new Error('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
  );

  const token = generateToken(result.insertId);

  return {
    user: { id: result.insertId, name, email },
    token,
  };
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ user: { id: number; name: string; email: string }; token: string }> {
  const [rows] = await pool.query<UserRow[]>(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );

  if (rows.length === 0) {
    throw new Error('Invalid email or password');
  }

  const user = rows[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user.id);

  return {
    user: { id: user.id, name: user.name, email: user.email },
    token,
  };
}

export async function getUserById(
  userId: number
): Promise<{ id: number; name: string; email: string; created_at: Date }> {
  const [rows] = await pool.query<UserRow[]>(
    'SELECT id, name, email, created_at FROM users WHERE id = ?',
    [userId]
  );

  if (rows.length === 0) {
    throw new Error('User not found');
  }

  const user = rows[0];
  return { id: user.id, name: user.name, email: user.email, created_at: user.created_at };
}
