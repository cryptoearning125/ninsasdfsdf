import axios from 'axios';
import { User, CryptoPrices, Earning, Withdrawal, Stats } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  register: async (email: string, password: string, name: string) => {
    const response = await api.post('/register', { email, password, name });
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/profile');
    return response.data;
  },
};

export const cryptoAPI = {
  getPrices: async (): Promise<CryptoPrices> => {
    const response = await api.get('/crypto-prices');
    return response.data;
  },
};

export const earningsAPI = {
  claimEarning: async (method: string, amount: number) => {
    const response = await api.post('/claim-earning', { method, amount });
    return response.data;
  },

  getHistory: async (): Promise<Earning[]> => {
    const response = await api.get('/earnings-history');
    return response.data;
  },
};

export const withdrawalAPI = {
  withdraw: async (amount: number, address: string) => {
    const response = await api.post('/withdraw', { amount, address });
    return response.data;
  },

  getWithdrawals: async (): Promise<Withdrawal[]> => {
    const response = await api.get('/withdrawals');
    return response.data;
  },
};

export const statsAPI = {
  getStats: async (): Promise<Stats> => {
    const response = await api.get('/stats');
    return response.data;
  },
};

// Error handling utility
export const handleAPIError = (error: any): string => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};