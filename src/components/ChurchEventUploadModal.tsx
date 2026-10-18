import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  HeartHandshake, 
  Calendar, 
  Sparkles, 
  Heart, 
  Church, 
  User, 
  SlidersHorizontal, 
  Move,
  Check,
  AlertCircle
} from 'lucide-react';
import { usePhotos, GalleryCategory, ChurchEventDetails, FocalPoint } from '../context/PhotoContext';

interface ChurchEventUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEventType?: 'wedding' | 'anniversary' | 'church-anniversary' | 'thanksgiving' | 'dedication';
}

export const ChurchEventUploadModal: React.FC<ChurchEventUploadModalProps> = ({
  isOpen,
  onClose,
  defaultEventType = 'wedding',
}) => {
  const { uploadMultipleGalleryMedia, updateGalleryPhoto } = usePhotos();

  const [eventType, setEventType] = useState<'wedding' | 'anniversary' | 'thanksgiving' | 'dedication' | 'milestone'>('wedding');
  const [title, setTitle] = useState('');
  const [celebrants, setCelebrants] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [anniversaryYears, setAnniversaryYears] = useState('');
  const [caption, setCaption] = useState('');
  const [scripture, setScripture] = useState('');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [focalX, setFocalX] = useState<number>(50);
  const [focalY, setFocalY] = useState<number>(30); // Default near top for faces!
  const [zoom, setZoom] = useState<number>(1.1);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Sync default type when opening
  React.useEffect(() => {
    if (isOpen) {
      if (defaultEventType === 'church-anniversary') {
        setEventType('milestone');
        setTitle('Victorious Royal Assembly Church Anniversary');
      } else {
        setEventType(defaultEventType as any);
        if (defaultEventType === 'wedding') {
          setTitle('Holy Matrimony & Wedding Blessing');
        } else if (defaultEventType === 'anniversary') {
          setTitle('Wedding Anniversary Celebration');
          setAnniversaryYears('10 Years');
        } else if (defaultEventType === 'thanksgiving') {
          setTitle('Altar Thanksgiving & Family Blessing');
        }
      }
    }
  }, [isOpen, defaultEventType]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setErrorMessage(null);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updateCoords(e);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateCoords(e);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  const updateCoords = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
    const y = Math.max(0, Math.min(100, Math.round(((e.clientY - rect.top) / rect.height) * 100)));
    setFocalX(x);
    setFocalY(y);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage('Please select a photograph to upload for this celebration event.');
      return;
    }

    try {
      setIsUploading(true);
      setErrorMessage(null);

      const computedTitle = title.trim() || 
        (eventType === 'wedding' ? `Holy Matrimony of ${celebrants || 'Couple'}` :
         eventType === 'anniversary' ? `${anniversaryYears || ''} Wedding Anniversary of ${celebrants || 'Couple'}` :
         'Church Celebration Event');

      const fullCaption = [
        caption.trim(),
        scripture.trim() ? `Scripture: "${scripture.trim()}"` : null,
        celebrants.trim() ? `Celebrants: ${celebrants.trim()}` : null,
        eventDate ? `Date: ${eventDate}` : null
      ].filter(Boolean).join(' · ');

      // Upload to category 'church-events'
      const items = await uploadMultipleGalleryMedia(
        [selectedFile],
        'church-events' as GalleryCategory,
        computedTitle
      );

      if (items && items.length > 0) {
        const uploadedItem = items[0];
        // Attach event metadata and adjusted focal point & zoom
        updateGalleryPhoto(uploadedItem.id, {
          title: computedTitle,
          caption: fullCaption,
          focalPoint: { x: focalX, y: focalY },
          zoom: zoom,
          eventDetails: {
            eventType,
            celebrants: celebrants.trim(),
            eventDate,
            anniversaryYears: anniversaryYears.trim(),
          }
        });
      }

      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to upload event photograph.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-900 via-stone-900 to-purple-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-400/20 border border-rose-400/40 flex items-center justify-center text-rose-300">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white font-heading">
                Upload Church Event &amp; Celebration
              </h3>
              <p className="text-xs text-rose-200">
                Weddings, Anniversaries, Conventions &amp; Dedications in Juba
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Event Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Select Celebration Category:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'wedding', label: '💍 Wedding', desc: 'Holy Matrimony' },
                { id: 'anniversary', label: '🥂 Anniversary', desc: 'Wedding Years' },
                { id: 'milestone', label: '⛪ Church Jubilee', desc: 'Annual Convention' },
                { id: 'thanksgiving', label: '🙏 Dedication', desc: 'Child & Altar' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setEventType(t.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    eventType === t.id
                      ? 'border-rose-600 bg-rose-50 ring-2 ring-rose-600/20 text-rose-950 font-bold'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <p className="text-xs">{t.label}</p>
                  <p className="text-[10px] text-stone-500">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Couple / Celebrant Names & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Couple / Celebrants' Names:
              </label>
              <input
                type="text"
                value={celebrants}
                onChange={(e) => setCelebrants(e.target.value)}
                placeholder="e.g. Mr. & Mrs. Deng, Pastor & First Lady"
                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Event Title / Celebration:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Holy Matrimony & Altar Blessing"
                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600"
              />
            </div>
          </div>

          {/* Date & Milestone / Anniversary Years */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Event Date:
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Anniversary Years (if applicable):
              </label>
              <input
                type="text"
                value={anniversaryYears}
                onChange={(e) => setAnniversaryYears(e.target.value)}
                placeholder="e.g. 10th Wedding Anniversary / 15 Years"
                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600"
              />
            </div>
          </div>

          {/* Description & Scripture */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Story / Caption / Testimony:
              </label>
              <textarea
                rows={2}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Share details of the celebration, ceremony, thanksgiving, or fellowship..."
                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Commemorative Scripture Verse:
              </label>
              <input
                type="text"
                value={scripture}
                onChange={(e) => setScripture(e.target.value)}
                placeholder="e.g. Ecclesiastes 4:12 or 1 Samuel 1:27"
                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600"
              />
            </div>
          </div>

          {/* Photo Selection & Interactive Drag-To-Fit Face Centering */}
          <div className="pt-2 border-t border-stone-200">
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
              <span>Choose Photo &amp; Drag to Center Faces:</span>
              {selectedFile && (
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>{selectedFile.name}</span>
                </span>
              )}
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {!previewUrl ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-rose-300 hover:border-rose-500 bg-rose-50/40 rounded-xl p-6 text-center cursor-pointer transition-colors"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-white shadow-xs border border-rose-200 flex items-center justify-center text-rose-700 mb-2">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-900">
                  Click to select authentic Wedding / Anniversary photo
                </p>
                <p className="text-[11px] text-stone-500 mt-1">
                  Upload directly from phone or computer · JPG, PNG, WEBP
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-600 px-1">
                  <span className="font-semibold text-rose-900 flex items-center gap-1">
                    <Move className="w-3.5 h-3.5" />
                    <span>Drag photo inside box to frame the couple's faces</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] text-rose-700 hover:underline font-bold"
                  >
                    Change Photo
                  </button>
                </div>

                {/* Interactive Dragging Box */}
                <div
                  ref={canvasRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  className={`relative aspect-[4/3] max-h-[260px] bg-stone-900 rounded-xl overflow-hidden cursor-crosshair border-2 ${
                    isDragging ? 'border-amber-400 shadow-md' : 'border-rose-600 shadow-xs'
                  } select-none touch-none`}
                >
                  <img
                    src={previewUrl}
                    alt="Preview"
                    draggable={false}
                    className="w-full h-full object-cover pointer-events-none"
                    style={{
                      objectPosition: `${focalX}% ${focalY}%`,
                      transform: `scale(${zoom})`,
                      transformOrigin: `${focalX}% ${focalY}%`,
                    }}
                  />

                  {/* Crosshair indicator */}
                  <div
                    className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${focalX}%`, top: `${focalY}%` }}
                  >
                    <div className="w-8 h-8 rounded-full border-2 border-amber-400 bg-amber-400/20 flex items-center justify-center shadow">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                    </div>
                  </div>

                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
                    Face Focus: {focalX}%, {focalY}% · Zoom: {zoom}x
                  </div>
                </div>

                {/* Quick Zoom slider */}
                <div className="flex items-center gap-3 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-700 shrink-0">Zoom to fit face:</span>
                  <input
                    type="range"
                    min="1"
                    max="2.2"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full accent-rose-700 cursor-pointer h-1.5 bg-stone-200 rounded"
                  />
                  <span className="text-[11px] font-mono text-stone-600 shrink-0">{zoom}x</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !selectedFile}
              className="px-5 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 disabled:opacity-50 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isUploading ? 'Publishing Celebration...' : 'Publish to Church Events'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
