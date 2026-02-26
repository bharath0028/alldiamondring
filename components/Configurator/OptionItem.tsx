import React, { memo, useMemo } from 'react';
import { Tooltip } from '../ui/Tooltip';
import { Chip } from '../ui/Chip';
import { OptionType } from './OptionGrid';

export interface OptionItemProps<T extends string> {
    value: T;
    label: string;
    isActive: boolean;
    onClick: () => void;
    type?: OptionType;
    previewColor?: string;
    previewGradient?: string;
    previewImage?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    useBlackBackground?: boolean;
    imageOnly?: boolean;
}

const BUTTON_BASE_CLASSES = "relative group flex items-center justify-center w-full aspect-square rounded-xl transition-all duration-300 border";
const BUTTON_ACTIVE_CLASSES = "bg-white border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]";
const BUTTON_INACTIVE_CLASSES = "bg-white border-gray-200 hover:bg-white/90 hover:border-gray-300";
const BUTTON_DISABLED_CLASSES = "bg-white/30 border-gray-200 opacity-40 cursor-not-allowed";
const BUTTON_BLACK_ACTIVE_CLASSES = "bg-white border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]";
const BUTTON_BLACK_INACTIVE_CLASSES = "bg-white border-gray-200 hover:bg-white/90 hover:border-gray-300";
const BUTTON_BLACK_DISABLED_CLASSES = "bg-white/30 border-gray-200 opacity-60 cursor-not-allowed";
const IMAGE_BASE_CLASSES = "w-10 h-10 transition-transform duration-300";
const IMAGE_ROUND_CLASSES = "w-12 h-12 rounded-full transition-transform duration-300";
const IMAGE_ROUND_SMALL = "w-9 h-9 object-fill rounded-full transition-transform duration-300";
const BUTTON_IMAGE_BASE = "relative group flex items-center justify-center w-full aspect-square transition-all duration-300";
const BUTTON_IMAGE_INACTIVE = "bg-transparent border-none p-0";
const BUTTON_IMAGE_ACTIVE = "bg-transparent border-none p-0 rounded-full";
const BUTTON_IMAGE_DISABLED = "bg-transparent border-none p-0 opacity-40 cursor-not-allowed";
const ICON_BASE_CLASSES = "transition-transform duration-300";
const CIRCLE_BASE_CLASSES = "w-8 h-8 rounded-full shadow-lg transition-transform duration-300";
const SCALE_ACTIVE = "scale-110";
const SCALE_HOVER = "group-hover:scale-105";

const TOGGLE_CONTAINER_CLASSES = "flex items-center justify-between cursor-pointer group w-full";
const TOGGLE_LABEL_CLASSES = "text-white/70 text-sm";

export const OptionItem = memo(<T extends string>({
    value,
    label,
    isActive,
    onClick,
    type,
    previewColor,
    previewGradient,
    previewImage,
    icon,
    disabled,
    useBlackBackground,
    imageOnly
}: OptionItemProps<T>) => {
    if (type === 'toggle') {
        return (
            <label className={TOGGLE_CONTAINER_CLASSES}>
                <span className={TOGGLE_LABEL_CLASSES}>{label}</span>
                <button
                    type="button"
                    role="switch"
                    aria-checked={isActive}
                    aria-label={label}
                    onClick={onClick}
                >
                    <Chip isActive={isActive} />
                </button>
            </label>
        );
    }

    const buttonClasses = useMemo(() => {
        if (imageOnly) {
            if (disabled) return `${BUTTON_IMAGE_BASE} ${BUTTON_IMAGE_DISABLED}`;
            return `${BUTTON_IMAGE_BASE} ${isActive ? BUTTON_IMAGE_ACTIVE : BUTTON_IMAGE_INACTIVE}`;
        }

        if (disabled) {
            return `${BUTTON_BASE_CLASSES} ${useBlackBackground ? BUTTON_BLACK_DISABLED_CLASSES : BUTTON_DISABLED_CLASSES}`;
        }

        if (useBlackBackground) {
            return `${BUTTON_BASE_CLASSES} ${isActive ? BUTTON_BLACK_ACTIVE_CLASSES : BUTTON_BLACK_INACTIVE_CLASSES}`;
        }

        return `${BUTTON_BASE_CLASSES} ${isActive ? BUTTON_ACTIVE_CLASSES : BUTTON_INACTIVE_CLASSES}`;
    }, [isActive, disabled, useBlackBackground, imageOnly]);


    return (
        <Tooltip content={label}>
            <button
                type="button"
                aria-label={label}
                aria-pressed={isActive}
                onClick={disabled ? undefined : onClick}
                disabled={disabled}
                className={buttonClasses}
            >
                {previewImage ? (
                    imageOnly ? (
                        <img
                            src={previewImage}
                            alt={label}
                            className={`${imageOnly ? IMAGE_ROUND_SMALL : IMAGE_ROUND_CLASSES} ${isActive ? 'ring-2 ring-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.35)]' : ''} ${isActive ? SCALE_ACTIVE : ''} ${SCALE_HOVER}`}
                            draggable={false}
                        />
                    ) : (
                        <img src={previewImage} alt={label} className={`${IMAGE_BASE_CLASSES} ${isActive ? SCALE_ACTIVE : ''} ${SCALE_HOVER}`} draggable={false} />
                    )
                ) : previewGradient ? (
                    <span
                        className={`${CIRCLE_BASE_CLASSES} ${isActive ? SCALE_ACTIVE : ''} ${SCALE_HOVER}`}
                        style={{ background: previewGradient }}
                    />
                ) : previewColor ? (
                    <span
                        className={`${CIRCLE_BASE_CLASSES} ${isActive ? SCALE_ACTIVE : ''} ${SCALE_HOVER}`}
                        style={{ background: previewColor }}
                    />
                ) : (
                    <span style={{ color: isActive ? '#fff' : '#aaa', fontWeight: isActive ? 600 : 400, fontSize: 14 }}>{label}</span>
                )}
            </button>
        </Tooltip>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.value === nextProps.value &&
        prevProps.label === nextProps.label &&
        prevProps.isActive === nextProps.isActive &&
        prevProps.type === nextProps.type &&
        prevProps.previewColor === nextProps.previewColor &&
        prevProps.previewGradient === nextProps.previewGradient &&
        prevProps.previewImage === nextProps.previewImage &&
        prevProps.disabled === nextProps.disabled &&
        prevProps.useBlackBackground === nextProps.useBlackBackground &&
        prevProps.imageOnly === nextProps.imageOnly &&
        prevProps.onClick === nextProps.onClick
    );
}) as typeof OptionItem & { displayName: string };

(OptionItem as any).displayName = 'OptionItem';


