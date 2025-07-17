const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your-secret-key-change-in-production';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// In-memory storage (use database in production)
const users = [];
const earnings = [];
const withdrawals = [];

// Crypto prices simulation
let cryptoPrices = {
  bitcoin: { price: 45000, change: 2.5 },
  ethereum: { price: 3200, change: -1.2 },
  cardano: { price: 0.85, change: 4.1 },
  solana: { price: 120, change: -0.8 },
  polygon: { price: 1.2, change: 3.2 },
  chainlink: { price: 18.5, change: 1.8 }
};

// Update crypto prices every 30 seconds
setInterval(() => {
  Object.keys(cryptoPrices).forEach(crypto => {
    const changePercent = (Math.random() - 0.5) * 10; // -5% to +5%
    cryptoPrices[crypto].price *= (1 + changePercent / 100);
    cryptoPrices[crypto].change = changePercent;
  });
}, 30000);

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      name,
      balance: 0,
      totalEarned: 0,
      createdAt: new Date()
    };
    
    users.push(user);
    
    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        balance: user.balance,
        totalEarned: user.totalEarned
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        balance: user.balance,
        totalEarned: user.totalEarned
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    balance: user.balance,
    totalEarned: user.totalEarned
  });
});

app.get('/api/crypto-prices', (req, res) => {
  res.json(cryptoPrices);
});

app.post('/api/claim-earning', authenticateToken, (req, res) => {
  try {
    const { method, amount } = req.body;
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate earning method and amount
    const validMethods = ['mining', 'staking', 'trading', 'referral'];
    if (!validMethods.includes(method)) {
      return res.status(400).json({ error: 'Invalid earning method' });
    }

    if (amount <= 0 || amount > 100) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Add earning
    const earning = {
      id: earnings.length + 1,
      userId: user.id,
      method,
      amount,
      timestamp: new Date()
    };
    
    earnings.push(earning);
    
    // Update user balance
    user.balance += amount;
    user.totalEarned += amount;
    
    res.json({
      success: true,
      earning,
      newBalance: user.balance,
      totalEarned: user.totalEarned
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/earnings-history', authenticateToken, (req, res) => {
  const userEarnings = earnings
    .filter(e => e.userId === req.user.id)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 50); // Last 50 earnings
  
  res.json(userEarnings);
});

app.post('/api/withdraw', authenticateToken, (req, res) => {
  try {
    const { amount, address } = req.body;
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate withdrawal
    if (amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    if (amount > user.balance) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    if (!address || address.length < 10) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    // Process withdrawal
    const withdrawal = {
      id: withdrawals.length + 1,
      userId: user.id,
      amount,
      address,
      status: 'pending',
      timestamp: new Date()
    };
    
    withdrawals.push(withdrawal);
    user.balance -= amount;
    
    // Simulate processing (in real app, this would be async)
    setTimeout(() => {
      withdrawal.status = 'completed';
    }, 5000);
    
    res.json({
      success: true,
      withdrawal,
      newBalance: user.balance
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/withdrawals', authenticateToken, (req, res) => {
  const userWithdrawals = withdrawals
    .filter(w => w.userId === req.user.id)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  res.json(userWithdrawals);
});

app.get('/api/stats', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  const userEarnings = earnings.filter(e => e.userId === req.user.id);
  const userWithdrawals = withdrawals.filter(w => w.userId === req.user.id);
  
  const stats = {
    totalUsers: users.length,
    totalEarnings: earnings.reduce((sum, e) => sum + e.amount, 0),
    totalWithdrawals: withdrawals.reduce((sum, w) => sum + w.amount, 0),
    userStats: {
      balance: user?.balance || 0,
      totalEarned: user?.totalEarned || 0,
      totalWithdrawn: userWithdrawals.reduce((sum, w) => sum + w.amount, 0),
      earningsCount: userEarnings.length,
      withdrawalsCount: userWithdrawals.length
    }
  };
  
  res.json(stats);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});