import React, { memo } from 'react';

export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
}

export const ToggleSwitch = memo<ToggleSwitchProps>(({
  checked,
  onChange,
  label,
  className = '',
}) => {
  const handleClick = React.useCallback(() => {
    onChange(!checked);
  }, [checked, onChange]);

  return (
    <label className={`flex items-center justify-between cursor-pointer group ${className}`}>
      <span className="text-white/70 text-sm">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={handleClick}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
          checked ? 'bg-white/20' : 'bg-white/10'
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  );
});

ToggleSwitch.displayName = 'ToggleSwitch';

