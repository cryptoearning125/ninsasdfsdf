import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Wallet, TrendingUp } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CryptoEarn</h1>
                <p className="text-xs text-gray-300">Earning Platform</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
              <Wallet className="h-4 w-4 text-green-400" />
              <span className="text-white font-semibold">
                ${user?.balance?.toFixed(2) || '0.00'}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <p className="text-white font-medium">{user?.name}</p>
                <p className="text-xs text-gray-300">{user?.email}</p>
              </div>
              
              <div className="h-10 w-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>

              <button
                onClick={logout}
                className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};