import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import { ArrowLeft, Repeat, Loader, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';

const mockPrices: { [key: string]: number } = {
  'USDT': 1,
  'BTC': 69000.50,
  'ETH': 3800.75,
  'SOL': 160.25,
  'XRP': 0.52,
  'USDC': 1.00,
  'DOGE': 0.15
};

const AssetSelector = ({ selectedAsset, onSelect, availableAssets, userBalances, label }: {
  selectedAsset: string;
  onSelect: (asset: string) => void;
  availableAssets: string[];
  userBalances: { [key: string]: number };
  label: string;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref]);

  return (
    <div className="flex-1" ref={ref}>
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <div className="relative">
        <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full text-left p-3 bg-gray-100 dark:bg-slate-900 rounded-lg flex justify-between items-center mt-1">
          <span className="font-bold text-lg text-slate-900 dark:text-white">{selectedAsset}</span>
          <ChevronDown size={20} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="absolute top-full mt-1 w-full bg-white dark:bg-slate-800 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto border border-gray-200 dark:border-slate-700">
            {availableAssets.map(asset => (
              <div key={asset} onClick={() => { onSelect(asset); setIsOpen(false); }} className="p-3 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer flex justify-between items-center">
                <span className="font-semibold">{asset}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{(userBalances[asset] || 0).toFixed(4)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ExchangeScreen = () => {
  const navigate = useNavigate();
  const { user, exchangeAssets, isLoading } = useAuth();
  
  const [fromAsset, setFromAsset] = React.useState('USDT');
  const [toAsset, setToAsset] = React.useState('BTC');
  const [fromAmount, setFromAmount] = React.useState('');
  const [toAmount, setToAmount] = React.useState('');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const userBalances = user?.portfolio.balances || {};
  const availableAssets = Object.keys(userBalances).filter(k => userBalances[k] > 0).concat(Object.keys(mockPrices).filter(k => !(userBalances[k] > 0)));

  const fromBalance = userBalances[fromAsset] || 0;
  const exchangeRate = mockPrices[fromAsset] / mockPrices[toAsset];

  React.useEffect(() => {
    if (fromAmount) {
      const numericAmount = parseFloat(fromAmount);
      if (!isNaN(numericAmount)) {
        setToAmount((numericAmount * exchangeRate).toPrecision(6));
      } else {
        setToAmount('');
      }
    } else {
      setToAmount('');
    }
  }, [fromAmount, exchangeRate]);
  
  const handleSwap = () => {
    const tempAsset = fromAsset;
    setFromAsset(toAsset);
    setToAsset(tempAsset);
    // Swap amounts as well
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };
  
  const handleExchange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const transferAmount = parseFloat(fromAmount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    
    if (transferAmount > fromBalance) {
      setError("Insufficient balance.");
      return;
    }

    try {
      await exchangeAssets(fromAsset, toAsset, transferAmount);
      setSuccess(`Successfully exchanged ${transferAmount} ${fromAsset} for ${toAmount} ${toAsset}.`);
      setFromAmount('');
      setToAmount('');
    } catch(err) {
      setError(err instanceof Error ? err.message : 'Exchange failed.');
    } finally {
        setTimeout(() => {
            setSuccess('');
            setError('');
        }, 4000);
    }
  };
  
  return (
    <div className="animate-fade-in bg-gray-50 dark:bg-black min-h-screen text-slate-900 dark:text-white">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-zinc-800">
          <div className="flex items-center justify-between h-16 px-4 max-w-screen-md mx-auto">
              <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
                  <ArrowLeft size={24} />
              </button>
              <h1 className="text-lg font-bold">Exchange</h1>
              <div className="w-10"></div>
          </div>
      </header>

      <main className="p-4 max-w-screen-md mx-auto space-y-6 pb-24">
        <form onSubmit={handleExchange} className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 space-y-6 shadow-sm">
          {/* Asset Selection Card */}
          <div className="relative flex flex-col space-y-4">
            {/* From Asset */}
            <div className="flex items-center space-x-4">
               <AssetSelector 
                 label="From"
                 selectedAsset={fromAsset}
                 onSelect={setFromAsset}
                 availableAssets={availableAssets}
                 userBalances={userBalances}
               />
              <div className="flex-1">
                 <span className="text-xs text-gray-500 dark:text-gray-400">You send</span>
                 <input 
                    type="number"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full text-lg font-bold bg-transparent border-b-2 border-gray-200 dark:border-slate-700 focus:border-purple-500 focus:outline-none transition py-2.5"
                  />
              </div>
            </div>
            <p className="text-xs text-right -mt-2 text-gray-500 dark:text-gray-400 pr-1">Balance: {fromBalance.toFixed(6)}</p>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button type="button" onClick={handleSwap} className="p-3 bg-gray-100 dark:bg-slate-700 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-500 dark:text-purple-400 transition-colors">
                <Repeat size={20} />
              </button>
            </div>

            {/* To Asset */}
            <div className="flex items-center space-x-4">
              <AssetSelector 
                 label="To"
                 selectedAsset={toAsset}
                 onSelect={setToAsset}
                 availableAssets={availableAssets}
                 userBalances={userBalances}
              />
              <div className="flex-1">
                 <span className="text-xs text-gray-500 dark:text-gray-400">You receive (est.)</span>
                 <input 
                    type="number"
                    value={toAmount}
                    readOnly
                    placeholder="0.00"
                    className="w-full text-lg font-bold bg-transparent border-b-2 border-gray-200 dark:border-slate-700 py-2.5"
                  />
              </div>
            </div>
          </div>
          
          {/* Rate and submit */}
          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-700">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 font-mono">
                1 {fromAsset} &asymp; {exchangeRate.toPrecision(6)} {toAsset}
            </p>

            {error && <div className="p-3 bg-red-500/10 text-red-500 rounded-lg text-sm flex items-center gap-2"><AlertCircle size={16}/>{error}</div>}
            {success && <div className="p-3 bg-green-500/10 text-green-500 rounded-lg text-sm flex items-center gap-2"><CheckCircle size={16}/>{success}</div>}

            <button type="submit" disabled={isLoading || !fromAmount || parseFloat(fromAmount) <= 0 || parseFloat(fromAmount) > fromBalance} className="w-full py-3 mt-2 rounded-lg font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:bg-slate-500 dark:disabled:bg-slate-700 disabled:text-gray-100 dark:disabled:text-gray-400 disabled:cursor-not-allowed transition-colors flex justify-center items-center">
              {isLoading ? <Loader className="animate-spin" /> : 'Confirm Exchange'}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
};

export default ExchangeScreen;