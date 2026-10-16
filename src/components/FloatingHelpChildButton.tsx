import React, { useState, useEffect } from 'react';
import { Heart, X } from 'lucide-react';

interface FloatingHelpChildButtonProps {
  onClick: () => void;
}

export const FloatingHelpChildButton: React.FC<FloatingHelpChildButtonProps> = ({
  onClick,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center group">
      <button
        onClick={onClick}
        aria-label="Help a Child Today - Sponsor a pupil at Victorious Heritage Model Academy"
        className="px-4 py-2.5 bg-[#D4A353] hover:bg-[#C69342] active:bg-[#B58231] text-slate-950 font-extrabold text-xs sm:text-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 border border-amber-200/50 hover:scale-105 active:scale-95 group"
      >
        <span className="text-sm">💚</span>
        <span className="tracking-tight font-heading">Help a Child Today</span>
      </button>
    </div>
  );
};
