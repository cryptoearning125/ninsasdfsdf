import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Cpu, Users, Zap } from 'lucide-react';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center text-purple-500 dark:text-purple-400 mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{description}</p>
    </div>
);

const TeamMember = ({ name, role, photoUrl }: { name: string, role: string, photoUrl: string }) => (
    <div className="flex flex-col items-center space-y-2">
        <img src={photoUrl} alt={name} className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-slate-700"/>
        <h4 className="font-bold text-slate-900 dark:text-white">{name}</h4>
        <p className="text-sm text-purple-500 dark:text-purple-400">{role}</p>
    </div>
);

const AboutScreen = () => {
    const navigate = useNavigate();

    return (
        <div className="animate-fade-in bg-gray-50 dark:bg-black min-h-screen text-slate-900 dark:text-white">
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-zinc-800">
                <div className="flex items-center justify-between h-16 px-4 max-w-screen-lg mx-auto">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-lg font-bold">About Us</h1>
                    <div className="w-10"></div>
                </div>
            </header>

            <main className="p-4 md:p-8 max-w-screen-lg mx-auto space-y-12 pb-24">
                <section className="text-center">
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Welcome to CryptoPulse</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Your gateway to the future of digital finance. We provide a powerful, secure, and intuitive platform for trading cryptocurrencies, designed for both novice and expert traders.
                    </p>
                </section>

                <section>
                    <h3 className="text-2xl font-bold text-center mb-8">Our Mission</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-center max-w-3xl mx-auto">
                        To democratize access to the cryptocurrency markets by offering a comprehensive suite of tools, unparalleled security, and world-class customer support. We believe everyone deserves the opportunity to participate in the global digital economy.
                    </p>
                </section>

                <section>
                    <h3 className="text-2xl font-bold text-center mb-8">Why Choose CryptoPulse?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard 
                            icon={<Zap size={32} />}
                            title="Blazing-Fast Trades"
                            description="Our high-performance matching engine executes trades in microseconds, ensuring you never miss a market opportunity."
                        />
                        <FeatureCard 
                            icon={<ShieldCheck size={32} />}
                            title="Fort-Knox Security"
                            description="We employ multi-layered security protocols, including cold storage and advanced encryption, to keep your assets safe."
                        />
                        <FeatureCard 
                            icon={<Cpu size={32} />}
                            title="Advanced Technology"
                            description="Leverage our cutting-edge AI analytics, sophisticated charting tools, and automated trading bots to enhance your strategy."
                        />
                    </div>
                </section>

                <section>
                    <h3 className="text-2xl font-bold text-center mb-8">Meet Our Team</h3>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <TeamMember name="Alex Johnson" role="Founder & CEO" photoUrl="https://i.pravatar.cc/150?u=alex" />
                        <TeamMember name="Maria Garcia" role="Chief Technology Officer" photoUrl="https://i.pravatar.cc/150?u=maria" />
                        <TeamMember name="Chen Wei" role="Head of Trading" photoUrl="https://i.pravatar.cc/150?u=chen" />
                        <TeamMember name="Priya Sharma" role="Lead Security Engineer" photoUrl="https://i.pravatar.cc/150?u=priya" />
                    </div>
                </section>

                <footer className="text-center pt-8 border-t border-gray-200 dark:border-zinc-800">
                    <p className="text-gray-500 dark:text-gray-400">© 2025 CryptoPulse Trading. All Rights Reserved.</p>
                </footer>
            </main>
        </div>
    );
};

export default AboutScreen;