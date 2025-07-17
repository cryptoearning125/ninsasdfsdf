import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { earningsAPI, handleAPIError } from '../../services/api';
import { EarningMethod } from '../../types';
import { Pickaxe, Shield, TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';

export const EarningActions: React.FC = () => {
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [cooldowns, setCooldowns] = useState<{ [key: string]: number }>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const earningMethods: EarningMethod[] = [
    {
      id: 'mining',
      name: 'Crypto Mining',
      description: 'Mine cryptocurrencies and earn rewards',
      minAmount: 5,
      maxAmount: 25,
      icon: 'pickaxe',
      color: 'from-orange-500 to-red-600',
      cooldown: 300 // 5 minutes
    },
    {
      id: 'staking',
      name: 'Staking Rewards',
      description: 'Stake your tokens and earn passive income',
      minAmount: 10,
      maxAmount: 50,
      icon: 'shield',
      color: 'from-green-500 to-emerald-600',
      cooldown: 600 // 10 minutes
    },
    {
      id: 'trading',
      name: 'Trading Profits',
      description: 'Execute profitable trades and earn commissions',
      minAmount: 15,
      maxAmount: 75,
      icon: 'trending-up',
      color: 'from-blue-500 to-cyan-600',
      cooldown: 900 // 15 minutes
    },
    {
      id: 'referral',
      name: 'Referral Bonus',
      description: 'Earn from your referral network',
      minAmount: 8,
      maxAmount: 40,
      icon: 'users',
      color: 'from-purple-500 to-pink-600',
      cooldown: 1800 // 30 minutes
    }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'pickaxe': return Pickaxe;
      case 'shield': return Shield;
      case 'trending-up': return TrendingUp;
      case 'users': return Users;
      default: return Pickaxe;
    }
  };

  useEffect(() => {
    // Load cooldowns from localStorage
    const savedCooldowns = localStorage.getItem('earningCooldowns');
    if (savedCooldowns) {
      const parsed = JSON.parse(savedCooldowns);
      const now = Date.now();
      const activeCooldowns: { [key: string]: number } = {};
      
      Object.entries(parsed).forEach(([method, endTime]) => {
        if (typeof endTime === 'number' && endTime > now) {
          activeCooldowns[method] = endTime;
        }
      });
      
      setCooldowns(activeCooldowns);
    }
  }, []);

  useEffect(() => {
    // Update cooldown timers
    const interval = setInterval(() => {
      const now = Date.now();
      setCooldowns(prev => {
        const updated = { ...prev };
        let hasChanges = false;
        
        Object.entries(updated).forEach(([method, endTime]) => {
          if (endTime <= now) {
            delete updated[method];
            hasChanges = true;
          }
        });
        
        if (hasChanges) {
          localStorage.setItem('earningCooldowns', JSON.stringify(updated));
        }
        
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClaim = async (method: EarningMethod) => {
    if (cooldowns[method.id]) return;
    
    setLoading(method.id);
    setMessage(null);

    try {
      const amount = Math.random() * (method.maxAmount - method.minAmount) + method.minAmount;
      const response = await earningsAPI.claimEarning(method.id, amount);
      
      // Update user balance
      updateUser({ 
        balance: response.newBalance, 
        totalEarned: response.totalEarned 
      });
      
      // Set cooldown
      const cooldownEnd = Date.now() + (method.cooldown * 1000);
      const newCooldowns = { ...cooldowns, [method.id]: cooldownEnd };
      setCooldowns(newCooldowns);
      localStorage.setItem('earningCooldowns', JSON.stringify(newCooldowns));
      
      setMessage({
        type: 'success',
        text: `Successfully claimed $${amount.toFixed(2)} from ${method.name}!`
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
      
    } catch (error) {
      setMessage({
        type: 'error',
        text: handleAPIError(error)
      });
      
      // Clear error message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setLoading(null);
    }
  };

  const formatCooldownTime = (endTime: number): string => {
    const remaining = Math.max(0, endTime - Date.now());
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Earning Actions</h2>
        <div className="text-sm text-gray-300">
          Click to claim rewards from different methods
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-500/20 border-green-500/50 text-green-200' 
            : 'bg-red-500/20 border-red-500/50 text-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            {message.type === 'success' && <CheckCircle className="h-5 w-5" />}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {earningMethods.map((method) => {
          const IconComponent = getIcon(method.icon);
          const isOnCooldown = !!cooldowns[method.id];
          const isLoading = loading === method.id;
          
          return (
            <div
              key={method.id}
              className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${method.color}`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{method.name}</h3>
                    <p className="text-gray-400 text-sm">{method.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Reward Range</span>
                  <span>${method.minAmount} - ${method.maxAmount}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Cooldown</span>
                  <span>{method.cooldown / 60} minutes</span>
                </div>
              </div>
              
              <button
                onClick={() => handleClaim(method)}
                disabled={isOnCooldown || isLoading}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all transform ${
                  isOnCooldown || isLoading
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : `bg-gradient-to-r ${method.color} text-white hover:scale-105 hover:shadow-lg`
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Claiming...
                  </div>
                ) : isOnCooldown ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{formatCooldownTime(cooldowns[method.id])}</span>
                  </div>
                ) : (
                  'Claim Reward'
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};