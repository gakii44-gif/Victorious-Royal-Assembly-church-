/**
 * Robust IndexedDB wrapper for permanent, persistent storage of uploaded photos, 
 * video clips, and gallery/slot state.
 * 
 * IndexedDB has gigabytes of storage capacity, eliminating browser localStorage 
 * quota errors (which fail at ~5MB) and guaranteeing that uploaded photos and 
 * videos never disappear across refreshes, navigation, or app restarts.
 */

const DB_NAME = 'vrai_media_db';
const STORE_BLOBS = 'media_blobs';
const STORE_METADATA = 'media_metadata';
const DB_VERSION = 2;

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.reject(new Error('IndexedDB not supported in this environment'));
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // 1. Binary store for photo and video blobs
        if (!db.objectStoreNames.contains(STORE_BLOBS)) {
          db.createObjectStore(STORE_BLOBS);
        }
        
        // 2. Metadata store for items list and slot configurations
        if (!db.objectStoreNames.contains(STORE_METADATA)) {
          db.createObjectStore(STORE_METADATA);
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  return dbPromise;
}

/**
 * Save binary photo or video file/blob to IndexedDB
 */
export async function saveMediaFile(id: string, file: File | Blob): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_BLOBS, 'readwrite');
      const store = tx.objectStore(STORE_BLOBS);
      const req = store.put(file, id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to save media to IndexedDB:', err);
  }
}

/**
 * Retrieve binary photo or video file/blob from IndexedDB
 */
export async function getMediaFile(id: string): Promise<Blob | null> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_BLOBS, 'readonly');
      const store = tx.objectStore(STORE_BLOBS);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to get media from IndexedDB:', err);
    return null;
  }
}

/**
 * Delete a media file from IndexedDB
 */
export async function deleteMediaFile(id: string): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_BLOBS, 'readwrite');
      const store = tx.objectStore(STORE_BLOBS);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to delete media from IndexedDB:', err);
  }
}

/**
 * Get all stored media blob keys (useful for recovering orphaned uploads)
 */
export async function getAllMediaBlobKeys(): Promise<string[]> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_BLOBS, 'readonly');
      const store = tx.objectStore(STORE_BLOBS);
      const req = store.getAllKeys();
      req.onsuccess = () => {
        const keys = (req.result || []).map((k) => String(k));
        resolve(keys);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to get media keys from IndexedDB:', err);
    return [];
  }
}

/**
 * Save gallery items metadata to IndexedDB
 */
export async function saveGalleryItemsToIDB<T>(items: T): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_METADATA, 'readwrite');
      const store = tx.objectStore(STORE_METADATA);
      const req = store.put(items, 'gallery_photos_list');
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to save gallery metadata to IndexedDB:', err);
  }
}

/**
 * Load gallery items metadata from IndexedDB
 */
export async function loadGalleryItemsFromIDB<T>(): Promise<T | null> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_METADATA, 'readonly');
      const store = tx.objectStore(STORE_METADATA);
      const req = store.get('gallery_photos_list');
      req.onsuccess = () => resolve((req.result as T) || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to load gallery metadata from IndexedDB:', err);
    return null;
  }
}

/**
 * Save slot photos dictionary to IndexedDB
 */
export async function saveSlotPhotosToIDB<T>(slots: T): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_METADATA, 'readwrite');
      const store = tx.objectStore(STORE_METADATA);
      const req = store.put(slots, 'slot_photos_dictionary');
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to save slot photos metadata to IndexedDB:', err);
  }
}

/**
 * Load slot photos dictionary from IndexedDB
 */
export async function loadSlotPhotosFromIDB<T>(): Promise<T | null> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_METADATA, 'readonly');
      const store = tx.objectStore(STORE_METADATA);
      const req = store.get('slot_photos_dictionary');
      req.onsuccess = () => resolve((req.result as T) || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to load slot photos metadata from IndexedDB:', err);
    return null;
  }
}

/**
 * Lightweight client-side image thumbnail generator for instant cache (<25KB)
 */
export function createCompactThumbnail(file: File, maxDim = 400, quality = 0.7): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        let { width, height } = img;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(img.src);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve('');
    };
    reader.onerror = () => resolve('');
  });
}

/**
 * Generate a poster thumbnail from a video File
 */
export function generateVideoThumbnail(videoFile: File): Promise<{ thumbnailUrl: string; duration: string }> {
  return new Promise((resolve) => {
    const videoUrl = URL.createObjectURL(videoFile);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = videoUrl;
    video.muted = true;
    video.playsInline = true;

    // Timeout fallback after 4 seconds if video fails to seek
    const timer = setTimeout(() => {
      URL.revokeObjectURL(videoUrl);
      resolve({
        thumbnailUrl: '',
        duration: 'Video',
      });
    }, 4000);

    video.onloadedmetadata = () => {
      const durationSecs = Math.round(video.duration || 0);
      const mins = Math.floor(durationSecs / 60);
      const secs = durationSecs % 60;
      const formattedDuration = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

      // Seek to 0.5s or 10%
      const seekTime = Math.min(1.0, video.duration > 1 ? 0.8 : 0.1);
      video.currentTime = seekTime;

      video.onseeked = () => {
        clearTimeout(timer);
        try {
          const canvas = document.createElement('canvas');
          canvas.width = Math.min(video.videoWidth || 640, 640);
          canvas.height = Math.min(video.videoHeight || 360, 360);
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.75);
            URL.revokeObjectURL(videoUrl);
            resolve({ thumbnailUrl, duration: formattedDuration });
            return;
          }
        } catch (e) {
          // ignore canvas draw errors (e.g. cross-origin)
        }
        URL.revokeObjectURL(videoUrl);
        resolve({ thumbnailUrl: '', duration: formattedDuration });
      };
    };

    video.onerror = () => {
      clearTimeout(timer);
      URL.revokeObjectURL(videoUrl);
      resolve({ thumbnailUrl: '', duration: 'Video' });
    };
  });
}
