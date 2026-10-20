import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const isProduction = process.env.NODE_ENV === 'production';
  // Dev server must run on port 3000. Production on Cloud Run listens on process.env.PORT (default 8080).
  const PORT = isProduction ? (Number(process.env.PORT) || 8080) : 3000;

  // Support up to 100MB payload for photo & video uploads
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ extended: true, limit: '100mb' }));

  // Ensure directories exist
  const uploadsDir = path.resolve(__dirname, 'public/uploads');
  const dataDir = path.resolve(__dirname, 'src/data');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const photosJsonPath = path.resolve(dataDir, 'serverPhotos.json');
  if (!fs.existsSync(photosJsonPath)) {
    fs.writeFileSync(photosJsonPath, JSON.stringify({ galleryPhotos: [], slotPhotos: {} }, null, 2));
  }

  // --- API ROUTES ---

  // 1. Health check & status
  app.get('/api/status', (_req: Request, res: Response) => {
    try {
      let photoCount = 0;
      if (fs.existsSync(photosJsonPath)) {
        const data = JSON.parse(fs.readFileSync(photosJsonPath, 'utf-8'));
        photoCount = (data.galleryPhotos || []).length;
      }
      return res.json({
        status: 'online',
        isProduction,
        photoCount,
        uploadsDirExists: fs.existsSync(uploadsDir)
      });
    } catch {
      return res.json({ status: 'online', isProduction, photoCount: 0 });
    }
  });

  // 2. GET all server-persisted photos and slot configurations
  app.get('/api/photos', (_req: Request, res: Response) => {
    try {
      if (fs.existsSync(photosJsonPath)) {
        const raw = fs.readFileSync(photosJsonPath, 'utf-8');
        const parsed = JSON.parse(raw);
        return res.json(parsed);
      }
      return res.json({ galleryPhotos: [], slotPhotos: {} });
    } catch (err: any) {
      console.error('Failed reading photos.json:', err);
      return res.status(500).json({ error: 'Failed reading server photos' });
    }
  });

  // 3. POST /api/photos/sync: Batch sync from preview browser to permanent server
  app.post('/api/photos/sync', async (req: Request, res: Response) => {
    try {
      const { galleryPhotos = [], slotPhotos = {}, blobs = {} } = req.body;
      
      const idToUrlMap: Record<string, string> = {};
      const entries = Object.entries(blobs as Record<string, { base64: string; type?: string }>);

      for (const [id, blobInfo] of entries) {
        try {
          if (!blobInfo || !blobInfo.base64) continue;
          const match = blobInfo.base64.match(/^data:([^;]+);base64,(.+)$/);
          const rawBase64 = match ? match[2] : blobInfo.base64;
          const mime = match ? match[1] : (blobInfo.type || 'image/jpeg');
          
          let ext = 'jpg';
          if (mime.includes('png')) ext = 'png';
          else if (mime.includes('webp')) ext = 'webp';
          else if (mime.includes('mp4')) ext = 'mp4';
          else if (mime.includes('svg')) ext = 'svg';

          const sanitizedId = id.replace(/[^a-zA-Z0-9_-]/g, '_');
          const fileName = `${sanitizedId}.${ext}`;
          const filePath = path.resolve(uploadsDir, fileName);

          fs.writeFileSync(filePath, Buffer.from(rawBase64, 'base64'));
          idToUrlMap[id] = `/uploads/${fileName}`;
        } catch (blobErr) {
          console.error(`Failed to save blob ${id}:`, blobErr);
        }
      }

      // Update gallery items to point to permanent /uploads/ URLs
      const updatedGallery = (galleryPhotos as any[]).map((item) => {
        const directUrl = idToUrlMap[item.id];
        if (directUrl) {
          return {
            ...item,
            url: directUrl,
            videoUrl: item.mediaType === 'video' ? directUrl : item.videoUrl,
          };
        }
        return item;
      });

      // Update slot items
      const updatedSlots: Record<string, any> = {};
      for (const [slotKey, slotData] of Object.entries(slotPhotos as Record<string, any>)) {
        const blobKey = `slot-${slotKey}`;
        const slotUrl = idToUrlMap[blobKey];
        if (slotUrl) {
          updatedSlots[slotKey] = {
            ...slotData,
            url: slotUrl,
            videoUrl: slotData.mediaType === 'video' ? slotUrl : slotData.videoUrl,
          };
        } else {
          updatedSlots[slotKey] = slotData;
        }
      }

      // Merge with existing server records
      let currentData: { galleryPhotos: any[]; slotPhotos: Record<string, any> } = {
        galleryPhotos: [],
        slotPhotos: {}
      };

      if (fs.existsSync(photosJsonPath)) {
        try {
          currentData = JSON.parse(fs.readFileSync(photosJsonPath, 'utf-8'));
        } catch {}
      }

      const existingIds = new Set((currentData.galleryPhotos || []).map((p: any) => p.id));
      const mergedGallery = [...(currentData.galleryPhotos || [])];

      for (const item of updatedGallery) {
        if (!existingIds.has(item.id)) {
          mergedGallery.unshift(item);
          existingIds.add(item.id);
        } else {
          const idx = mergedGallery.findIndex((p: any) => p.id === item.id);
          if (idx !== -1) mergedGallery[idx] = item;
        }
      }

      const mergedSlots = { ...(currentData.slotPhotos || {}), ...updatedSlots };
      const finalData = {
        galleryPhotos: mergedGallery,
        slotPhotos: mergedSlots,
        lastSyncedAt: new Date().toISOString()
      };

      fs.writeFileSync(photosJsonPath, JSON.stringify(finalData, null, 2));

      return res.json({
        success: true,
        savedFilesCount: Object.keys(idToUrlMap).length,
        totalGallery: mergedGallery.length,
        totalSlots: Object.keys(mergedSlots).length
      });
    } catch (err: any) {
      console.error('Batch sync error:', err);
      return res.status(500).json({ error: err?.message || 'Sync failed' });
    }
  });

  // 3b. POST /api/photos/sync-chunk: Small chunked sync (resilient to Cloud Run payload limits)
  app.post('/api/photos/sync-chunk', async (req: Request, res: Response) => {
    try {
      const { items = [] } = req.body;
      if (!Array.isArray(items) || items.length === 0) {
        return res.json({ success: true, processed: 0 });
      }

      // Read current server state
      let currentData: { galleryPhotos: any[]; slotPhotos: Record<string, any> } = {
        galleryPhotos: [],
        slotPhotos: {}
      };
      if (fs.existsSync(photosJsonPath)) {
        try {
          currentData = JSON.parse(fs.readFileSync(photosJsonPath, 'utf-8'));
        } catch {}
      }
      if (!Array.isArray(currentData.galleryPhotos)) currentData.galleryPhotos = [];
      if (!currentData.slotPhotos || typeof currentData.slotPhotos !== 'object') currentData.slotPhotos = {};

      const processedItems: any[] = [];

      for (const item of items) {
        try {
          const { id, type = 'gallery', slotKey, data = {}, base64, mimeType = 'image/jpeg' } = item;
          let permanentUrl = data.url;

          if (base64) {
            const match = base64.match(/^data:([^;]+);base64,(.+)$/);
            const rawBase64 = match ? match[2] : base64;
            const mime = match ? match[1] : mimeType;

            let ext = 'jpg';
            if (mime.includes('png')) ext = 'png';
            else if (mime.includes('webp')) ext = 'webp';
            else if (mime.includes('mp4')) ext = 'mp4';
            else if (mime.includes('svg')) ext = 'svg';

            const sanitizedId = String(id || slotKey || Date.now()).replace(/[^a-zA-Z0-9_-]/g, '_');
            const fileName = `${sanitizedId}.${ext}`;
            const filePath = path.resolve(uploadsDir, fileName);

            fs.writeFileSync(filePath, Buffer.from(rawBase64, 'base64'));
            permanentUrl = `/uploads/${fileName}`;
          }

          if (type === 'slot' && slotKey) {
            currentData.slotPhotos[slotKey] = {
              ...data,
              url: permanentUrl,
              videoUrl: data.mediaType === 'video' ? permanentUrl : data.videoUrl,
            };
            processedItems.push({ slotKey, url: permanentUrl });
          } else {
            const galleryItem = {
              ...data,
              id: id || data.id,
              url: permanentUrl,
              videoUrl: data.mediaType === 'video' ? permanentUrl : data.videoUrl,
              isUserUploaded: true,
            };

            const existingIdx = currentData.galleryPhotos.findIndex((p: any) => p.id === galleryItem.id);
            if (existingIdx !== -1) {
              currentData.galleryPhotos[existingIdx] = galleryItem;
            } else {
              currentData.galleryPhotos.unshift(galleryItem);
            }
            processedItems.push({ id: galleryItem.id, url: permanentUrl });
          }
        } catch (itemErr) {
          console.error('Error processing chunk item:', itemErr);
        }
      }

      // Write updated state to disk
      fs.writeFileSync(photosJsonPath, JSON.stringify(currentData, null, 2));

      return res.json({
        success: true,
        processed: processedItems.length,
        totalGallery: currentData.galleryPhotos.length,
        totalSlots: Object.keys(currentData.slotPhotos).length,
        processedItems
      });
    } catch (err: any) {
      console.error('Chunk sync error:', err);
      return res.status(500).json({ error: err?.message || 'Chunk sync failed' });
    }
  });

  // 4. POST /api/photos/upload: Single photo upload directly to server
  app.post('/api/photos/upload', async (req: Request, res: Response) => {
    try {
      const { 
        id, 
        base64, 
        mimeType = 'image/jpeg', 
        title, 
        category = 'church', 
        caption = '', 
        mediaType = 'photo', 
        focalPoint, 
        zoom = 1.0, 
        eventDetails 
      } = req.body;

      if (!base64 || !id) {
        return res.status(400).json({ error: 'Missing id or base64 data' });
      }

      const match = base64.match(/^data:([^;]+);base64,(.+)$/);
      const rawBase64 = match ? match[2] : base64;
      const mime = match ? match[1] : mimeType;

      let ext = 'jpg';
      if (mime.includes('png')) ext = 'png';
      else if (mime.includes('webp')) ext = 'webp';
      else if (mime.includes('mp4')) ext = 'mp4';
      else if (mime.includes('svg')) ext = 'svg';

      const sanitizedId = String(id).replace(/[^a-zA-Z0-9_-]/g, '_');
      const fileName = `${sanitizedId}.${ext}`;
      const filePath = path.resolve(uploadsDir, fileName);

      fs.writeFileSync(filePath, Buffer.from(rawBase64, 'base64'));
      const permanentUrl = `/uploads/${fileName}`;

      const newPhotoItem = {
        id: sanitizedId,
        url: permanentUrl,
        title: title || 'Church Photograph',
        category,
        caption,
        uploadedAt: new Date().toISOString(),
        isUserUploaded: true,
        mediaType,
        videoUrl: mediaType === 'video' ? permanentUrl : undefined,
        focalPoint: focalPoint || { x: 50, y: 50 },
        zoom: zoom || 1.0,
        eventDetails,
      };

      // Read, update, and write serverPhotos.json
      let currentData = { galleryPhotos: [] as any[], slotPhotos: {} as Record<string, any> };
      if (fs.existsSync(photosJsonPath)) {
        try {
          currentData = JSON.parse(fs.readFileSync(photosJsonPath, 'utf-8'));
        } catch {}
      }

      currentData.galleryPhotos = [newPhotoItem, ...currentData.galleryPhotos.filter(p => p.id !== sanitizedId)];
      fs.writeFileSync(photosJsonPath, JSON.stringify(currentData, null, 2));

      return res.json({ success: true, photo: newPhotoItem });
    } catch (err: any) {
      console.error('Direct upload error:', err);
      return res.status(500).json({ error: err?.message || 'Upload failed' });
    }
  });

  // Serve static uploads
  app.use('/uploads', express.static(uploadsDir));

  // Serve the frontend
  if (!isProduction) {
    // Development mode: mount Vite middlewares for instant HMR and JSX handling
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: serve built assets from dist/
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 VRAI Full-Stack Server listening on port ${PORT} (isProduction: ${isProduction})`);
  });
}

startServer();
