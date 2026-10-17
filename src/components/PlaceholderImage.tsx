import React, { useState } from 'react';
import { Camera, BookOpen, Scissors, Users, Church, Compass, Upload, Image as ImageIcon, Trash2, RefreshCw } from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';

interface PlaceholderImageProps {
  slotKey?: string;
  src?: string;
  alt: string;
  label?: string;
  recommendedPath?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:2' | '21:9';
  category?: 'school' | 'vocational' | 'church' | 'leadership' | 'outreach' | 'general';
  className?: string;
  onOpenAssetGuide?: () => void;
}

export const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  slotKey,
  src,
  alt,
  label,
  recommendedPath,
  aspectRatio = '16:9',
  category = 'general',
  className = '',
  onOpenAssetGuide,
}) => {
  const { getPhoto, openUploadModal, removePhoto } = usePhotos();
  const [fileLoadFailed, setFileLoadFailed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Check if user uploaded a photo via PhotoContext
  const uploaded = slotKey ? getPhoto(slotKey) : null;
  const activeSrc = uploaded?.url || (fileLoadFailed ? null : src);

  const aspectClass = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    '3:2': 'aspect-[3/2]',
    '21:9': 'aspect-[21/9]',
  }[aspectRatio];

  const getCategoryIcon = () => {
    switch (category) {
      case 'school':
        return <BookOpen className="w-7 h-7 text-emerald-800" />;
      case 'vocational':
        return <Scissors className="w-7 h-7 text-emerald-800" />;
      case 'church':
        return <Church className="w-7 h-7 text-emerald-800" />;
      case 'leadership':
      case 'outreach':
        return <Users className="w-7 h-7 text-emerald-800" />;
      default:
        return <ImageIcon className="w-7 h-7 text-emerald-800" />;
    }
  };

  // If we have an active image source (either from upload or working file)
  if (activeSrc) {
    return (
      <div className={`relative group overflow-hidden rounded-lg bg-stone-100 ${aspectClass} ${className}`}>
        <img
          src={activeSrc}
          alt={uploaded?.alt || alt}
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          onError={() => setFileLoadFailed(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-100 animate-pulse text-stone-400">
            <ImageIcon className="w-6 h-6" />
          </div>
        )}

        {/* Replace & Delete Photo Overlay buttons for custom uploaded image */}
        {slotKey && (
          <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => openUploadModal(slotKey, label || alt)}
              className="bg-black/70 hover:bg-black/90 text-white text-[10px] font-semibold px-2 py-1 rounded backdrop-blur-xs flex items-center gap-1 shadow-sm"
              title="Replace this photo"
            >
              <RefreshCw className="w-3 h-3 text-emerald-300" />
              <span>Replace</span>
            </button>

            {uploaded && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Remove custom photo and reset to default placeholder?`)) {
                    removePhoto(slotKey);
                  }
                }}
                className="bg-rose-700/80 hover:bg-rose-700 text-white text-[10px] font-semibold p-1 rounded backdrop-blur-xs shadow-sm"
                title="Delete photo (reset to placeholder)"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // Elegant Brand-Aligned Placeholder (Lime green, deep forest green, white, subtle red accent)
  // Per strict prompt: Clearly marked as "Upload real church photograph here. Do not display fake photographs."
  return (
    <div
      className={`relative group overflow-hidden rounded-xl border border-stone-200 bg-gradient-to-br from-stone-50 via-emerald-50/20 to-stone-100 flex flex-col items-center justify-center text-center p-6 transition-all hover:border-emerald-600 ${aspectClass} ${className}`}
    >
      {/* Subtle brand geometry pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#15803d 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-sm px-4">
        {/* Brand Icon Token */}
        <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-emerald-100 flex items-center justify-center mb-2.5">
          {getCategoryIcon()}
        </div>

        {/* Development Environment Notice */}
        <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full mb-1.5">
          <Camera className="w-3 h-3 text-emerald-700" />
          <span>Upload real church photograph here</span>
        </div>

        <p className="text-xs font-semibold text-slate-900 mb-1 leading-snug">
          {label || alt}
        </p>

        <p className="text-[11px] text-stone-500 leading-tight mb-3">
          Slot reserved for authentic photo · Zero AI / Zero stock
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {slotKey && (
            <button
              type="button"
              onClick={() => openUploadModal(slotKey, label || alt)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-md transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Choose &amp; Upload Photo</span>
            </button>
          )}

          {onOpenAssetGuide && (
            <button
              type="button"
              onClick={onOpenAssetGuide}
              className="px-2.5 py-1.5 text-[11px] font-medium text-stone-600 hover:text-stone-900 bg-white border border-stone-200 rounded-md transition-colors flex items-center gap-1"
            >
              <Compass className="w-3 h-3 text-emerald-700" />
              <span>Asset Guide</span>
            </button>
          )}
        </div>

        {recommendedPath && (
          <code className="text-[9.5px] font-mono text-stone-600 mt-3 select-all bg-stone-100 px-1.5 py-0.5 rounded">
            {recommendedPath}
          </code>
        )}
      </div>
    </div>
  );
};

export default PlaceholderImage;
