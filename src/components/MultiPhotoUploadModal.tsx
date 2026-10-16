import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  CheckCircle2, 
  Trash2, 
  Image as ImageIcon, 
  Camera, 
  Plus, 
  AlertCircle,
  Layers,
  GraduationCap,
  Church,
  Heart,
  Wrench,
  Film,
  Play
} from 'lucide-react';
import { usePhotos, GalleryCategory } from '../context/PhotoContext';

interface PendingFile {
  file: File;
  previewUrl: string;
  name: string;
  category: GalleryCategory;
  caption: string;
  isVideo: boolean;
  sizeFormatted: string;
}

export const MultiPhotoUploadModal: React.FC = () => {
  const { 
    isMultiUploadOpen, 
    closeMultiUploadModal, 
    uploadMultipleGalleryMedia, 
    multiUploadDefaultCategory 
  } = usePhotos();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>(multiUploadDefaultCategory);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [batchTitle, setBatchTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);

  // Sync category if modal opens with a different default
  React.useEffect(() => {
    if (isMultiUploadOpen) {
      setSelectedCategory(multiUploadDefaultCategory);
      setPendingFiles([]);
      setBatchTitle('');
      setUploadSuccess(false);
    }
  }, [isMultiUploadOpen, multiUploadDefaultCategory]);

  if (!isMultiUploadOpen) return null;

  const categories: { id: GalleryCategory; label: string; icon: React.ReactNode; desc: string }[] = [
    { 
      id: 'heritage', 
      label: 'Life at Victorious Heritage', 
      icon: <GraduationCap className="w-4 h-4 text-emerald-600" />,
      desc: 'Pupils, classroom moments, playtime, assembly, adult education & celebrations'
    },
    { 
      id: 'church', 
      label: 'Church & Altar (Photos & Videos)', 
      icon: <Church className="w-4 h-4 text-amber-600" />,
      desc: 'Sunday worship, choir praise videos, Word of Faith altar, communion, congregations'
    },
    { 
      id: 'women', 
      label: 'Women Section (Photos & Videos)', 
      icon: <Heart className="w-4 h-4 text-rose-500" />,
      desc: 'Women’s fellowship, anniversary uniform fabrics, prayer vigils, widow outreach'
    },
    { 
      id: 'vocational', 
      label: 'School Vocational (Photos & Videos)', 
      icon: <Wrench className="w-4 h-4 text-sky-600" />,
      desc: 'Tailoring machines, carpentry workshops, solar/electrical, artisan apprentices'
    },
  ];

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newPending: PendingFile[] = [];

    Array.from(files).forEach((file) => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (isImage || isVideo) {
        const previewUrl = URL.createObjectURL(file);
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        const sizeMb = file.size / (1024 * 1024);
        const sizeFormatted = sizeMb >= 1 ? `${sizeMb.toFixed(1)} MB` : `${(file.size / 1024).toFixed(0)} KB`;

        newPending.push({
          file,
          previewUrl,
          name: cleanName,
          category: selectedCategory,
          caption: '',
          isVideo,
          sizeFormatted,
        });
      }
    });

    setPendingFiles((prev) => [...prev, ...newPending]);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleRemovePending = (index: number) => {
    setPendingFiles((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].previewUrl);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleUpdateItemCategory = (index: number, cat: GalleryCategory) => {
    setPendingFiles((prev) => {
      const updated = [...prev];
      updated[index].category = cat;
      return updated;
    });
  };

  const handleBatchCategoryChange = (cat: GalleryCategory) => {
    setSelectedCategory(cat);
    // Also update all pending files to match default
    setPendingFiles((prev) => prev.map((f) => ({ ...f, category: cat })));
  };

  const handleUploadAll = async () => {
    if (pendingFiles.length === 0) return;
    setIsUploading(true);

    try {
      // Group by category to upload cleanly
      for (const item of pendingFiles) {
        await uploadMultipleGalleryMedia(
          [item.file],
          item.category,
          item.name || batchTitle || undefined
        );
      }

      setUploadedCount(pendingFiles.length);
      setIsUploading(false);
      setUploadSuccess(true);
      setPendingFiles([]);

      // Auto close after 1.6s
      setTimeout(() => {
        closeMultiUploadModal();
      }, 1600);
    } catch (err) {
      console.error('Multi-upload error:', err);
      setIsUploading(false);
      alert('An error occurred during upload. Please check file sizes and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-stone-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <Upload className="w-5 h-5 text-lime-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                Upload Photos &amp; Videos to Gallery
              </h3>
              <p className="text-xs text-stone-300">
                Supports multiple photos and video clips (.mp4, .mov, .webm, .jpg, .png)
              </p>
            </div>
          </div>

          <button
            onClick={closeMultiUploadModal}
            disabled={isUploading}
            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {uploadSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-8 h-8 text-emerald-700" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 font-heading">
                Successfully Uploaded {uploadedCount} Item{uploadedCount === 1 ? '' : 's'}!
              </h4>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                Your media has been categorized and saved to the verified church archives. Updating gallery now...
              </p>
            </div>
          ) : (
            <>
              {/* Category Selection Tabs */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  1. Choose Section:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleBatchCategoryChange(cat.id)}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                          isSelected
                            ? 'border-emerald-700 bg-emerald-50/80 text-emerald-950 shadow-xs ring-1 ring-emerald-600'
                            : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          {cat.icon}
                          <span className="font-bold text-xs truncate">{cat.label}</span>
                        </div>
                        <p className="text-[10px] text-stone-500 line-clamp-2 leading-tight">
                          {cat.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drag and Drop Zone for Photos & Videos */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-300 hover:border-emerald-600 rounded-2xl p-8 text-center bg-stone-50/70 hover:bg-emerald-50/30 transition-all cursor-pointer group space-y-3"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                <div className="w-14 h-14 mx-auto rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-emerald-800 shadow-sm group-hover:scale-105 transition-transform">
                  <div className="flex items-center gap-1">
                    <Camera className="w-5 h-5 text-emerald-700" />
                    <Film className="w-5 h-5 text-amber-600" />
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">
                    Click to select or drag &amp; drop photos and videos here
                  </p>
                  <p className="text-xs text-stone-500">
                    Supports high-resolution images and video clips (MP4, MOV, WEBM, JPG, PNG)
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-stone-600 text-[11px] font-semibold border border-stone-200">
                  <Plus className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Select Multiple Files at Once</span>
                </div>
              </div>

              {/* Optional Batch Title */}
              {pendingFiles.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                    <span>Optional Group Title (applies to unnamed files):</span>
                    <span className="text-[11px] text-stone-400 font-normal">e.g., &ldquo;Victorious Heritage School Sports Day&rdquo;</span>
                  </label>
                  <input
                    type="text"
                    value={batchTitle}
                    onChange={(e) => setBatchTitle(e.target.value)}
                    placeholder="Enter an optional collective title for these uploads..."
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
                  />
                </div>
              )}

              {/* Pending Queue List with Video Previews */}
              {pendingFiles.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Ready to Upload ({pendingFiles.length} item{pendingFiles.length === 1 ? '' : 's'})</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setPendingFiles([])}
                      className="text-xs text-red-600 hover:text-red-800 font-semibold"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                    {pendingFiles.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-3 relative group"
                      >
                        {/* Thumbnail / Video Preview */}
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-200 shrink-0 relative flex items-center justify-center">
                          {item.isVideo ? (
                            <div className="w-full h-full bg-stone-900 flex flex-col items-center justify-center text-white relative">
                              <video
                                src={item.previewUrl}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Play className="w-5 h-5 text-white fill-white/80" />
                              </div>
                            </div>
                          ) : (
                            <img
                              src={item.previewUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          )}

                          <span className={`absolute bottom-0.5 right-0.5 px-1 rounded text-[8px] font-bold ${
                            item.isVideo ? 'bg-amber-600 text-white' : 'bg-emerald-700 text-white'
                          }`}>
                            {item.isVideo ? 'VIDEO' : 'PHOTO'}
                          </span>
                        </div>

                        {/* Title and Category Controls */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-stone-500">
                            Size: {item.sizeFormatted}
                          </p>

                          {/* Quick Category Selector */}
                          <select
                            value={item.category}
                            onChange={(e) => handleUpdateItemCategory(idx, e.target.value as GalleryCategory)}
                            className="text-[11px] py-1 px-2 rounded bg-white border border-stone-300 text-slate-700 font-medium focus:ring-1 focus:ring-emerald-700 w-full"
                          >
                            <option value="heritage">Life at Victorious Heritage</option>
                            <option value="church">Church &amp; Altar</option>
                            <option value="women">Women Section</option>
                            <option value="vocational">School Vocational</option>
                          </select>
                        </div>

                        {/* Remove from queue */}
                        <button
                          type="button"
                          onClick={() => handleRemovePending(idx)}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-stone-200 rounded-md transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        {!uploadSuccess && (
          <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-4 shrink-0">
            <span className="text-xs text-stone-500">
              {pendingFiles.length === 0 ? (
                'Select photos or videos to begin'
              ) : (
                <strong className="text-slate-800">
                  {pendingFiles.length} file{pendingFiles.length === 1 ? '' : 's'} staged for upload
                </strong>
              )}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeMultiUploadModal}
                disabled={isUploading}
                className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-200 rounded-xl transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUploadAll}
                disabled={pendingFiles.length === 0 || isUploading}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 disabled:bg-stone-300 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-xs flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Media...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-lime-300" />
                    <span>Upload {pendingFiles.length > 0 ? `(${pendingFiles.length})` : ''}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
