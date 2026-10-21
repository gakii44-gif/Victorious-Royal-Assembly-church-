import fs from 'fs';
import path from 'path';

// Vercel Serverless Function handler for /api/photos
export default function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const jsonPath = path.resolve(process.cwd(), 'src/data/serverPhotos.json');
    if (fs.existsSync(jsonPath)) {
      const content = fs.readFileSync(jsonPath, 'utf-8');
      return res.status(200).json(JSON.parse(content));
    }
    return res.status(200).json({
      churchLogoUrl: null,
      schoolLogoUrl: null,
      galleryPhotos: [],
      slotPhotos: {},
    });
  } catch (error: any) {
    console.error('Vercel api/photos error:', error);
    return res.status(500).json({ error: 'Failed to retrieve server photos' });
  }
}
