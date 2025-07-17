import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { statsAPI } from '../../services/api';
import { Stats } from '../../types';
import { Wallet, TrendingUp, Download, Users, DollarSign, Activity } from 'lucide-react';

export const StatsCards: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statsAPI.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 animate-pulse">
            <div className="h-4 bg-white/20 rounded mb-2"></div>
            <div className="h-8 bg-white/20 rounded mb-4"></div>
            <div className="h-3 bg-white/20 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Current Balance',
      value: `$${user?.balance?.toFixed(2) || '0.00'}`,
      icon: Wallet,
      color: 'from-green-500 to-emerald-600',
      change: '+12.5%',
      changeColor: 'text-green-400'
    },
    {
      title: 'Total Earned',
      value: `$${user?.totalEarned?.toFixed(2) || '0.00'}`,
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-600',
      change: '+8.2%',
      changeColor: 'text-blue-400'
    },
    {
      title: 'Total Withdrawn',
      value: `$${stats?.userStats.totalWithdrawn?.toFixed(2) || '0.00'}`,
      icon: Download,
      color: 'from-purple-500 to-pink-600',
      change: '+15.3%',
      changeColor: 'text-purple-400'
    },
    {
      title: 'Earnings Count',
      value: stats?.userStats.earningsCount?.toString() || '0',
      icon: Activity,
      color: 'from-orange-500 to-red-600',
      change: '+5',
      changeColor: 'text-orange-400'
    },
    {
      title: 'Platform Users',
      value: stats?.totalUsers?.toString() || '0',
      icon: Users,
      color: 'from-indigo-500 to-purple-600',
      change: '+23',
      changeColor: 'text-indigo-400'
    },
    {
      title: 'Platform Volume',
      value: `$${stats?.totalEarnings?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: 'from-yellow-500 to-orange-600',
      change: '+18.7%',
      changeColor: 'text-yellow-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg bg-gradient-to-r ${card.color}`}>
              <card.icon className="h-6 w-6 text-white" />
            </div>
            <div className={`text-sm font-medium ${card.changeColor}`}>
              {card.change}
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-gray-300 text-sm font-medium">{card.title}</p>
            <p className="text-2xl font-bold text-white">{card.value}</p>
          </div>
          
          <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${card.color} rounded-full transition-all duration-1000`}
              style={{ width: `${Math.random() * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};