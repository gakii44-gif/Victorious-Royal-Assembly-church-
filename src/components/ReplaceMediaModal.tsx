import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  RefreshCw, 
  Film, 
  Camera, 
  Play, 
  AlertCircle,
  GraduationCap,
  Church,
  Heart,
  Wrench,
  ArrowRight,
  BookOpen,
  Smile
} from 'lucide-react';
import { usePhotos, GalleryCategory, GalleryPhotoItem } from '../context/PhotoContext';

interface ReplaceMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: GalleryPhotoItem | null;
  onDeleted?: (id: string) => void;
}

export const ReplaceMediaModal: React.FC<ReplaceMediaModalProps> = ({
  isOpen,
  onClose,
  item,
  onDeleted,
}) => {
  const { replaceGalleryMedia, updateGalleryPhoto, removeGalleryPhoto } = usePhotos();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('victorious-heritage');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (item && isOpen) {
      const cat = item.category === 'heritage' ? 'victorious-heritage' : item.category;
      setSelectedCategory(cat);
      setTitle(item.title);
      setCaption(item.caption || '');
      setSelectedFile(null);
      setFilePreviewUrl(null);
      setShowDeleteConfirm(false);
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const categories: { id: GalleryCategory; label: string; icon: React.ReactNode; desc: string }[] = [
    { 
      id: 'victorious-heritage', 
      label: 'Victorious Heritage', 
      icon: <BookOpen className="w-4 h-4 text-emerald-700" />,
      desc: 'Nursery & Primary School, adult education, classrooms, literacy, meals & lessons'
    },
    { 
      id: 'church', 
      label: 'Church', 
      icon: <Church className="w-4 h-4 text-amber-600" />,
      desc: 'Victorious Royal Assembly International, Sunday worship, altar, choir & communion'
    },
    { 
      id: 'women', 
      label: 'Women', 
      icon: <Heart className="w-4 h-4 text-rose-500" />,
      desc: 'Women fellowship, anniversary uniform fabrics, prayer vigils & widow care'
    },
    { 
      id: 'vocational', 
      label: 'Vocational', 
      icon: <Wrench className="w-4 h-4 text-sky-600" />,
      desc: 'Vocational training trades, tailoring machines, carpentry, solar & toolkits'
    },
    { 
      id: 'life-at-heritage', 
      label: 'Life at Victorious Heritage', 
      icon: <Smile className="w-4 h-4 text-purple-600" />,
      desc: 'Pupil everyday joy, recess playground swings, canopy dining & graduation'
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFilePreviewUrl(URL.createObjectURL(file));
      if (!title || title === item.title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setFilePreviewUrl(URL.createObjectURL(file));
      if (!title || title === item.title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (selectedFile) {
        // Replacing media with a newly selected file
        await replaceGalleryMedia(item.id, selectedFile, {
          title,
          category: selectedCategory,
          caption,
        });
      } else {
        // Just updating placement / section or title / caption
        updateGalleryPhoto(item.id, {
          title,
          category: selectedCategory,
          caption,
        });
      }
      setIsSaving(false);
      onClose();
    } catch (err) {
      console.error('Failed to replace/update media:', err);
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    removeGalleryPhoto(item.id);
    if (onDeleted) onDeleted(item.id);
    onClose();
  };

  const isCurrentVideo = item.mediaType === 'video';
  const isNewFileVideo = selectedFile?.type.startsWith('video/');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-stone-200 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-lime-300 flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                Replace or Re-Place Media in Gallery
              </h3>
              <p className="text-[11px] text-stone-400">
                Fix misplaced photos, swap with a new image/video, or remove
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700">
          
          {/* Current vs Replacement Media Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Current Item */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Current Photo / Video:
              </span>
              <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-stone-900 border border-stone-200">
                {isCurrentVideo ? (
                  item.videoUrl && item.videoUrl.trim() !== '' ? (
                    <video
                      src={item.videoUrl}
                      poster={item.url && item.url.trim() !== '' ? item.url : undefined}
                      className="w-full h-full object-cover"
                    />
                  ) : item.url && item.url.trim() !== '' ? (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-stone-800 text-stone-400">
                      <Film className="w-8 h-8 text-amber-400" />
                    </div>
                  )
                ) : item.url && item.url.trim() !== '' ? (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-stone-800 text-stone-400">
                    <Camera className="w-8 h-8 text-emerald-400" />
                  </div>
                )}
                <div className="absolute top-2 left-2 z-10">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs">
                    Current: {item.category === 'heritage' ? 'Victorious Heritage' : item.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Replacement Target File */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                New Replacement File (Optional):
              </span>
              {selectedFile && filePreviewUrl && filePreviewUrl.trim() !== '' ? (
                <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-stone-900 border-2 border-emerald-500">
                  {isNewFileVideo ? (
                    <video
                      src={filePreviewUrl}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={filePreviewUrl}
                      alt="New Replacement"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setFilePreviewUrl(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-black/90 text-white rounded-md"
                    title="Remove selected file"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute bottom-2 left-2 z-10">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
                      Ready to swap
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-4/3 rounded-xl border-2 border-dashed border-stone-300 hover:border-emerald-600 bg-stone-50 hover:bg-emerald-50/30 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-1.5">
                    <Upload className="w-4 h-4" />
                  </div>
                  <p className="font-bold text-slate-900 text-xs">
                    Click to select new file
                  </p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    or drag &amp; drop photo or video
                  </p>
                  <span className="text-[10px] text-stone-400 mt-1">
                    JPEG, PNG, WebP, MP4, MOV, WebM
                  </span>
                </div>
              )}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Section / Category Assignment ("In case it was not correctly placed") */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>Placement Section / Category:</span>
                <span className="text-[11px] font-normal text-stone-500">
                  (Choose correct section if misplaced)
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-3 rounded-xl text-left border transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/80 ring-2 ring-emerald-600/30 shadow-2xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="mt-0.5">{cat.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isSelected ? 'text-emerald-950' : 'text-slate-900'}`}>
                          {cat.label}
                        </span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                      </div>
                      <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                        {cat.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title & Caption */}
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-900 block mb-1">
                Media Title:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Descriptive title of the activity or milestone..."
                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-900 block mb-1">
                Description / Caption:
              </label>
              <textarea
                rows={2}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Describe pupils, event, church service, or date..."
                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Delete Danger Zone */}
          {showDeleteConfirm ? (
            <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs">Confirm Permanent Deletion</h4>
                  <p className="text-[11px] text-rose-700 mt-0.5">
                    Are you sure you want to remove <strong>"{item.title}"</strong> from the website gallery? This cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Yes, Delete Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 bg-white border border-rose-300 text-rose-800 hover:bg-rose-100 font-semibold text-xs rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            {!showDeleteConfirm && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-2 text-rose-700 hover:text-rose-900 hover:bg-rose-50 rounded-lg font-bold text-xs transition-colors flex items-center gap-1.5"
                title="Delete this photo or video from the gallery"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Photo</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-bold text-xs rounded-lg transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-lime-300" />
              <span>
                {isSaving 
                  ? 'Saving Changes...' 
                  : selectedFile 
                    ? 'Apply Replacement Photo' 
                    : 'Save Placement & Changes'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
