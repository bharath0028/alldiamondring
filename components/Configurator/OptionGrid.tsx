import React, { memo, useCallback, useMemo, useState, useEffect } from 'react';
import { OptionItem } from './OptionItem';

export type OptionType = 'option' | 'toggle';

export interface OptionItemData<T> {
    value: T;
    label: string;
    type?: OptionType;
    previewColor?: string;
    previewGradient?: string;
    previewImage?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    useBlackBackground?: boolean;
    imageOnly?: boolean;
}

interface OptionGridProps<T extends string> {
    title: string;
    options: ReadonlyArray<OptionItemData<T>>;
    selectedValue: T | boolean;
    onSelect: (value: T | boolean) => void;
}

const GRID_CONTAINER_CLASSES = "w-full mb-6";
const TITLE_CLASSES = "text-neutral-400 text-[10px] uppercase tracking-widest font-bold mb-3 px-1";
const GRID_CLASSES = "grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-1.5";
const LIST_CLASSES = "space-y-2";

// Mobile horizontal swiper classes
const MOBILE_CONTAINER = "flex gap-3 overflow-x-auto py-2 -mx-4 px-4 snap-x snap-mandatory touch-pan-y";
const MOBILE_ITEM_WRAPPER = "flex-shrink-0 w-20 snap-center";

export const OptionGrid = memo(<T extends string>({
    title,
    options,
    selectedValue,
    onSelect
}: OptionGridProps<T>) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mq = typeof window !== 'undefined' ? window.matchMedia('(max-width: 640px)') : null;
        const handler = (ev: MediaQueryListEvent) => setIsMobile(ev.matches);
        if (mq) {
            setIsMobile(mq.matches);
            // modern API
            if (mq.addEventListener) mq.addEventListener('change', handler);
            else mq.addListener(handler as any);
        }
        return () => {
            if (mq) {
                if (mq.removeEventListener) mq.removeEventListener('change', handler);
                else mq.removeListener(handler as any);
            }
        };
    }, []);
    const createClickHandler = useCallback((value: T) => {
        return () => onSelect(value);
    }, [onSelect]);

    const hasToggleOptions = useMemo(() => {
        return options.some(opt => opt.type === 'toggle');
    }, [options]);

    const optionItems = useMemo(() => {
        return options.map((option) => {
            if (option.type === 'toggle') {
                const isActive = typeof selectedValue === 'boolean' ? selectedValue : false;
                return (
                    <OptionItem
                        key={option.value}
                        value={option.value}
                        label={option.label}
                        isActive={isActive}
                        onClick={() => onSelect(!isActive)}
                        type="toggle"
                    />
                );
            }

            const isActive = selectedValue === option.value;
            return (
                <OptionItem
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    isActive={isActive}
                    onClick={createClickHandler(option.value)}
                    previewColor={option.previewColor}
                    previewGradient={option.previewGradient}
                    previewImage={option.previewImage}
                    icon={option.icon}
                    disabled={option.disabled}
                    useBlackBackground={option.useBlackBackground}
                    imageOnly={option.imageOnly}
                />
            );
        });
    }, [options, selectedValue, createClickHandler, onSelect]);

    return (
        <div className={GRID_CONTAINER_CLASSES}>
            <h3 className={TITLE_CLASSES}>
                {title}
            </h3>
            {isMobile ? (
                <div className={MOBILE_CONTAINER}>
                    {optionItems.map((item, idx) => (
                        <div className={MOBILE_ITEM_WRAPPER} key={`${title}-mobile-${idx}`}>
                            {item}
                        </div>
                    ))}
                </div>
            ) : (
                <div className={hasToggleOptions ? LIST_CLASSES : GRID_CLASSES}>
                    {optionItems}
                </div>
            )}
        </div>
    );
}, (prevProps, nextProps) => {
    if (
        prevProps.title !== nextProps.title ||
        prevProps.selectedValue !== nextProps.selectedValue ||
        prevProps.options.length !== nextProps.options.length ||
        prevProps.onSelect !== nextProps.onSelect
    ) {
        return false;
    }

    return prevProps.options.every((prevOption, index) => {
        const nextOption = nextProps.options[index];
        return (
            prevOption.value === nextOption.value &&
            prevOption.label === nextOption.label &&
            prevOption.type === nextOption.type &&
            prevOption.previewColor === nextOption.previewColor &&
            prevOption.previewGradient === nextOption.previewGradient &&
            prevOption.previewImage === nextOption.previewImage &&
            prevOption.disabled === nextOption.disabled
        );
    });
}) as typeof OptionGrid & { displayName: string };

(OptionGrid as any).displayName = 'OptionGrid';

