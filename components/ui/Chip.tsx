import React from 'react';

interface ChipProps {
    isActive: boolean;
    className?: string;
}

export const Chip: React.FC<ChipProps> = ({ isActive, className = '' }) => {
    return (
        <div
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0 
                ${isActive ? 'bg-blue-500' : 'bg-white/10'
                } ${className}`}
        >
                {/* sliding background */}
                <div
                    className={`absolute top-0 left-0 w-6 h-full rounded-full bg-blue-500 transition-transform duration-350 ease-in-out transform-gpu will-change-transform ${isActive ? 'translate-x-6' : 'translate-x-0'}`}
                />

                {/* knob */}
                <div className={`relative z-10 w-full h-full flex items-center px-1`}>
                    <span
                        className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-350 ease-in-out transform-gpu will-change-transform ${isActive ? 'translate-x-6' : 'translate-x-0'}`}
                    />
                </div>
        </div>
    );
};
