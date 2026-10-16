import React from 'react';

interface VRAILogoProps {
  size?: number | string;
  className?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
}

export const VRAILogo: React.FC<VRAILogoProps> = ({
  size = 48,
  className = '',
  showWordmark = false,
  wordmarkClassName = '',
}) => {
  return (
    <div className={`flex items-center gap-3 shrink-0 ${className}`}>
      <img
        src="/vrai-logo.svg"
        alt="Victorious Royal Assembly International (VRAI) Seal"
        width={typeof size === 'number' ? size : undefined}
        height={typeof size === 'number' ? size : undefined}
        style={{
          width: typeof size === 'number' ? `${size}px` : size,
          height: typeof size === 'number' ? `${size}px` : size,
        }}
        className="shrink-0 drop-shadow-sm select-none"
        loading="eager"
      />
      {showWordmark && (
        <div className={`flex flex-col text-left leading-tight ${wordmarkClassName}`}>
          <span className="font-bold tracking-tight text-slate-900 text-sm sm:text-base font-heading">
            Victorious Royal Assembly
          </span>
          <span className="text-[11px] sm:text-xs text-emerald-800 font-semibold tracking-wide">
            International · Juba, South Sudan
          </span>
        </div>
      )}
    </div>
  );
};

export default VRAILogo;
