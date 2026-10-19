import React, { useState } from 'react';
import { 
  Camera, 
  BookOpen, 
  Scissors, 
  Users, 
  Church, 
  Compass, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  RefreshCw,
  Move,
  SlidersHorizontal
} from 'lucide-react';
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
  const { getPhoto, openUploadModal, removePhoto, openFocalAdjustModal } = usePhotos();
  const [fileLoadFailed, setFileLoadFailed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Check if user uploaded a photo via PhotoContext or have bundled fallback
  const uploaded = slotKey ? getPhoto(slotKey) : null;
  const validUploaded = uploaded?.url && uploaded.url.trim() !== '' ? uploaded.url : null;
  const validPropSrc = src && src.trim() !== '' && !fileLoadFailed ? src : null;

  // Category fallback to ensure every slot displays a real image when opened from GitHub
  const categoryDefault = 
    category === 'school' ? '/assets/schools/heritage-academy/morning-assembly.svg' :
    category === 'vocational' ? '/assets/vocational/tailoring.svg' :
    category === 'leadership' ? '/assets/church/fellowships/women-fellowship.svg' :
    category === 'outreach' ? '/assets/church/services/sunday-worship.svg' :
    '/assets/church/services/hero-church.svg';

  const activeSrc = validUploaded || validPropSrc || categoryDefault;

  const aspectClass = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    '3:2': 'aspect-[3/2]',
    '21:9': 'aspect-[21/9]',
  }[aspectRatio];

  const focalX = uploaded?.focalPoint?.x ?? 50;
  const focalY = uploaded?.focalPoint?.y ?? 50;
  const zoom = uploaded?.zoom ?? 1.0;

  // Render the image with object-position & scale transform so faces are centered!
  return (
    <div className={`relative group overflow-hidden rounded-xl bg-stone-900 ${aspectClass} ${className}`}>
      <img
        src={activeSrc}
        alt={uploaded?.alt || alt}
        referrerPolicy="no-referrer"
        onLoad={() => setImageLoaded(true)}
        onError={() => setFileLoadFailed(true)}
        className={`w-full h-full object-cover transition-all duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          objectPosition: `${focalX}% ${focalY}%`,
          transform: zoom !== 1 ? `scale(${zoom})` : undefined,
          transformOrigin: `${focalX}% ${focalY}%`,
        }}
      />
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-900 animate-pulse text-stone-500">
          <ImageIcon className="w-6 h-6" />
        </div>
      )}

      {/* Interactive Controls Overlay (Adjust Face / Drag, Replace, Delete) */}
      {slotKey && (
        <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          {/* Adjust Framing & Drag Face button */}
          <button
            type="button"
            onClick={() =>
              openFocalAdjustModal({
                type: 'slot',
                keyOrId: slotKey,
                url: activeSrc,
                title: label || alt,
                focalPoint: uploaded?.focalPoint || { x: 50, y: 50 },
                zoom: uploaded?.zoom || 1.0,
                aspectRatio,
              })
            }
            className="bg-black/80 hover:bg-black text-white text-[10px] font-semibold px-2 py-1 rounded backdrop-blur-xs flex items-center gap-1 shadow-sm border border-white/20"
            title="Adjust photo framing and drag to position face"
          >
            <Move className="w-3 h-3 text-amber-300" />
            <span>Fit Box</span>
          </button>

          {/* Replace Photo button */}
          <button
            type="button"
            onClick={() => openUploadModal(slotKey, label || alt)}
            className="bg-emerald-800/90 hover:bg-emerald-800 text-white text-[10px] font-semibold px-2 py-1 rounded backdrop-blur-xs flex items-center gap-1 shadow-sm"
            title="Upload or replace photo"
          >
            <RefreshCw className="w-3 h-3 text-lime-300" />
            <span>Replace</span>
          </button>

          {/* Delete custom photo button if uploaded */}
          {uploaded && (
            <button
              type="button"
              onClick={() => {
                if (confirm(`Remove custom photo and reset to default?`)) {
                  removePhoto(slotKey);
                }
              }}
              className="bg-rose-700/80 hover:bg-rose-700 text-white text-[10px] font-semibold p-1 rounded backdrop-blur-xs shadow-sm"
              title="Reset photo"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Subtle indicator of current framing if adjusted */}
      {(focalX !== 50 || focalY !== 50 || zoom !== 1) && (
        <div className="absolute bottom-1.5 left-1.5 bg-black/60 text-[9px] text-amber-300 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Framed: {focalX}%, {focalY}%
        </div>
      )}
    </div>
  );
};

export default PlaceholderImage;
