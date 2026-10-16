/**
 * Lightweight IndexedDB wrapper for persistent storage of uploaded photos and video clips.
 * IndexedDB supports large files (dozens to hundreds of MBs), preventing localStorage quota errors.
 */

const DB_NAME = 'vrai_media_db';
const STORE_NAME = 'media_blobs';
const DB_VERSION = 1;

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
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
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

export async function saveMediaFile(id: string, file: File | Blob): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(file, id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to save media to IndexedDB:', err);
  }
}

export async function getMediaFile(id: string): Promise<Blob | null> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to get media from IndexedDB:', err);
    return null;
  }
}

export async function deleteMediaFile(id: string): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to delete media from IndexedDB:', err);
  }
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
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 360;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.82);
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
