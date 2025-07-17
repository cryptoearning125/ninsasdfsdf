import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import type { CryptoCoin } from '../types.ts';
import { ChevronDown, Loader, PlusCircle, ArrowDownCircle, HelpCircle, Rocket, BrainCircuit, ShieldCheck, Headset, Bot } from 'lucide-react';

const HomeHeader = () => {
    const { user } = useAuth();
    
    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-gray-200 dark:border-zinc-800">
            <div className="flex items-center justify-between h-16 px-4 max-w-screen-2xl mx-auto">
                <div className="flex flex-col">
                    <span className="text-xs font-medium">UID: {user?.uid || 'N/A'}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Credit Rating: Excellent</span>
                </div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white absolute left-1/2 -translate-x-1/2">
                    Home
                </h1>
                <div className="flex items-center space-x-2">
                    <img src="https://flagcdn.com/w40/us.png" alt="US" className="w-6 h-4 object-cover rounded" />
                    <span className="text-sm font-medium">EN</span>
                </div>
            </div>
        </div>
    );
};

const promoImages = [
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=300&fit=crop",
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=300&fit=crop",
    "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=300&fit=crop",
];

const PromoCarousel = () => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % promoImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full h-48 overflow-hidden">
            {promoImages.map((src, index) => (
                <img
                    key={src}
                    src={src}
                    alt={`Promo ${index + 1}`}
                    className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                />
            ))}
             <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                {promoImages.map((_, index) => (
                    <div key={index} className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}></div>
                ))}
            </div>
        </div>
    );
};

const useMarketData = (coinIds: string[] | null, limit?: number) => {
    const [data, setData] = React.useState<CryptoCoin[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const fetchData = React.useCallback(async () => {
        setLoading(true);
        let url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&page=1&sparkline=false';
        if (coinIds && coinIds.length > 0) {
            url += `&ids=${coinIds.join(',')}`;
        }
        if (limit) {
            url += `&per_page=${limit}`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch market data.');
            const result: CryptoCoin[] = await response.json();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    }, [coinIds ? coinIds.join(',') : '', limit]);

    React.useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, [fetchData]);

    return { data, loading, error };
};

const TickerCarousel = () => {
    const { data: coins, loading } = useMarketData(['bitcoin', 'ethereum', 'ripple', 'dogecoin', 'litecoin']);

    if (loading) return (
        <div className="h-24 flex items-center justify-center">
            <Loader className="animate-spin text-purple-500" />
        </div>
    );
    
    return (
        <div className="relative mx-4 bg-white dark:bg-slate-950/80 p-2 rounded-xl shadow-md -mt-10 z-10 backdrop-blur-sm">
             <div className="overflow-x-auto no-scrollbar">
                <div className="flex space-x-6">
                {coins.map(coin => (
                    <div key={coin.id} className="flex-shrink-0 flex flex-col items-center w-28">
                        <span className="text-sm font-bold">{coin.symbol.toUpperCase()}/USDT</span>
                         <span className={`text-lg font-bold ${coin.price_change_percentage_24h && coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                           {coin.current_price.toFixed(2)}
                        </span>
                         <span className={`text-sm ${coin.price_change_percentage_24h && coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                           {coin.price_change_percentage_24h?.toFixed(2)}%
                        </span>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
};

const ActionGrid = () => {
    const navigate = useNavigate();
    const actionItems = [
        { label: 'ICO Subscription', icon: <Rocket size={28} />, action: () => navigate('/subscription') },
        { label: 'About', icon: <HelpCircle size={28} />, action: () => navigate('/about') },
        { label: 'AI Robot', icon: <BrainCircuit size={28} />, action: () => {} },
        { label: 'Verify', icon: <ShieldCheck size={28} />, action: () => navigate('/identity-authentication') },
        { label: 'Support', icon: <Headset size={28} />, action: () => navigate('/settings') },
        { label: 'AI Financial', icon: <Bot size={28} />, action: () => {} },
    ];

    return (
        <div className="mx-4 p-4 bg-white dark:bg-slate-950 rounded-xl shadow-sm">
            <div className="grid grid-cols-3 gap-y-4">
                {actionItems.map(item => (
                    <button key={item.label} onClick={item.action} className="flex flex-col items-center justify-center space-y-2 hover:text-purple-500 transition-colors">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 text-purple-500">
                           {item.icon}
                        </div>
                        <span className="text-xs text-center">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

const QuickAccess = () => {
    const navigate = useNavigate();
    return(
        <div className="grid grid-cols-2 gap-4 mx-4">
            <button onClick={() => navigate('/wallet', { state: { view: 'deposit' } })} className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-between">
                <div>
                    <p className="font-bold text-lg">Deposit</p>
                    <p className="text-xs mt-1">Recharge</p>
                </div>
                <PlusCircle size={40} className="opacity-50"/>
            </button>
             <button onClick={() => navigate('/wallet', { state: { view: 'withdraw' } })} className="p-4 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 text-white flex items-center justify-between">
                <div>
                    <p className="font-bold text-lg">Withdraw</p>
                    <p className="text-xs mt-1">Click to withdraw</p>
                </div>
                <ArrowDownCircle size={40} className="opacity-50"/>
            </button>
        </div>
    );
};

const MarketTable = () => {
    const { data: coins, loading, error } = useMarketData(null, 30);
    const navigate = useNavigate();
    
    if (loading && !coins.length) {
        return <div className="text-center p-8"><Loader className="animate-spin inline-block"/></div>
    }
    
    if (error) {
        return <div className="text-center p-8 text-red-500">{error}</div>
    }

    return (
        <div className="mx-4 bg-white dark:bg-slate-950 rounded-xl shadow-sm">
            <div className="p-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <button className="text-lg font-bold text-purple-500 dark:text-purple-400">USDT</button>
                </div>
                 <button onClick={() => navigate('/markets')} className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    More <ChevronDown size={16} className="rotate-[-90deg]"/>
                </button>
            </div>
            
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 px-4 py-2 border-b border-gray-100 dark:border-zinc-800">
                <span style={{ flex: 1.5 }}>Name</span>
                <span className="flex-1">Latest price</span>
                <span className="flex-1 text-right">Rise/Fall</span>
            </div>
            
            <div>
                {coins.map(coin => (
                    <div key={coin.id} onClick={() => navigate(`/trading/${coin.symbol.toUpperCase()}-USDT`)} className="flex items-center p-4 border-b border-gray-100 dark:border-zinc-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer">
                        <div className="flex items-center" style={{ flex: 1.5 }}>
                            <img src={coin.image} alt={coin.name} className="w-8 h-8 mr-3 rounded-full"/>
                            <div>
                                <span className="font-bold text-base text-slate-900 dark:text-white">{coin.symbol.toUpperCase()}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">/USDT</span>
                            </div>
                        </div>
                        <div className="flex-1 text-base font-semibold">{coin.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</div>
                        <div className="flex-1 flex justify-end">
                            <div className={`w-24 h-9 flex justify-center items-center rounded-md text-center text-white font-bold text-sm ${coin.price_change_percentage_24h && coin.price_change_percentage_24h >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                                {coin.price_change_percentage_24h && coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const HomeScreen = () => {
    return (
        <div className="bg-gray-50 dark:bg-black text-slate-900 dark:text-white pt-16 animate-fade-in">
            <HomeHeader />
            <div className="space-y-6 pb-24">
                <PromoCarousel />
                <TickerCarousel />
                <ActionGrid />
                <QuickAccess />
                <MarketTable />
            </div>
        </div>
    );
};

export default HomeScreen;