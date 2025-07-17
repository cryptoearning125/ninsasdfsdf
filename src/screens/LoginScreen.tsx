import * as React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import { Loader, AlertCircle, Eye, EyeOff } from 'lucide-react';

const LoginScreen = () => {
    const { login, isLoading, isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('demo@cryptopulse.com');
    const [password, setPassword] = React.useState('demo123');
    const [showPassword, setShowPassword] = React.useState(false);
    const [error, setError] = React.useState<string>('');
    
    React.useEffect(() => {
        if(isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-4 flex flex-col justify-center animate-fade-in">
            <div className="max-w-md mx-auto w-full space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Welcome Back</h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Login to access your CryptoPulse account.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-500/10 text-red-500 text-sm p-3 rounded-lg flex items-center gap-2">
                            <AlertCircle size={16}/> {error}
                        </div>
                    )}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required 
                        className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"/>
                    </div>
                    <div className="space-y-1 relative">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                        className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"/>
                         <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-500 dark:text-gray-400">
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                         </button>
                    </div>
                    <button type="submit" disabled={isLoading}
                        className="w-full py-3 rounded-lg font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:bg-slate-500 transition flex justify-center items-center">
                        {isLoading ? <Loader className="animate-spin" /> : 'Login'}
                    </button>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Don't have an account?{' '}
                        <NavLink to="/register" className="font-semibold text-purple-500 hover:underline">Register here</NavLink>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginScreen;