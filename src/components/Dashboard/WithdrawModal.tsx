import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { withdrawalAPI, handleAPIError } from '../../services/api';
import { X, Wallet, AlertCircle, CheckCircle, Copy } from 'lucide-react';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const withdrawAmount = parseFloat(amount);
      
      if (withdrawAmount <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      
      if (withdrawAmount > (user?.balance || 0)) {
        throw new Error('Insufficient balance');
      }
      
      if (withdrawAmount < 10) {
        throw new Error('Minimum withdrawal amount is $10');
      }

      const response = await withdrawalAPI.withdraw(withdrawAmount, address);
      
      // Update user balance
      updateUser({ balance: response.newBalance });
      
      setSuccess(true);
      
      // Reset form after 2 seconds and close modal
      setTimeout(() => {
        setAmount('');
        setAddress('');
        setSuccess(false);
        onClose();
      }, 2000);
      
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleMaxAmount = () => {
    if (user?.balance) {
      setAmount(Math.max(0, user.balance - 0.01).toFixed(2));
    }
  };

  const generateSampleAddress = () => {
    const sampleAddresses = [
      '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
      'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
    ];
    setAddress(sampleAddresses[Math.floor(Math.random() * sampleAddresses.length)]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Withdraw Funds</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Withdrawal Successful!</h3>
            <p className="text-gray-300">Your withdrawal has been processed and will arrive shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <span className="text-red-200 text-sm">{error}</span>
              </div>
            )}

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Available Balance</span>
                <div className="flex items-center space-x-2">
                  <Wallet className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 font-bold">
                    ${user?.balance?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>
              <p className="text-gray-400 text-xs">Minimum withdrawal: $10.00</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Withdrawal Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="10"
                    max={user?.balance || 0}
                    step="0.01"
                    className="w-full pl-8 pr-20 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleMaxAmount}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded hover:bg-blue-500/30 transition-colors"
                  >
                    MAX
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Wallet Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your wallet address"
                    className="w-full pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateSampleAddress}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    title="Generate sample address"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-gray-400 text-xs mt-1">
                  Make sure this address is correct. Transactions cannot be reversed.
                </p>
              </div>
            </div>

            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div className="text-yellow-200 text-sm">
                  <p className="font-medium mb-1">Important Notice:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Withdrawals are processed within 24 hours</li>
                    <li>• Network fees may apply</li>
                    <li>• Double-check your wallet address</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !amount || !address}
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Withdraw Funds'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};