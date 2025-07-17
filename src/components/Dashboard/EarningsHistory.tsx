import React, { useState, useEffect } from 'react';
import { earningsAPI } from '../../services/api';
import { Earning } from '../../types';
import { Clock, TrendingUp, Filter, RefreshCw } from 'lucide-react';

export const EarningsHistory: React.FC = () => {
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const data = await earningsAPI.getHistory();
      setEarnings(data);
    } catch (error) {
      console.error('Failed to fetch earnings history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const filteredEarnings = earnings.filter(earning => 
    filter === 'all' || earning.method === filter
  );

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'mining': return 'text-orange-400 bg-orange-500/20';
      case 'staking': return 'text-green-400 bg-green-500/20';
      case 'trading': return 'text-blue-400 bg-blue-500/20';
      case 'referral': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getMethodIcon = (method: string) => {
    return method.charAt(0).toUpperCase() + method.slice(1);
  };

  const totalEarnings = filteredEarnings.reduce((sum, earning) => sum + earning.amount, 0);

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Earnings History</h2>
          <div className="animate-spin">
            <RefreshCw className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white/5 rounded-lg p-4 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg"></div>
                  <div>
                    <div className="h-4 bg-white/20 rounded w-20 mb-1"></div>
                    <div className="h-3 bg-white/20 rounded w-32"></div>
                  </div>
                </div>
                <div className="h-6 bg-white/20 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Earnings History</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Methods</option>
              <option value="mining">Mining</option>
              <option value="staking">Staking</option>
              <option value="trading">Trading</option>
              <option value="referral">Referral</option>
            </select>
          </div>
          <button
            onClick={fetchEarnings}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {filteredEarnings.length > 0 && (
        <div className="mb-4 p-4 bg-white/5 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Total from {filter === 'all' ? 'all methods' : filter}:</span>
            <span className="text-green-400 font-bold text-lg">
              +${totalEarnings.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredEarnings.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No earnings found</p>
            <p className="text-gray-500 text-sm">Start claiming rewards to see your history</p>
          </div>
        ) : (
          filteredEarnings.map((earning) => (
            <div
              key={earning.id}
              className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getMethodColor(earning.method)}`}>
                    <span className="font-bold text-sm">
                      {getMethodIcon(earning.method).slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {getMethodIcon(earning.method)}
                    </p>
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
                      <Clock className="h-3 w-3" />
                      <span>
                        {new Date(earning.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold text-lg">
                    +${earning.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredEarnings.length > 10 && (
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-sm">
            Showing latest {filteredEarnings.length} earnings
          </p>
        </div>
      )}
    </div>
  );
};