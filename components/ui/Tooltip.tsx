import React, { useState } from 'react';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

const positionClasses: Record<NonNullable<TooltipProps['position']>, string> = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
};

export const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
    const [isVisible, setIsVisible] = useState(false);

    const currentPositionClass = positionClasses[position];

    return (
        <div
            className="relative flex items-center justify-center"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div className={`absolute z-50 px-2 py-1 text-[10px] font-medium text-white bg-black/80 backdrop-blur-sm border border-white/10 rounded whitespace-nowrap pointer-events-none ${currentPositionClass}`}>
                    {content}
                </div>
            )}
        </div>
    );
};
