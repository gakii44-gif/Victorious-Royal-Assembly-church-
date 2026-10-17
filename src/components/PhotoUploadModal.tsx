import React, { useState, useRef } from 'react';
import { X, Upload, CheckCircle2, Trash2, Image as ImageIcon, Camera, RefreshCw } from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';

export const PhotoUploadModal: React.FC = () => {
  const { activeUploadSlot, closeUploadModal, uploadModalLabel, getPhoto, uploadPhoto, removePhoto } = usePhotos();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [altText, setAltText] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  if (!activeUploadSlot) return null;

  const currentPhoto = getPhoto(activeUploadSlot);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      if (!altText) {
        setAltText(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      if (!altText) {
        setAltText(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    }
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      await uploadPhoto(activeUploadSlot, selectedFile, altText);
      setIsUploading(false);
      closeUploadModal();
    } catch (err) {
      console.error(err);
      setIsUploading(false);
    }
  };

  const handleRemoveExisting = () => {
    removePhoto(activeUploadSlot);
    setSelectedFile(null);
    setPreviewUrl(null);
    closeUploadModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
              <Camera className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Upload Real Church Photograph
              </h3>
              <p className="text-[11px] text-stone-500">
                Slot: <code className="font-mono text-emerald-800 font-semibold">{activeUploadSlot}</code>
              </p>
            </div>
          </div>
          <button
            onClick={closeUploadModal}
            className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-stone-700">
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-950">
            <p className="font-semibold mb-0.5">{uploadModalLabel}</p>
            <p className="text-[11px] text-emerald-800">
              Only authentic photographs of Victorious Royal Assembly International, pastors, pupils, or school facilities. No AI or stock photos.
            </p>
          </div>

          {/* Existing or New Preview */}
          {(previewUrl || currentPhoto) ? (
            <div className="space-y-3">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-stone-100 border border-stone-200">
                <img
                  src={previewUrl || currentPhoto?.url}
                  alt={altText || currentPhoto?.alt || 'Uploaded church photograph'}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-emerald-800 font-bold hover:underline flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Replace with a different photo</span>
                </button>
                {currentPhoto && (
                  <button
                    type="button"
                    onClick={handleRemoveExisting}
                    className="text-xs text-rose-700 hover:text-rose-900 flex items-center gap-1 font-semibold hover:bg-rose-50 px-2 py-1 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Photo (Reset)</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-300 hover:border-emerald-600 rounded-xl p-8 text-center cursor-pointer transition-colors bg-stone-50 hover:bg-emerald-50/30 flex flex-col items-center justify-center gap-2"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <p className="font-semibold text-slate-900 text-xs mt-1">
                Click or drag &amp; drop your real photograph here
              </p>
              <p className="text-[11px] text-stone-500">
                Supports JPEG, PNG, WebP (under 5MB recommended)
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />

          <div>
            <label className="text-[11px] font-semibold text-slate-900 block mb-1">
              Photograph Description / Alt Text (For accessibility &amp; SEO):
            </label>
            <input
              type="text"
              placeholder="e.g. Victorious Heritage Primary School classroom reading session in Juba"
              value={altText || (currentPhoto?.alt ?? '')}
              onChange={(e) => setAltText(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-stone-200 rounded-md focus:border-emerald-600 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={closeUploadModal}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
          >
            Cancel
          </button>
          {selectedFile && (
            <button
              type="button"
              disabled={isUploading}
              onClick={handleSave}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-md transition-colors shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isUploading ? 'Saving...' : 'Apply Photo to Website'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoUploadModal;
