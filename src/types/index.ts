export interface User {
  id: number;
  email: string;
  name: string;
  balance: number;
  totalEarned: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateUser: (userData: Partial<User>) => void;
}

export interface CryptoPrice {
  price: number;
  change: number;
}

export interface CryptoPrices {
  [key: string]: CryptoPrice;
}

export interface Earning {
  id: number;
  userId: number;
  method: string;
  amount: number;
  timestamp: string;
}

export interface Withdrawal {
  id: number;
  userId: number;
  amount: number;
  address: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
}

export interface Stats {
  totalUsers: number;
  totalEarnings: number;
  totalWithdrawals: number;
  userStats: {
    balance: number;
    totalEarned: number;
    totalWithdrawn: number;
    earningsCount: number;
    withdrawalsCount: number;
  };
}

export interface EarningMethod {
  id: string;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  icon: string;
  color: string;
  cooldown: number; // in seconds
}