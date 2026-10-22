import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function startServer() {
  const app = express();
  const isProduction = process.env.NODE_ENV === "production";
  const PORT = isProduction ? Number(process.env.PORT) || 8080 : 3e3;
  app.use(express.json({ limit: "100mb" }));
  app.use(express.urlencoded({ extended: true, limit: "100mb" }));
  const uploadsDir = path.resolve(__dirname, "public/uploads");
  const dataDir = path.resolve(__dirname, "src/data");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const photosJsonPath = path.resolve(dataDir, "serverPhotos.json");
  if (!fs.existsSync(photosJsonPath)) {
    fs.writeFileSync(photosJsonPath, JSON.stringify({ galleryPhotos: [], slotPhotos: {} }, null, 2));
  }
  app.get("/api/status", (_req, res) => {
    try {
      let photoCount = 0;
      if (fs.existsSync(photosJsonPath)) {
        const data = JSON.parse(fs.readFileSync(photosJsonPath, "utf-8"));
        photoCount = (data.galleryPhotos || []).length;
      }
      return res.json({
        status: "online",
        isProduction,
        photoCount,
        uploadsDirExists: fs.existsSync(uploadsDir)
      });
    } catch {
      return res.json({ status: "online", isProduction, photoCount: 0 });
    }
  });
  app.get("/api/photos", (_req, res) => {
    try {
      if (fs.existsSync(photosJsonPath)) {
        const raw = fs.readFileSync(photosJsonPath, "utf-8");
        const parsed = JSON.parse(raw);
        return res.json(parsed);
      }
      return res.json({ galleryPhotos: [], slotPhotos: {} });
    } catch (err) {
      console.error("Failed reading photos.json:", err);
      return res.status(500).json({ error: "Failed reading server photos" });
    }
  });
  app.post("/api/photos/sync", async (req, res) => {
    try {
      const { galleryPhotos = [], slotPhotos = {}, blobs = {} } = req.body;
      const idToUrlMap = {};
      const entries = Object.entries(blobs);
      for (const [id, blobInfo] of entries) {
        try {
          if (!blobInfo || !blobInfo.base64) continue;
          const match = blobInfo.base64.match(/^data:([^;]+);base64,(.+)$/);
          const rawBase64 = match ? match[2] : blobInfo.base64;
          const mime = match ? match[1] : blobInfo.type || "image/jpeg";
          let ext = "jpg";
          if (mime.includes("png")) ext = "png";
          else if (mime.includes("webp")) ext = "webp";
          else if (mime.includes("mp4")) ext = "mp4";
          else if (mime.includes("svg")) ext = "svg";
          const sanitizedId = id.replace(/[^a-zA-Z0-9_-]/g, "_");
          const fileName = `${sanitizedId}.${ext}`;
          const filePath = path.resolve(uploadsDir, fileName);
          fs.writeFileSync(filePath, Buffer.from(rawBase64, "base64"));
          idToUrlMap[id] = `/uploads/${fileName}`;
        } catch (blobErr) {
          console.error(`Failed to save blob ${id}:`, blobErr);
        }
      }
      const updatedGallery = galleryPhotos.map((item) => {
        const directUrl = idToUrlMap[item.id];
        if (directUrl) {
          return {
            ...item,
            url: directUrl,
            videoUrl: item.mediaType === "video" ? directUrl : item.videoUrl
          };
        }
        return item;
      });
      const updatedSlots = {};
      for (const [slotKey, slotData] of Object.entries(slotPhotos)) {
        const blobKey = `slot-${slotKey}`;
        const slotUrl = idToUrlMap[blobKey];
        if (slotUrl) {
          updatedSlots[slotKey] = {
            ...slotData,
            url: slotUrl,
            videoUrl: slotData.mediaType === "video" ? slotUrl : slotData.videoUrl
          };
        } else {
          updatedSlots[slotKey] = slotData;
        }
      }
      let currentData = {
        galleryPhotos: [],
        slotPhotos: {}
      };
      if (fs.existsSync(photosJsonPath)) {
        try {
          currentData = JSON.parse(fs.readFileSync(photosJsonPath, "utf-8"));
        } catch {
        }
      }
      const existingIds = new Set((currentData.galleryPhotos || []).map((p) => p.id));
      const mergedGallery = [...currentData.galleryPhotos || []];
      for (const item of updatedGallery) {
        if (!existingIds.has(item.id)) {
          mergedGallery.unshift(item);
          existingIds.add(item.id);
        } else {
          const idx = mergedGallery.findIndex((p) => p.id === item.id);
          if (idx !== -1) mergedGallery[idx] = item;
        }
      }
      const mergedSlots = { ...currentData.slotPhotos || {}, ...updatedSlots };
      const finalData = {
        galleryPhotos: mergedGallery,
        slotPhotos: mergedSlots,
        lastSyncedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      fs.writeFileSync(photosJsonPath, JSON.stringify(finalData, null, 2));
      return res.json({
        success: true,
        savedFilesCount: Object.keys(idToUrlMap).length,
        totalGallery: mergedGallery.length,
        totalSlots: Object.keys(mergedSlots).length
      });
    } catch (err) {
      console.error("Batch sync error:", err);
      return res.status(500).json({ error: err?.message || "Sync failed" });
    }
  });
  app.post("/api/photos/sync-chunk", async (req, res) => {
    try {
      const { items = [] } = req.body;
      if (!Array.isArray(items) || items.length === 0) {
        return res.json({ success: true, processed: 0 });
      }
      let currentData = {
        galleryPhotos: [],
        slotPhotos: {}
      };
      if (fs.existsSync(photosJsonPath)) {
        try {
          currentData = JSON.parse(fs.readFileSync(photosJsonPath, "utf-8"));
        } catch {
        }
      }
      if (!Array.isArray(currentData.galleryPhotos)) currentData.galleryPhotos = [];
      if (!currentData.slotPhotos || typeof currentData.slotPhotos !== "object") currentData.slotPhotos = {};
      const processedItems = [];
      for (const item of items) {
        try {
          const { id, type = "gallery", slotKey, data = {}, base64, mimeType = "image/jpeg" } = item;
          let permanentUrl = data.url;
          if (base64) {
            const match = base64.match(/^data:([^;]+);base64,(.+)$/);
            const rawBase64 = match ? match[2] : base64;
            const mime = match ? match[1] : mimeType;
            let ext = "jpg";
            if (mime.includes("png")) ext = "png";
            else if (mime.includes("webp")) ext = "webp";
            else if (mime.includes("mp4")) ext = "mp4";
            else if (mime.includes("svg")) ext = "svg";
            const sanitizedId = String(id || slotKey || Date.now()).replace(/[^a-zA-Z0-9_-]/g, "_");
            const fileName = `${sanitizedId}.${ext}`;
            const filePath = path.resolve(uploadsDir, fileName);
            fs.writeFileSync(filePath, Buffer.from(rawBase64, "base64"));
            permanentUrl = `/uploads/${fileName}`;
          }
          if (type === "slot" && slotKey) {
            currentData.slotPhotos[slotKey] = {
              ...data,
              url: permanentUrl,
              videoUrl: data.mediaType === "video" ? permanentUrl : data.videoUrl
            };
            processedItems.push({ slotKey, url: permanentUrl });
          } else {
            const galleryItem = {
              ...data,
              id: id || data.id,
              url: permanentUrl,
              videoUrl: data.mediaType === "video" ? permanentUrl : data.videoUrl,
              isUserUploaded: true
            };
            const existingIdx = currentData.galleryPhotos.findIndex((p) => p.id === galleryItem.id);
            if (existingIdx !== -1) {
              currentData.galleryPhotos[existingIdx] = galleryItem;
            } else {
              currentData.galleryPhotos.unshift(galleryItem);
            }
            processedItems.push({ id: galleryItem.id, url: permanentUrl });
          }
        } catch (itemErr) {
          console.error("Error processing chunk item:", itemErr);
        }
      }
      fs.writeFileSync(photosJsonPath, JSON.stringify(currentData, null, 2));
      return res.json({
        success: true,
        processed: processedItems.length,
        totalGallery: currentData.galleryPhotos.length,
        totalSlots: Object.keys(currentData.slotPhotos).length,
        processedItems
      });
    } catch (err) {
      console.error("Chunk sync error:", err);
      return res.status(500).json({ error: err?.message || "Chunk sync failed" });
    }
  });
  app.post("/api/photos/upload", async (req, res) => {
    try {
      const {
        id,
        base64,
        mimeType = "image/jpeg",
        title,
        category = "church",
        caption = "",
        mediaType = "photo",
        focalPoint,
        zoom = 1,
        eventDetails
      } = req.body;
      if (!base64 || !id) {
        return res.status(400).json({ error: "Missing id or base64 data" });
      }
      const match = base64.match(/^data:([^;]+);base64,(.+)$/);
      const rawBase64 = match ? match[2] : base64;
      const mime = match ? match[1] : mimeType;
      let ext = "jpg";
      if (mime.includes("png")) ext = "png";
      else if (mime.includes("webp")) ext = "webp";
      else if (mime.includes("mp4")) ext = "mp4";
      else if (mime.includes("svg")) ext = "svg";
      const sanitizedId = String(id).replace(/[^a-zA-Z0-9_-]/g, "_");
      const fileName = `${sanitizedId}.${ext}`;
      const filePath = path.resolve(uploadsDir, fileName);
      fs.writeFileSync(filePath, Buffer.from(rawBase64, "base64"));
      const permanentUrl = `/uploads/${fileName}`;
      const newPhotoItem = {
        id: sanitizedId,
        url: permanentUrl,
        title: title || "Church Photograph",
        category,
        caption,
        uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
        isUserUploaded: true,
        mediaType,
        videoUrl: mediaType === "video" ? permanentUrl : void 0,
        focalPoint: focalPoint || { x: 50, y: 50 },
        zoom: zoom || 1,
        eventDetails
      };
      let currentData = { galleryPhotos: [], slotPhotos: {} };
      if (fs.existsSync(photosJsonPath)) {
        try {
          currentData = JSON.parse(fs.readFileSync(photosJsonPath, "utf-8"));
        } catch {
        }
      }
      currentData.galleryPhotos = [newPhotoItem, ...currentData.galleryPhotos.filter((p) => p.id !== sanitizedId)];
      fs.writeFileSync(photosJsonPath, JSON.stringify(currentData, null, 2));
      return res.json({ success: true, photo: newPhotoItem });
    } catch (err) {
      console.error("Direct upload error:", err);
      return res.status(500).json({ error: err?.message || "Upload failed" });
    }
  });
  app.post("/api/photos/upload-logo", async (req, res) => {
    try {
      const { type = "church", base64, mimeType = "image/png" } = req.body;
      if (!base64) {
        return res.status(400).json({ error: "Missing logo base64 image data" });
      }
      const match = base64.match(/^data:([^;]+);base64,(.+)$/);
      const rawBase64 = match ? match[2] : base64;
      const detectedMime = match ? match[1] : mimeType;
      let ext = "png";
      if (detectedMime.includes("svg")) ext = "svg";
      else if (detectedMime.includes("webp")) ext = "webp";
      else if (detectedMime.includes("jpeg") || detectedMime.includes("jpg")) ext = "jpg";
      const fileBaseName = `${type}-logo.${ext}`;
      const destPath = path.resolve(uploadsDir, fileBaseName);
      fs.writeFileSync(destPath, Buffer.from(rawBase64, "base64"));
      const logoAssetsDir = path.resolve(__dirname, "public/assets/logo");
      if (!fs.existsSync(logoAssetsDir)) fs.mkdirSync(logoAssetsDir, { recursive: true });
      fs.writeFileSync(path.resolve(logoAssetsDir, fileBaseName), Buffer.from(rawBase64, "base64"));
      const permanentUrl = `/uploads/${fileBaseName}`;
      let currentData = { churchLogoUrl: null, schoolLogoUrl: null, galleryPhotos: [], slotPhotos: {} };
      if (fs.existsSync(photosJsonPath)) {
        try {
          currentData = JSON.parse(fs.readFileSync(photosJsonPath, "utf-8"));
        } catch {
        }
      }
      if (type === "church") {
        currentData.churchLogoUrl = permanentUrl;
      } else {
        currentData.schoolLogoUrl = permanentUrl;
      }
      currentData.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
      fs.writeFileSync(photosJsonPath, JSON.stringify(currentData, null, 2));
      return res.json({
        success: true,
        url: permanentUrl,
        type,
        message: `${type === "church" ? "Church Logo" : "School Logo"} permanently saved and published!`
      });
    } catch (err) {
      console.error("Logo upload error:", err);
      return res.status(500).json({ error: err?.message || "Logo upload failed" });
    }
  });
  app.post("/api/photos/reset-logo", async (req, res) => {
    try {
      const { type = "church" } = req.body;
      let currentData = { churchLogoUrl: null, schoolLogoUrl: null, galleryPhotos: [], slotPhotos: {} };
      if (fs.existsSync(photosJsonPath)) {
        try {
          currentData = JSON.parse(fs.readFileSync(photosJsonPath, "utf-8"));
        } catch {
        }
      }
      if (type === "church") {
        currentData.churchLogoUrl = null;
      } else {
        currentData.schoolLogoUrl = null;
      }
      currentData.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
      fs.writeFileSync(photosJsonPath, JSON.stringify(currentData, null, 2));
      const defaultUrl = type === "church" ? "/vrai-church-logo.svg" : "/victorious-heritage-school-logo.svg";
      return res.json({ success: true, url: defaultUrl, type });
    } catch (err) {
      console.error("Logo reset error:", err);
      return res.status(500).json({ error: err?.message || "Logo reset failed" });
    }
  });
  app.use("/uploads", express.static(uploadsDir));
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, "dist");
    app.use(express.static(distDir));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distDir, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\u{1F680} VRAI Full-Stack Server listening on port ${PORT} (isProduction: ${isProduction})`);
  });
}
startServer();
