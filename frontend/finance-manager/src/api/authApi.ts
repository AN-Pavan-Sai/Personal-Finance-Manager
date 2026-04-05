import api from './axios';
import type { AuthResponse, User } from '../types';

export async function loginApi(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  return data;
}

export async function registerApi(name: string, email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password });
  return data;
}

export async function getMeApi(): Promise<User> {
  const { data } = await api.get<User>('/auth/me');
  return data;
}
