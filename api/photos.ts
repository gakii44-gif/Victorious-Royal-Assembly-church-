import serverPhotosData from '../src/data/serverPhotos.json';

// Vercel Serverless Function handler for /api/photos
export default function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json(serverPhotosData || {
    churchLogoUrl: '/uploads/church-logo.jpg',
    schoolLogoUrl: '/uploads/school-logo.jpg',
    galleryPhotos: [],
    slotPhotos: {},
  });
}
