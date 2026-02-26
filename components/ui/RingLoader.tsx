import React from 'react';

export const RingLoader: React.FC = () => {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
            <div className="relative flex items-center justify-center">
                {/* Main Diamond Shape */}
                <div className="w-12 h-12 border-2 border-white/90 shadow-[0_0_15px_rgba(255,255,255,0.4)] animate-spin-slow box-border"></div>
                
                {/* Inner Diamond */}
                <div className="absolute w-8 h-8 border border-white/50 animate-spin-reverse box-border"></div>
                
                {/* Center Sparkle */}
                <div className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)] animate-pulse"></div>
            </div>
            <style>{`
                @keyframes spin-slow {
                    0% { transform: rotate(45deg); }
                    100% { transform: rotate(405deg); }
                }
                @keyframes spin-reverse {
                    0% { transform: rotate(45deg); }
                    100% { transform: rotate(-315deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 3s linear infinite;
                }
                .animate-spin-reverse {
                    animation: spin-reverse 4s linear infinite;
                }
            `}</style>
        </div>
    );
};