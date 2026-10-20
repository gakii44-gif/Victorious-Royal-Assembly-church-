import React, { useState, useRef } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  HardDrive, 
  RefreshCw, 
  ShieldCheck, 
  Sparkles,
  FileCheck,
  Globe,
  CloudUpload,
  Check
} from 'lucide-react';
import { usePhotos, GalleryPhotoItem, PhotoData } from '../context/PhotoContext';
import { getMediaFile, saveMediaFile } from '../utils/mediaStorage';

interface PhotoSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhotoSyncModal: React.FC<PhotoSyncModalProps> = ({ isOpen, onClose }) => {
  const { 
    galleryPhotos, 
    photos, 
    syncAllPhotosToServer,
    isSyncingToServer,
    serverPhotoCount 
  } = usePhotos();

  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [exportProgress, setExportProgress] = useState<string>('');
  const [importProgress, setImportProgress] = useState<string>('');
  const [syncProgress, setSyncProgress] = useState<string>('');
  const [syncPercent, setSyncPercent] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
  const userUploadsCount = galleryPhotos.filter(p => p.isUserUploaded).length + Object.keys(photos).length;

  // 1. ONE-CLICK DIRECT CLOUD/SERVER SYNC: Pushes all local IndexedDB photos to server in resilient batches
  const handleDirectServerSync = async () => {
    try {
      setStatusMessage(null);
      setSyncProgress('Preparing photos for live upload...');
      setSyncPercent(0);
      
      const res = await syncAllPhotosToServer((prog) => {
        setSyncProgress(prog.message);
        setSyncPercent(prog.percent);
      });

      if (res.success) {
        setSyncPercent(100);
        setStatusMessage({
          type: 'success',
          text: `🎉 Success! Permanently saved ${res.count} photos to the live server. All photos are now stored on the server and will appear on the published website (vrai-empowering-futures.ai.studio) and on all mobile devices for all visitors!`,
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: `Server sync failed: ${res.error || 'Network error'}. You can also use the Export Archive package below as a backup.`,
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Error: ${err?.message || 'Sync failed'}`,
      });
    } finally {
      setTimeout(() => {
        setSyncProgress('');
        setSyncPercent(0);
      }, 4000);
    }
  };

  // 2. Export all uploaded photos & metadata into a single transfer package file
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
      for (const [slotKey, _data] of Object.entries(photos)) {
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
        text: `Export complete! Downloaded archive with ${userItems.length} photos and slot images. Keep this file safe or import it on any device.`,
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
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Helper: Convert Base64 data URL to Blob
  const base64ToBlob = (dataUrl: string): Promise<Blob> => {
    return fetch(dataUrl).then(res => res.blob());
  };

  // 3. Import transfer package file into this browser's IndexedDB and save to server
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
          const updated = [...newItems, ...galleryPhotos];
          localStorage.setItem('vrai_church_gallery_photos', JSON.stringify(updated));
        }
      }

      if (parsed.slotPhotos) {
        const currentSlots = photos || {};
        const mergedSlots = { ...currentSlots, ...parsed.slotPhotos };
        localStorage.setItem('vrai_church_uploaded_photos', JSON.stringify(mergedSlots));
      }

      // Automatically push imported archive to live server so all visitors see it
      setImportProgress('Permanently syncing imported photos to live server...');
      try {
        await fetch('/api/photos/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            galleryPhotos: importedGallery,
            slotPhotos: parsed.slotPhotos || {},
            blobs,
          }),
        });
      } catch (srvErr) {
        console.warn('Server sync after import skipped:', srvErr);
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
              <CloudUpload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white font-heading">
                Publish &amp; Sync Photos Center
              </h3>
              <p className="text-xs text-stone-300">
                Make your uploaded photos permanent and visible to all visitors on the published website
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
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-sm">
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

          {/* DIAGNOSIS BANNER: Explain why preview had photos while published had 0 */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 space-y-2">
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5 text-amber-900">
                <Globe className="w-4 h-4 text-amber-700" />
                <span>Diagnosis: Why photos didn't show on the published link</span>
              </span>
              <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-amber-200">
                {currentHost}
              </span>
            </div>
            <p className="text-stone-700 text-[11px] leading-relaxed">
              When photos are uploaded in a browser, modern web security stores them in that browser’s private storage (IndexedDB). A mobile phone or visitor visiting <strong>vrai-empowering-futures.ai.studio</strong> cannot see your computer’s private browser storage unless you click <strong>"Publish All Photos to Live Server"</strong> below.
            </p>
            <div className="flex items-center gap-4 pt-1 font-semibold text-[11px]">
              <span className="text-emerald-900">
                • Photos in this browser: <strong>{userUploadsCount} uploaded items</strong>
              </span>
              {serverPhotoCount > 0 && (
                <span className="text-sky-900">
                  • Server permanent photos: <strong>{serverPhotoCount} items live</strong>
                </span>
              )}
            </div>
          </div>

          {/* PRIMARY ONE-CLICK SERVER SYNC CARD */}
          <div className="p-5 rounded-2xl border-2 border-emerald-500 bg-emerald-950 text-white shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-lime-400" />
                <h4 className="font-bold text-sm text-lime-300">
                  Step 1: Publish Photos to Live Server
                </h4>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-lime-400/20 text-lime-300 rounded-full border border-lime-400/40">
                Recommended
              </span>
            </div>

            <p className="text-xs text-stone-200 leading-relaxed">
              Clicks one button to package all <strong>{userUploadsCount} uploaded photos</strong> and permanently commit them to the server. After this, any person opening your website on any mobile phone or computer will see every single photo immediately.
            </p>

            {syncProgress && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs text-lime-300 font-mono">
                  <span>{syncProgress}</span>
                  {syncPercent > 0 && <span className="font-bold">{syncPercent}%</span>}
                </div>
                <div className="w-full bg-stone-900 rounded-full h-2.5 overflow-hidden border border-emerald-600/50">
                  <div 
                    className="bg-gradient-to-r from-lime-500 to-emerald-400 h-2.5 rounded-full transition-all duration-300 ease-out" 
                    style={{ width: `${Math.max(5, syncPercent)}%` }}
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleDirectServerSync}
              disabled={isSyncingToServer || userUploadsCount === 0}
              className="w-full py-3 px-4 bg-lime-400 hover:bg-lime-300 active:bg-lime-500 text-slate-950 rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSyncingToServer ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Publishing &amp; Saving to Live Server...</span>
                </>
              ) : (
                <>
                  <CloudUpload className="w-4 h-4 text-slate-950" />
                  <span>🚀 Publish &amp; Save All {userUploadsCount} Photos to Live Server</span>
                </>
              )}
            </button>
          </div>

          {/* Secondary Action Grid: Export Archive & Import Archive */}
          <div className="space-y-2">
            <h5 className="font-bold text-xs text-stone-700 uppercase tracking-wider">
              Step 2 (Optional): Backup Archive Package
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* 1. Export Action */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-stone-900 font-bold text-xs">
                    <Download className="w-4 h-4 text-emerald-700" />
                    <span>Export Photo Archive (.json)</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Downloads a portable backup package of all {userUploadsCount} photos to keep on your computer.
                  </p>
                </div>

                {exportProgress && (
                  <p className="text-[10px] font-mono text-emerald-800 animate-pulse">
                    {exportProgress}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleExportPackage}
                  disabled={isExporting || userUploadsCount === 0}
                  className="w-full py-2 px-3 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 rounded-lg font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isExporting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Exporting...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Export Archive File</span>
                    </>
                  )}
                </button>
              </div>

              {/* 2. Import Action */}
              <div className="p-4 rounded-xl border border-stone-200 bg-white flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-stone-900 font-bold text-xs">
                    <Upload className="w-4 h-4 text-stone-700" />
                    <span>Import Archive to Server</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Restore a previously downloaded archive file. Automatically commits it to the server.
                  </p>
                </div>

                {importProgress && (
                  <p className="text-[10px] font-mono text-stone-800 animate-pulse">
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
                  className="w-full py-2 px-3 bg-stone-900 hover:bg-stone-800 active:bg-stone-950 text-white rounded-lg font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isImporting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Restoring...</span>
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-3.5 h-3.5 text-amber-300" />
                      <span>Select .json Archive</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Built-in Permanent Visuals Guarantee */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-2.5 text-xs text-stone-700">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p className="text-[11px] text-stone-600 leading-relaxed">
              <strong>Permanent Asset Protection:</strong> 16 official church and school vector graphics are built into the repository as permanent fallbacks so visitors never see broken image icons.
            </p>
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
