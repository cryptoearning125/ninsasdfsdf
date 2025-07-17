import React, { useState, useEffect } from 'react';
import { cryptoAPI } from '../../services/api';
import { CryptoPrices as CryptoPricesType } from '../../types';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

export const CryptoPrices: React.FC = () => {
  const [prices, setPrices] = useState<CryptoPricesType>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchPrices = async () => {
    try {
      const data = await cryptoAPI.getPrices();
      setPrices(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch crypto prices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    
    // Update prices every 30 seconds
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const cryptoInfo = {
    bitcoin: { name: 'Bitcoin', symbol: 'BTC', color: 'from-orange-500 to-yellow-600' },
    ethereum: { name: 'Ethereum', symbol: 'ETH', color: 'from-blue-500 to-purple-600' },
    cardano: { name: 'Cardano', symbol: 'ADA', color: 'from-blue-600 to-indigo-700' },
    solana: { name: 'Solana', symbol: 'SOL', color: 'from-purple-500 to-pink-600' },
    polygon: { name: 'Polygon', symbol: 'MATIC', color: 'from-purple-600 to-blue-600' },
    chainlink: { name: 'Chainlink', symbol: 'LINK', color: 'from-blue-500 to-cyan-600' }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Live Crypto Prices</h2>
          <div className="animate-spin">
            <RefreshCw className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/5 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-white/20 rounded mb-2"></div>
              <div className="h-6 bg-white/20 rounded mb-2"></div>
              <div className="h-3 bg-white/20 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Live Crypto Prices</h2>
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <RefreshCw className="h-4 w-4" />
          <span>Updated {lastUpdate.toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(prices).map(([crypto, data]) => {
          const info = cryptoInfo[crypto as keyof typeof cryptoInfo];
          const isPositive = data.change >= 0;
          
          return (
            <div
              key={crypto}
              className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${info.color} flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">{info.symbol.slice(0, 2)}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{info.name}</h3>
                    <p className="text-gray-400 text-sm">{info.symbol}</p>
                  </div>
                </div>
                
                <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">
                    {isPositive ? '+' : ''}{data.change.toFixed(2)}%
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-2xl font-bold text-white">
                  ${data.price.toLocaleString(undefined, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </p>
              </div>
              
              <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${info.color} rounded-full transition-all duration-1000`}
                  style={{ width: `${Math.min(Math.abs(data.change) * 10, 100)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};