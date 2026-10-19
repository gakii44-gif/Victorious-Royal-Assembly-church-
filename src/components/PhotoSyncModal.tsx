import React, { useState, useRef } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  HardDrive, 
  ArrowRight, 
  RefreshCw, 
  Info, 
  ShieldCheck, 
  Sparkles,
  FileCheck,
  Globe
} from 'lucide-react';
import { usePhotos, GalleryPhotoItem, PhotoData } from '../context/PhotoContext';
import { getMediaFile, saveMediaFile, getAllMediaBlobKeys } from '../utils/mediaStorage';

interface PhotoSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhotoSyncModal: React.FC<PhotoSyncModalProps> = ({ isOpen, onClose }) => {
  const { 
    galleryPhotos, 
    photos, 
    uploadMultipleGalleryPhotos, 
    isStorageReady 
  } = usePhotos();

  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [exportProgress, setExportProgress] = useState<string>('');
  const [importProgress, setImportProgress] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
  const isPreviewHost = currentHost.includes('ais-dev') || currentHost.includes('aistudio.google.com') || currentHost.includes('localhost') || currentHost.includes('127.0.0.1');
  const userUploadsCount = galleryPhotos.filter(p => p.isUserUploaded).length + Object.keys(photos).length;

  // 1. Export all uploaded photos & metadata into a single transfer package file
  const handleExportPackage = async () => {
    try {
      setIsExporting(true);
      setStatusMessage(null);
      setExportProgress('Gathering uploaded photos and metadata...');

      const exportData: {
        version: number;
        exportedAt: string;
        sourceDomain: string;
        galleryPhotos: GalleryPhotoItem[];
        slotPhotos: Record<string, PhotoData>;
        blobs: Record<string, { base64: string; type: string }>;
      } = {
        version: 1,
        exportedAt: new Date().toISOString(),
        sourceDomain: currentHost,
        galleryPhotos: galleryPhotos.filter(p => p.isUserUploaded),
        slotPhotos: photos,
        blobs: {},
      };

      const userItems = galleryPhotos.filter(p => p.isUserUploaded);
      const totalToProcess = userItems.length + Object.keys(photos).length;
      let processed = 0;

      // Extract gallery item blobs
      for (const item of userItems) {
        processed++;
        setExportProgress(`Packaging photo ${processed} of ${totalToProcess}: ${item.title}...`);
        try {
          const blob = await getMediaFile(item.id);
          if (blob) {
            const base64 = await blobToBase64(blob);
            exportData.blobs[item.id] = { base64, type: blob.type };
          }
        } catch (e) {
          console.warn(`Could not export blob for ${item.id}:`, e);
        }
      }

      // Extract slot item blobs
      for (const [slotKey, data] of Object.entries(photos)) {
        processed++;
        setExportProgress(`Packaging slot ${slotKey}...`);
        try {
          const blob = await getMediaFile(`slot-${slotKey}`);
          if (blob) {
            const base64 = await blobToBase64(blob);
            exportData.blobs[`slot-${slotKey}`] = { base64, type: blob.type };
          }
        } catch (e) {
          console.warn(`Could not export slot blob for ${slotKey}:`, e);
        }
      }

      const jsonStr = JSON.stringify(exportData);
      const exportBlob = new Blob([jsonStr], { type: 'application/json' });
      const downloadUrl = URL.createObjectURL(exportBlob);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `vrai-church-photos-archive-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setStatusMessage({
        type: 'success',
        text: `Export complete! Downloaded archive with ${userItems.length} photos and slot images. Keep this file safe or import it into your published website.`,
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Export failed: ${err?.message || 'Unknown error'}`,
      });
    } finally {
      setIsExporting(false);
      setExportProgress('');
    }
  };

  // Helper: Convert Blob to base64 string
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Helper: Convert Base64 data URL to Blob
  const base64ToBlob = (dataUrl: string): Promise<Blob> => {
    return fetch(dataUrl).then(res => res.blob());
  };

  // 2. Import transfer package file into this browser's IndexedDB
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      setStatusMessage(null);
      setImportProgress('Reading archive package file...');

      const text = await file.text();
      const parsed = JSON.parse(text);

      if (!parsed.galleryPhotos && !parsed.blobs) {
        throw new Error('Invalid archive format. File must be a vrai-church-photos-archive JSON file.');
      }

      const blobs = parsed.blobs || {};
      const importedGallery: GalleryPhotoItem[] = parsed.galleryPhotos || [];
      const totalBlobs = Object.keys(blobs).length;
      let count = 0;

      for (const [id, blobData] of Object.entries(blobs)) {
        count++;
        setImportProgress(`Restoring photo ${count} of ${totalBlobs} to database...`);
        try {
          const rawBlob = await base64ToBlob((blobData as any).base64);
          await saveMediaFile(id, rawBlob);
        } catch (blobErr) {
          console.warn(`Failed restoring blob ${id}:`, blobErr);
        }
      }

      // Merge imported photos with current gallery items
      if (importedGallery.length > 0) {
        const existingIds = new Set(galleryPhotos.map(p => p.id));
        const newItems = importedGallery.filter(p => !existingIds.has(p.id));
        
        if (newItems.length > 0) {
          // Trigger reload by updating localStorage and reloading
          const updated = [...newItems, ...galleryPhotos];
          localStorage.setItem('vrai_church_gallery_photos', JSON.stringify(updated));
        }
      }

      if (parsed.slotPhotos) {
        const currentSlots = photos || {};
        const mergedSlots = { ...currentSlots, ...parsed.slotPhotos };
        localStorage.setItem('vrai_church_uploaded_photos', JSON.stringify(mergedSlots));
      }

      setStatusMessage({
        type: 'success',
        text: `Successfully imported ${totalBlobs} photos! Refreshing page to display your photos...`,
      });

      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Import failed: ${err?.message || 'Could not parse JSON archive.'}`,
      });
    } finally {
      setIsImporting(false);
      setImportProgress('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-400/20 border border-lime-400/40 flex items-center justify-center text-lime-300">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white font-heading">
                Photo Sync &amp; Transfer Center
              </h3>
              <p className="text-xs text-stone-300">
                Transfer photos between Preview and Published website · {currentHost}
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
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-sm">
          {/* Status Message */}
          {statusMessage && (
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
              statusMessage.type === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : statusMessage.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-stone-50 border-stone-200 text-stone-800'
            }`}>
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <p className="text-xs font-semibold leading-relaxed">
                {statusMessage.text}
              </p>
            </div>
          )}

          {/* Diagnosis Card */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-800" />
                <span>Current Environment:</span>
              </span>
              <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-stone-200 text-stone-700">
                {currentHost}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-200">
              <span className="text-stone-600">Photos in This Browser's Database:</span>
              <span className="font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full">
                {userUploadsCount} Uploaded Items
              </span>
            </div>

            <div className="text-[11px] text-stone-600 pt-1 leading-relaxed">
              {userUploadsCount > 0 ? (
                <p>
                  ✅ You have <strong>{userUploadsCount} uploaded photos</strong> stored in this browser session. To make them appear on the published website, click <strong>"Export Photo Archive Package"</strong> below, then import that package on your published link.
                </p>
              ) : (
                <p>
                  ℹ️ This browser session currently has <strong>0 uploaded photos</strong>. If you uploaded photos in the AI Studio preview, open the preview, click <strong>"Export Photo Archive Package"</strong>, and upload the file here using <strong>"Import Photos Package"</strong>!
                </p>
              )}
            </div>
          </div>

          {/* Action Grid: Export vs Import */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Export Action */}
            <div className="p-5 rounded-2xl border-2 border-emerald-200 bg-emerald-50/40 flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-950 font-bold">
                  <Download className="w-4 h-4 text-emerald-700" />
                  <h4>1. Export Photo Archive</h4>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Downloads a complete backup package of all {userUploadsCount} uploaded photos, face framing coordinates, titles, and event tags into a single portable file.
                </p>
              </div>

              {exportProgress && (
                <p className="text-[11px] font-mono text-emerald-800 animate-pulse">
                  {exportProgress}
                </p>
              )}

              <button
                type="button"
                onClick={handleExportPackage}
                disabled={isExporting}
                className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Exporting Archive...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-lime-300" />
                    <span>Export {userUploadsCount} Photos Package</span>
                  </>
                )}
              </button>
            </div>

            {/* 2. Import Action */}
            <div className="p-5 rounded-2xl border-2 border-stone-200 bg-white flex flex-col justify-between space-y-4 shadow-2xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Upload className="w-4 h-4 text-stone-700" />
                  <h4>2. Import &amp; Restore Archive</h4>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Restore previously exported photo packages into this browser. Loads all photos directly into the website with full high-resolution rendering.
                </p>
              </div>

              {importProgress && (
                <p className="text-[11px] font-mono text-stone-800 animate-pulse">
                  {importProgress}
                </p>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImportFile}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 active:bg-stone-950 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isImporting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Importing Archive...</span>
                  </>
                ) : (
                  <>
                    <FileCheck className="w-3.5 h-3.5 text-amber-300" />
                    <span>Select Archive to Import (.json)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Built-in Permanent Visuals Guarantee */}
          <div className="p-4 rounded-xl bg-white border border-stone-200 flex items-start gap-3 text-xs text-stone-700">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-slate-900">
                16 Core Ministry &amp; School Visuals Committed Directly to Repository
              </p>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                All 16 official vector artworks for Sunday Worship, Altar Ministry, Women's Fellowship, Academic Convocation, Primary School Morning Assembly, Classrooms, Nutrition, Tailoring, Carpentry, and Solar Electrical are now bundled into the codebase so the published website never displays empty boxes or broken links for visitors.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <span className="text-[11px] text-stone-500 font-medium">
            Victorious Royal Assembly International · Juba, South Sudan
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg font-bold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
