import React, { useState, useEffect } from 'react';

export const RingLoader: React.FC = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((p) => {
                // Slow down at higher percentages for realistic loading feel
                if (p >= 90) return p + Math.random() * 1;
                if (p >= 70) return p + Math.random() * 4;
                if (p >= 40) return p + Math.random() * 8;
                return p + Math.random() * 15;
            });
        }, 300);

        return () => clearInterval(interval);
    }, []);
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
            <div className="relative flex flex-col items-center justify-center gap-6">
                {/* Main Diamond Shape */}
                <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 border-3 border-blue-600/30 shadow-[0_0_20px_rgba(37,99,235,0.2)] animate-spin-slow box-border rounded-lg" style={{borderRadius: '50%'}}></div>
                    
                    {/* Inner Diamond */}
                    <div className="absolute w-10 h-10 border-2 border-blue-600/60 animate-spin-reverse box-border" style={{borderRadius: '50%'}}></div>
                    
                    {/* Center Sparkle */}
                    <div className="absolute w-2 h-2 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.8)]"></div>
                </div>

                {/* Loading Text */}
                <div className="text-center">
                    <p className="text-sm font-semibold text-gray-700">Loading...</p>
                    <p className="text-xl font-bold text-blue-600 mt-1">{Math.min(Math.floor(progress), 99)}%</p>
                    
                    {/* Progress Bar */}
                    <div className="mt-4 w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-blue-600 transition-all duration-300 ease-out rounded-full"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                    </div>
                    
                    <div className="flex gap-1 mt-3 justify-center">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></span>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes spin-slow {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes spin-reverse {
                    0% { transform: rotate(360deg); }
                    100% { transform: rotate(0deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 2s linear infinite;
                }
                .animate-spin-reverse {
                    animation: spin-reverse 3s linear infinite;
                }
            `}</style>
        </div>
    );
};