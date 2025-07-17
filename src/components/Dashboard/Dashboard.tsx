import React, { useState } from 'react';
import { Header } from './Header';
import { StatsCards } from './StatsCards';
import { CryptoPrices } from './CryptoPrices';
import { EarningActions } from './EarningActions';
import { EarningsHistory } from './EarningsHistory';
import { WithdrawModal } from './WithdrawModal';
import { Download } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions Bar */}
        <div className="mb-8 flex justify-end">
          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <Download className="h-5 w-5" />
            <span>Withdraw Funds</span>
          </button>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Crypto Prices */}
        <CryptoPrices />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Earning Actions */}
          <div>
            <EarningActions />
          </div>

          {/* Earnings History */}
          <div>
            <EarningsHistory />
          </div>
        </div>
      </main>

      {/* Withdraw Modal */}
      <WithdrawModal 
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
      />
    </div>
  );
};