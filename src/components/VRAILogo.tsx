import React from 'react';
import { usePhotos } from '../context/PhotoContext';

interface VRAILogoProps {
  size?: number | string;
  className?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
  customSrc?: string;
}

export const VRAILogo: React.FC<VRAILogoProps> = ({
  size = 48,
  className = '',
  showWordmark = false,
  wordmarkClassName = '',
  customSrc,
}) => {
  let churchLogo = '/uploads/church-logo.jpg';
  try {
    const photoCtx = usePhotos();
    if (photoCtx?.churchLogoUrl) {
      churchLogo = photoCtx.churchLogoUrl;
    }
  } catch {}

  const logoSrc = customSrc || churchLogo;

  return (
    <div className={`flex items-center gap-3 shrink-0 ${className}`}>
      <img
        src={logoSrc}
        alt="Victorious Royal Assembly International (VRAI) Seal"
        width={typeof size === 'number' ? size : undefined}
        height={typeof size === 'number' ? size : undefined}
        style={{
          width: typeof size === 'number' ? `${size}px` : size,
          height: typeof size === 'number' ? `${size}px` : size,
        }}
        className="shrink-0 drop-shadow-sm select-none object-contain"
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
