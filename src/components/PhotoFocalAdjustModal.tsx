import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, 
  Move, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Check, 
  SlidersHorizontal, 
  UserCheck, 
  Maximize2,
  Sparkles,
  Info
} from 'lucide-react';

export interface FocalPoint {
  x: number; // 0% to 100%
  y: number; // 0% to 100%
}

interface PhotoFocalAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  initialFocalPoint?: FocalPoint;
  initialZoom?: number;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:2' | '21:9';
  onSave: (focalPoint: FocalPoint, zoom: number) => void;
}

export const PhotoFocalAdjustModal: React.FC<PhotoFocalAdjustModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  initialFocalPoint = { x: 50, y: 50 },
  initialZoom = 1.0,
  aspectRatio = '4:3',
  onSave,
}) => {
  const [focalX, setFocalX] = useState<number>(initialFocalPoint.x ?? 50);
  const [focalY, setFocalY] = useState<number>(initialFocalPoint.y ?? 50);
  const [zoom, setZoom] = useState<number>(initialZoom ?? 1.0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state when modal opens or initial values change
  useEffect(() => {
    if (isOpen) {
      setFocalX(initialFocalPoint.x ?? 50);
      setFocalY(initialFocalPoint.y ?? 50);
      setZoom(initialZoom ?? 1.0);
      setIsDragging(false);
    }
  }, [isOpen, initialFocalPoint.x, initialFocalPoint.y, initialZoom]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updateFromPointer(e);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateFromPointer(e);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  const updateFromPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = Math.max(rect.left, Math.min(e.clientX, rect.right));
    const clientY = Math.max(rect.top, Math.min(e.clientY, rect.bottom));
    
    const pctX = Math.round(((clientX - rect.left) / rect.width) * 100);
    const pctY = Math.round(((clientY - rect.top) / rect.height) * 100);

    setFocalX(Math.max(0, Math.min(100, pctX)));
    setFocalY(Math.max(0, Math.min(100, pctY)));
  };

  const handleApplyPreset = (x: number, y: number, presetZoom?: number) => {
    setFocalX(x);
    setFocalY(y);
    if (presetZoom) setZoom(presetZoom);
  };

  const handleReset = () => {
    setFocalX(50);
    setFocalY(50);
    setZoom(1.0);
  };

  const handleSave = () => {
    onSave({ x: focalX, y: focalY }, zoom);
    onClose();
  };

  if (!isOpen) return null;

  const aspectClass = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    '3:2': 'aspect-[3/2]',
    '21:9': 'aspect-[21/9]',
  }[aspectRatio];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 via-stone-900 to-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-400/20 border border-lime-400/40 flex items-center justify-center text-lime-300">
              <Move className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white font-heading">
                Adjust Photo Framing &amp; Face Position
              </h3>
              <p className="text-xs text-stone-300 line-clamp-1">
                Drag to center the person's face inside the card box · {title}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Instructions banner */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Drag anywhere on the photo to position the face squarely in view.</p>
              <p className="text-emerald-800 text-[11px] mt-0.5">
                Use the crosshair and zoom slider to ensure faces are clearly traceable and never cut off by the frame borders.
              </p>
            </div>
          </div>

          {/* Interactive Drag & Framing Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Viewport Box (Interactive drag surface) */}
            <div className="md:col-span-8 flex flex-col items-center">
              <div className="w-full text-center mb-1.5 flex items-center justify-between text-xs font-semibold text-stone-600 px-1">
                <span className="flex items-center gap-1 text-emerald-800">
                  <Move className="w-3.5 h-3.5" />
                  <span>Click &amp; Drag inside box to reposition</span>
                </span>
                <span className="font-mono text-[11px] bg-stone-100 px-2 py-0.5 rounded text-stone-700 border border-stone-200">
                  Focus: X {focalX}% · Y {focalY}% · Zoom {zoom}x
                </span>
              </div>

              <div 
                ref={containerRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className={`relative w-full ${aspectClass} max-h-[380px] bg-stone-900 rounded-xl overflow-hidden cursor-crosshair border-2 ${
                  isDragging ? 'border-amber-400 shadow-lg' : 'border-emerald-600 shadow-md'
                } select-none touch-none`}
              >
                {/* The Photo with live object-position & zoom transform */}
                <img
                  src={imageUrl}
                  alt={title}
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none transition-all duration-75"
                  style={{
                    objectPosition: `${focalX}% ${focalY}%`,
                    transform: `scale(${zoom})`,
                    transformOrigin: `${focalX}% ${focalY}%`,
                  }}
                />

                {/* Thirds Grid Guidelines */}
                <div className="absolute inset-0 pointer-events-none border border-white/20">
                  <div className="absolute top-1/3 left-0 right-0 h-px bg-white/20 border-t border-dashed border-white/30" />
                  <div className="absolute top-2/3 left-0 right-0 h-px bg-white/20 border-t border-dashed border-white/30" />
                  <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/20 border-l border-dashed border-white/30" />
                  <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/20 border-l border-dashed border-white/30" />
                </div>

                {/* Interactive Focal Crosshair Indicator */}
                <div 
                  className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
                  style={{ left: `${focalX}%`, top: `${focalY}%` }}
                >
                  <div className="w-10 h-10 rounded-full border-2 border-amber-400 bg-amber-400/20 backdrop-blur-2xs flex items-center justify-center shadow-md animate-pulse">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-xs" />
                  </div>
                  <div className="absolute top-1/2 -left-3 w-3 h-0.5 bg-amber-400" />
                  <div className="absolute top-1/2 -right-3 w-3 h-0.5 bg-amber-400" />
                  <div className="absolute left-1/2 -top-3 w-0.5 h-3 bg-amber-400" />
                  <div className="absolute left-1/2 -bottom-3 w-0.5 h-3 bg-amber-400" />
                </div>

                {/* Drag status pill */}
                <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-lime-400" />
                  <span>Face Centering Box</span>
                </div>
              </div>
            </div>

            {/* Quick Presets & Zoom Controls */}
            <div className="md:col-span-4 space-y-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
              <div>
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <ZoomIn className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Zoom Level ({zoom.toFixed(2)}x)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoom(1.0)}
                    className="text-[10px] text-stone-500 hover:text-emerald-800 font-semibold"
                  >
                    Reset Zoom
                  </button>
                </label>
                <div className="flex items-center gap-2">
                  <ZoomOut className="w-4 h-4 text-stone-400 shrink-0" />
                  <input
                    type="range"
                    min="1"
                    max="2.5"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full accent-emerald-800 cursor-pointer h-2 bg-stone-200 rounded-lg"
                  />
                  <ZoomIn className="w-4 h-4 text-emerald-800 shrink-0" />
                </div>
                <div className="flex gap-1.5 mt-2">
                  {[1.0, 1.25, 1.5, 2.0].map((z) => (
                    <button
                      key={z}
                      type="button"
                      onClick={() => setZoom(z)}
                      className={`flex-1 text-[10px] py-1 rounded font-bold transition-all ${
                        Math.abs(zoom - z) < 0.04 
                          ? 'bg-emerald-800 text-white shadow-2xs' 
                          : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {z}x
                    </button>
                  ))}
                </div>
              </div>

              {/* One-Click Presets for Face Alignment */}
              <div className="pt-2 border-t border-stone-200">
                <p className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>One-Click Face Presets:</span>
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleApplyPreset(50, 20, 1.15)}
                    className="px-2.5 py-1.5 text-left bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-stone-200 rounded-lg text-[11px] font-semibold text-stone-800 transition-colors"
                  >
                    👤 Portrait Face (Top)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset(50, 12, 1.3)}
                    className="px-2.5 py-1.5 text-left bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-stone-200 rounded-lg text-[11px] font-semibold text-stone-800 transition-colors"
                  >
                    🔍 Close-Up Head
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset(50, 50, 1.0)}
                    className="px-2.5 py-1.5 text-left bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-stone-200 rounded-lg text-[11px] font-semibold text-stone-800 transition-colors"
                  >
                    🎯 Dead Center
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset(30, 25, 1.15)}
                    className="px-2.5 py-1.5 text-left bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-stone-200 rounded-lg text-[11px] font-semibold text-stone-800 transition-colors"
                  >
                    👈 Face on Left
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset(70, 25, 1.15)}
                    className="px-2.5 py-1.5 text-left bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-stone-200 rounded-lg text-[11px] font-semibold text-stone-800 transition-colors"
                  >
                    👉 Face on Right
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-2.5 py-1.5 text-left bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-[11px] font-semibold text-stone-600 transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset All</span>
                  </button>
                </div>
              </div>

              {/* Exact Coordinate Fine Tuning */}
              <div className="pt-2 border-t border-stone-200 space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] text-stone-600 font-medium">
                    <span>Horizontal Position (X)</span>
                    <span className="font-mono">{focalX}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={focalX}
                    onChange={(e) => setFocalX(parseInt(e.target.value, 10))}
                    className="w-full accent-emerald-800 cursor-pointer h-1.5 bg-stone-200 rounded"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-stone-600 font-medium">
                    <span>Vertical Position / Face Height (Y)</span>
                    <span className="font-mono">{focalY}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={focalY}
                    onChange={(e) => setFocalY(parseInt(e.target.value, 10))}
                    className="w-full accent-emerald-800 cursor-pointer h-1.5 bg-stone-200 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 rounded-xl hover:bg-stone-100 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Center</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 text-lime-300" />
              <span>Save Framing Position</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
