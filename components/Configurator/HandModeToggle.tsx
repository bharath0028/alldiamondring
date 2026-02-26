import React from 'react';
import { Chip } from '../ui/Chip';

interface HandModeToggleProps {
    isActive: boolean;
    onToggle: (value: boolean) => void;
}

export const HandModeToggle: React.FC<HandModeToggleProps> = ({ isActive, onToggle }) => {
    return (
        <div
            className="w-full bg-white/5 rounded-2xl p-4 flex items-center gap-4 mb-6 cursor-pointer hover:bg-white/10 transition-colors border border-white/10"
            onClick={() => onToggle(!isActive)}
        >
            <div className="w-[20%] flex items-center justify-center text-3xl">
                👋
            </div>
            <div className="flex-1 flex flex-col">
                <span className="text-white font-medium text-sm tracking-wide">Try On Mode</span>
                <span className="text-white/40 text-xs mt-0.5">Visualize on hand</span>
            </div>
            <Chip isActive={isActive} />
        </div>
    );
};

