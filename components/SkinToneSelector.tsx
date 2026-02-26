import React from 'react';
import { SkinTone } from '../types/index';
import { SKIN_TONE_COLORS } from '../constants/optionConfig';

interface SkinToneSelectorProps {
    selectedTone: SkinTone;
    onSelect: (tone: SkinTone) => void;
}

export const SkinToneSelector: React.FC<SkinToneSelectorProps> = ({ selectedTone, onSelect }) => {
    return (
        <div className="absolute top-6 left-6 md:left-[344px] z-10 flex gap-3 p-2 rounded-full bg-black/10 backdrop-blur-sm border border-white/5">
            {Object.entries(SKIN_TONE_COLORS).map(([tone, color]) => (
                <button
                    key={tone}
                    onClick={() => onSelect(tone as SkinTone)}
                    className={`w-8 h-8 rounded-full border transition-all duration-300 shadow-lg ${selectedTone === tone
                        ? 'border-white scale-110 ring-2 ring-white/20'
                        : 'border-white/20 hover:scale-105'
                        }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select ${tone} skin tone`}
                />
            ))}
        </div>
    );
};
