import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  saveMediaFile, 
  getMediaFile, 
  deleteMediaFile, 
  getAllMediaBlobKeys,
  saveGalleryItemsToIDB, 
  loadGalleryItemsFromIDB, 
  saveSlotPhotosToIDB, 
  loadSlotPhotosFromIDB,
  createCompactThumbnail,
  generateVideoThumbnail 
} from '../utils/mediaStorage';
import initialServerPhotos from '../data/serverPhotos.json';

export type GalleryCategory = 
  | 'victorious-heritage' 
  | 'church' 
  | 'church-events' 
  | 'women' 
  | 'vocational' 
  | 'life-at-heritage'
  | 'heritage'; // backward compatibility alias for victorious-heritage
export type MediaType = 'photo' | 'video';

export interface FocalPoint {
  x: number; // 0% to 100% horizontal focal center
  y: number; // 0% to 100% vertical focal center
}

export interface ChurchEventDetails {
  eventType: 'wedding' | 'anniversary' | 'thanksgiving' | 'dedication' | 'milestone';
  celebrants?: string; // e.g. "Mr. & Mrs. Deng", "Pastor & First Lady"
  eventDate?: string;
  anniversaryYears?: string | number; // e.g. "10th Wedding Anniversary"
}

export interface GalleryPhotoItem {
  id: string;
  url: string; // Image URL/ObjectURL or Video Poster Thumbnail
  title: string;
  category: GalleryCategory;
  caption?: string;
  uploadedAt: string;
  isUserUploaded: boolean;
  mediaType?: MediaType;
  videoUrl?: string; // Runtime playback URL for videos
  duration?: string; // E.g. "0:45", "1:15"
  fileSize?: string;
  focalPoint?: FocalPoint; // Draggable focal position to center faces
  zoom?: number; // Framing scale zoom multiplier (1.0 to 2.5)
  eventDetails?: ChurchEventDetails;
}

export interface PhotoData {
  url: string;
  alt?: string;
  uploadedAt: string;
  mediaType?: MediaType;
  videoUrl?: string;
  focalPoint?: FocalPoint;
  zoom?: number;
}

export interface FocalAdjustTarget {
  type: 'slot' | 'gallery';
  keyOrId: string;
  url: string;
  title: string;
  focalPoint?: FocalPoint;
  zoom?: number;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:2' | '21:9';
}

export interface SyncProgress {
  current: number;
  total: number;
  percent: number;
  message: string;
}

interface PhotoContextType {
  // Slot-based single uploads (for hero banners, specific page cards)
  photos: Record<string, PhotoData>;
  uploadPhoto: (slotKey: string, file: File, alt?: string) => Promise<string>;
  removePhoto: (slotKey: string) => void;
  getPhoto: (slotKey: string) => PhotoData | null;
  updatePhotoFocalPoint: (slotKey: string, focalPoint: FocalPoint, zoom?: number) => void;
  activeUploadSlot: string | null;
  openUploadModal: (slotKey: string, label?: string) => void;
  closeUploadModal: () => void;
  uploadModalLabel: string;

  // Categorized Multi-Photo & Video Gallery
  galleryPhotos: GalleryPhotoItem[];
  uploadMultipleGalleryMedia: (
    files: FileList | File[],
    category: GalleryCategory,
    defaultTitle?: string
  ) => Promise<GalleryPhotoItem[]>;
  uploadMultipleGalleryPhotos: (
    files: FileList | File[],
    category: GalleryCategory,
    defaultTitle?: string
  ) => Promise<GalleryPhotoItem[]>;
  removeGalleryPhoto: (id: string) => void;
  updateGalleryPhoto: (id: string, updates: Partial<GalleryPhotoItem>) => void;
  updateGalleryPhotoFocalPoint: (id: string, focalPoint: FocalPoint, zoom?: number) => void;
  replaceGalleryMedia: (
    id: string,
    file: File,
    updates?: { title?: string; category?: GalleryCategory; caption?: string }
  ) => Promise<GalleryPhotoItem | null>;
  resetDefaultGalleryPhotos: () => void;
  
  // Multi-upload modal states
  isMultiUploadOpen: boolean;
  openMultiUploadModal: (defaultCategory?: GalleryCategory) => void;
  closeMultiUploadModal: () => void;
  multiUploadDefaultCategory: GalleryCategory;

  // Dedicated Church Event (Weddings & Anniversaries) Upload Modal
  isChurchEventUploadOpen: boolean;
  openChurchEventUploadModal: (eventType?: 'wedding' | 'anniversary' | 'church-anniversary' | 'thanksgiving' | 'dedication') => void;
  closeChurchEventUploadModal: () => void;
  churchEventDefaultType: 'wedding' | 'anniversary' | 'church-anniversary' | 'thanksgiving' | 'dedication';

  // Interactive Photo Framing & Face Repositioning Modal
  focalAdjustTarget: FocalAdjustTarget | null;
  openFocalAdjustModal: (target: FocalAdjustTarget) => void;
  closeFocalAdjustModal: () => void;

  // Photo Transfer & Sync Center Modal
  isPhotoSyncOpen: boolean;
  openPhotoSyncModal: () => void;
  closePhotoSyncModal: () => void;
  syncAllPhotosToServer: (onProgress?: (progress: SyncProgress) => void) => Promise<{ success: boolean; count: number; error?: string }>;
  isSyncingToServer: boolean;
  serverPhotoCount: number;

  // Storage hydration state
  isStorageReady: boolean;
  diagnoseImageUrls: () => Promise<void>;

  // Dedicated Official Church & School Logo Management
  churchLogoUrl: string;
  schoolLogoUrl: string;
  uploadChurchLogo: (file: File) => Promise<string>;
  uploadSchoolLogo: (file: File) => Promise<string>;
  resetChurchLogo: () => void;
  resetSchoolLogo: () => void;
  isChurchLogoCustom: boolean;
  isSchoolLogoCustom: boolean;

  // Staff / Public mode separation
  isEditorMode: boolean;
  setIsEditorMode: (val: boolean) => void;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

const STORAGE_KEY_SLOTS = 'vrai_church_uploaded_photos';
const STORAGE_KEY_GALLERY = 'vrai_church_gallery_photos';
const STORAGE_KEY_CHURCH_LOGO = 'vrai_church_custom_logo_key';
const STORAGE_KEY_SCHOOL_LOGO = 'vrai_school_custom_logo_key';

const DEFAULT_CHURCH_LOGO_URL = '/uploads/church-logo.jpg';
const DEFAULT_SCHOOL_LOGO_URL = '/uploads/school-logo.jpg';

// Default slot fallbacks committed directly into the repository
export const DEFAULT_SLOT_FALLBACKS: Record<string, PhotoData> = {
  'hero_church': {
    url: '/assets/church/services/hero-church.svg',
    alt: 'Victorious Royal Assembly International Sanctuary & Altar',
    uploadedAt: '2026-10-01T00:00:00.000Z',
    focalPoint: { x: 50, y: 35 },
    zoom: 1.0,
  },
  'about_worship': {
    url: '/assets/church/services/sunday-worship.svg',
    alt: 'Sunday Celebration Worship Altar',
    uploadedAt: '2026-10-01T00:00:00.000Z',
    focalPoint: { x: 50, y: 40 },
    zoom: 1.0,
  },
  'school_assembly': {
    url: '/assets/schools/heritage-academy/morning-assembly.svg',
    alt: 'Victorious Heritage Primary School Morning Assembly',
    uploadedAt: '2026-10-01T00:00:00.000Z',
    focalPoint: { x: 50, y: 50 },
    zoom: 1.0,
  },
  'school_classroom': {
    url: '/assets/schools/heritage-academy/classroom-reading.svg',
    alt: 'Classroom Literacy & Numeracy Instruction',
    uploadedAt: '2026-10-01T00:00:00.000Z',
    focalPoint: { x: 50, y: 50 },
    zoom: 1.0,
  },
  'school_nutrition': {
    url: '/assets/schools/heritage-academy/school-nutrition.svg',
    alt: 'Pupil Nutrition & Midday Porridge Meal Program',
    uploadedAt: '2026-10-01T00:00:00.000Z',
    focalPoint: { x: 50, y: 45 },
    zoom: 1.0,
  },
  'school_expansion': {
    url: '/assets/schools/heritage-academy/classroom-expansion.svg',
    alt: 'Classroom Desks & Facility Upgrades',
    uploadedAt: '2026-10-01T00:00:00.000Z',
    focalPoint: { x: 50, y: 50 },
    zoom: 1.0,
  },
  'women_fellowship': {
    url: '/assets/church/fellowships/women-fellowship.svg',
    alt: 'Women Fellowship & Mothers Union',
    uploadedAt: '2026-10-01T00:00:00.000Z',
    focalPoint: { x: 50, y: 35 },
    zoom: 1.05,
  },
  'vocational_tailoring': {
    url: '/assets/vocational/tailoring.svg',
    alt: 'Tailoring & Garment Design Training',
    uploadedAt: '2026-10-01T00:00:00.000Z',
    focalPoint: { x: 50, y: 45 },
    zoom: 1.0,
  },
  'vocational_carpentry': {
    url: '/assets/vocational/carpentry.svg',
    alt: 'Carpentry & Joinery Workshop',
    uploadedAt: '2026-10-01T00:00:00.000Z',
    focalPoint: { x: 50, y: 50 },
    zoom: 1.0,
  },
  'vocational_solar': {
    url: '/assets/vocational/solar-electrical.svg',
    alt: 'Solar PV & Electrical Systems Training',
    uploadedAt: '2026-10-01T00:00:00.000Z',
    focalPoint: { x: 50, y: 50 },
    zoom: 1.0,
  },
  'event_wedding': {
    url: '/assets/events/church-wedding.svg',
    alt: 'Holy Matrimony & Nuptials',
    uploadedAt: '2026-10-01T00:00:00.000Z',
    focalPoint: { x: 50, y: 30 },
    zoom: 1.1,
  },
  'event_anniversary': {
    url: '/assets/events/wedding-anniversary.svg',
    alt: 'Wedding Anniversary Celebration',
    uploadedAt: '2026-10-01T00:00:00.000Z',
    focalPoint: { x: 50, y: 30 },
    zoom: 1.1,
  },
  'event_church_anniversary': {
    url: '/assets/events/church-anniversary.svg',
    alt: 'Church Annual Convention & Jubilee',
    uploadedAt: '2026-10-01T00:00:00.000Z',
    focalPoint: { x: 50, y: 40 },
    zoom: 1.0,
  },
  'event_thanksgiving': {
    url: '/assets/events/thanksgiving-dedication.svg',
    alt: 'Thanksgiving & Child Dedication',
    uploadedAt: '2026-10-01T00:00:00.000Z',
    focalPoint: { x: 50, y: 35 },
    zoom: 1.0,
  },
};

// Default initial curated gallery archives (all pointing to real bundled repo assets)
const DEFAULT_GALLERY_PHOTOS: GalleryPhotoItem[] = [
  // 1. Church Events & Celebrations (Weddings, Anniversaries, Milestones)
  {
    id: 'event-wedding-covenant',
    url: '/assets/events/church-wedding.svg',
    title: 'Holy Matrimony & Covenant Wedding Ceremony',
    category: 'church-events',
    caption: 'Joyful wedding nuptials celebrated at the Victorious Royal Assembly altar in Juba. What God has joined together, let not man put asunder.',
    uploadedAt: '2026-10-01T10:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
    focalPoint: { x: 50, y: 30 },
    zoom: 1.1,
    eventDetails: {
      eventType: 'wedding',
      celebrants: 'Church Members Holy Matrimony',
      eventDate: '2026-09-18',
    }
  },
  {
    id: 'event-wedding-anniversary',
    url: '/assets/events/wedding-anniversary.svg',
    title: 'Silver & Golden Wedding Anniversary Blessings',
    category: 'church-events',
    caption: 'Couples renewing covenant vows and celebrating enduring marriage grace at the Word of Faith healing altar.',
    uploadedAt: '2026-10-02T11:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
    focalPoint: { x: 50, y: 30 },
    zoom: 1.1,
    eventDetails: {
      eventType: 'anniversary',
      celebrants: 'Covenant Marriage Couples',
      anniversaryYears: '25th Silver Jubilee',
      eventDate: '2026-08-22',
    }
  },
  {
    id: 'event-church-jubilee',
    url: '/assets/events/church-anniversary.svg',
    title: 'Church Annual Convention & Jubilee Thanksgiving',
    category: 'church-events',
    caption: 'Victorious Royal Assembly International annual thanksgiving convention, celebrating ministry expansion, healing testimonies, and spiritual fruitfulness in South Sudan.',
    uploadedAt: '2026-10-03T09:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
    focalPoint: { x: 50, y: 40 },
    zoom: 1.0,
    eventDetails: {
      eventType: 'milestone',
      celebrants: 'Victorious Royal Assembly Assembly',
      eventDate: '2026-07-15',
    }
  },
  {
    id: 'event-child-dedication',
    url: '/assets/events/thanksgiving-dedication.svg',
    title: 'Altar Thanksgiving & Child Dedications',
    category: 'church-events',
    caption: 'Pastoral altar blessing and child dedication services presenting newborns unto the Lord in thanksgiving.',
    uploadedAt: '2026-10-04T11:30:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
    focalPoint: { x: 50, y: 35 },
    zoom: 1.0,
    eventDetails: {
      eventType: 'dedication',
      celebrants: 'Dedicated Children & Families',
      eventDate: '2026-09-05',
    }
  },

  // 2. Victorious Heritage (Nursery & Primary School & Adult Education)
  {
    id: 'heritage-assembly',
    url: '/assets/schools/heritage-academy/morning-assembly.svg',
    title: 'Victorious Heritage Morning Assembly & Prayer',
    category: 'victorious-heritage',
    caption: 'Primary school pupils and teachers gathering for morning devotions, scripture reading, and South Sudan national anthem.',
    uploadedAt: '2026-10-01T08:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
    focalPoint: { x: 50, y: 50 },
    zoom: 1.0,
  },
  {
    id: 'heritage-classroom',
    url: '/assets/schools/heritage-academy/classroom-reading.svg',
    title: 'Classroom Literacy & Science Lesson',
    category: 'victorious-heritage',
    caption: 'Pupils engaged in English, mathematics, and South Sudan national curriculum studies.',
    uploadedAt: '2026-10-02T09:30:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
    focalPoint: { x: 50, y: 45 },
    zoom: 1.0,
  },
  {
    id: 'heritage-nutrition',
    url: '/assets/schools/heritage-academy/school-nutrition.svg',
    title: 'Pupil Nutrition & Midday Meal Program',
    category: 'victorious-heritage',
    caption: 'Daily nutritious morning porridge and meals served to support active learning and pupil health.',
    uploadedAt: '2026-10-03T12:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
    focalPoint: { x: 50, y: 45 },
    zoom: 1.0,
  },
  {
    id: 'heritage-expansion',
    url: '/assets/schools/heritage-academy/classroom-expansion.svg',
    title: 'Classroom Desks & Facility Upgrades',
    category: 'victorious-heritage',
    caption: 'Wooden dual writing desks built by local craftsmen to ensure no child sits on the floor.',
    uploadedAt: '2026-10-04T14:15:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
    focalPoint: { x: 50, y: 50 },
    zoom: 1.0,
  },
  {
    id: 'heritage-video-sample',
    url: '/assets/schools/heritage-academy/classroom-reading.svg',
    title: 'Pupils Singing & Worship at Morning Devotion',
    category: 'victorious-heritage',
    caption: 'Video highlight of pupils praising and singing hymns before morning classes in Juba.',
    uploadedAt: '2026-10-05T08:15:00.000Z',
    isUserUploaded: false,
    mediaType: 'video',
    duration: '1:24',
    focalPoint: { x: 50, y: 45 },
  },

  // 3. Church Photos & Videos
  {
    id: 'church-worship',
    url: '/assets/church/services/sunday-worship.svg',
    title: 'Sunday Worship & Word of Faith Altar',
    category: 'church',
    caption: 'Victorious Royal Assembly congregation gathered for Sunday morning praise, healing, and anointed preaching.',
    uploadedAt: '2026-10-05T10:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
    focalPoint: { x: 50, y: 40 },
    zoom: 1.0,
  },
  {
    id: 'church-healing',
    url: '/assets/church/services/hero-church.svg',
    title: 'Healing & Deliverance Altar Ministry',
    category: 'church',
    caption: 'A.k.a Word of Faith Healing & Deliverance Ministry Int’l — Altar intercession and divine restoration in Juba.',
    uploadedAt: '2026-10-06T11:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
    focalPoint: { x: 50, y: 35 },
    zoom: 1.0,
  },
  {
    id: 'church-communion',
    url: '/assets/church/services/sunday-worship.svg',
    title: 'Holy Communion & Covenant Service',
    category: 'church',
    caption: 'Breaking bread and receiving covenant blessings at the altar on former Nilepet Road, Tongping.',
    uploadedAt: '2026-10-07T11:30:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
    focalPoint: { x: 50, y: 40 },
    zoom: 1.0,
  },
  {
    id: 'church-video-sample',
    url: '/assets/church/services/hero-church.svg',
    title: 'Anointed Worship & Choir Praise Video',
    category: 'church',
    caption: 'Video clip of the choir leading the assembly in uplifting African gospel worship.',
    uploadedAt: '2026-10-08T10:30:00.000Z',
    isUserUploaded: false,
    mediaType: 'video',
    duration: '1:45',
    focalPoint: { x: 50, y: 35 },
  },

  // 4. Women Section Photos & Videos
  {
    id: 'women-anniversary',
    url: '/assets/church/fellowships/women-fellowship.svg',
    title: 'Women Fellowship Annual Anniversary',
    category: 'women',
    caption: 'Sisters dressed in matching African print commemorative fabrics celebrating grace and unity.',
    uploadedAt: '2026-10-09T14:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
    focalPoint: { x: 50, y: 35 },
    zoom: 1.05,
  },
  {
    id: 'women-prayer',
    url: '/assets/church/fellowships/women-fellowship.svg',
    title: 'Mothers Intercessory Vigil & Prayer Altar',
    category: 'women',
    caption: 'Faithful women interceding for families, children, church growth, and peace in South Sudan.',
    uploadedAt: '2026-10-10T16:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
    focalPoint: { x: 50, y: 35 },
    zoom: 1.05,
  },
  {
    id: 'women-widows',
    url: '/assets/church/fellowships/women-fellowship.svg',
    title: 'Widow Support & Food Basket Distribution',
    category: 'women',
    caption: 'Empowering vulnerable women and widows with essential food grain, cooking oil, and fellowship support.',
    uploadedAt: '2026-10-11T15:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
    focalPoint: { x: 50, y: 35 },
    zoom: 1.05,
  },
  {
    id: 'women-video-sample',
    url: '/assets/church/fellowships/women-fellowship.svg',
    title: 'Women Fellowship Dance & Thanksgiving Song',
    category: 'women',
    caption: 'Joyful video clip of the women praising the Lord with traditional South Sudanese rhythms.',
    uploadedAt: '2026-10-12T15:30:00.000Z',
    isUserUploaded: false,
    mediaType: 'video',
    duration: '1:10',
    focalPoint: { x: 50, y: 35 },
  },

  // 5. Vocational Photos & Videos
  {
    id: 'vocational-tailoring',
    url: '/assets/vocational/tailoring.svg',
    title: 'Tailoring & Garment Design Training',
    category: 'vocational',
    caption: 'Trainees learning precision machine sewing, pattern drafting, and apparel making.',
    uploadedAt: '2026-10-13T10:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
    focalPoint: { x: 50, y: 45 },
    zoom: 1.0,
  },
  {
    id: 'vocational-carpentry',
    url: '/assets/vocational/carpentry.svg',
    title: 'Carpentry & Furniture Joinery Workshop',
    category: 'vocational',
    caption: 'Youth crafting study desks, classroom benches, doors, and timber furniture.',
    uploadedAt: '2026-10-14T11:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
    focalPoint: { x: 50, y: 50 },
    zoom: 1.0,
  },
  {
    id: 'vocational-solar',
    url: '/assets/vocational/solar-electrical.svg',
    title: 'Solar Photovoltaic Technician Training',
    category: 'vocational',
    caption: 'Students assembling solar storage systems, charge controllers, and off-grid lighting.',
    uploadedAt: '2026-10-15T14:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
    focalPoint: { x: 50, y: 50 },
    zoom: 1.0,
  },
  {
    id: 'vocational-video-sample',
    url: '/assets/vocational/tailoring.svg',
    title: 'Tailoring Workshop In Action Video',
    category: 'vocational',
    caption: 'Video walkthrough of apprentice trainees operating treadle sewing machines.',
    uploadedAt: '2026-10-16T10:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'video',
    duration: '0:58',
    focalPoint: { x: 50, y: 45 },
  },

  // 6. Life at Victorious Heritage (Joy, Recess, Playground & Celebrations)
  {
    id: 'life-graduate',
    url: '/assets/schools/heritage-academy/morning-assembly.svg',
    title: 'Young Pupil Nursery Graduate in Emerald & Gold Gown',
    category: 'life-at-heritage',
    caption: 'Celebrating early childhood milestone completion with diploma scroll and radiant joy.',
    uploadedAt: '2026-10-16T11:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
    focalPoint: { x: 50, y: 35 },
    zoom: 1.15,
  },
  {
    id: 'life-swings',
    url: '/assets/schools/heritage-academy/classroom-expansion.svg',
    title: 'Playground Swings & Laughter During Morning Recess',
    category: 'life-at-heritage',
    caption: 'Children sharing moments of play, friendship, and everyday happiness on the school swings.',
    uploadedAt: '2026-10-16T11:30:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
    focalPoint: { x: 50, y: 50 },
    zoom: 1.0,
  },
  {
    id: 'life-dining',
    url: '/assets/schools/heritage-academy/school-nutrition.svg',
    title: 'Fellowship Dining & Warm Meals Under Canopies',
    category: 'life-at-heritage',
    caption: 'Pupils gathered together enjoying warm midday porridge and nutritious lunches.',
    uploadedAt: '2026-10-16T12:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
    focalPoint: { x: 50, y: 45 },
    zoom: 1.0,
  },
  {
    id: 'life-slide',
    url: '/assets/schools/heritage-academy/classroom-reading.svg',
    title: 'Playground Recreation & Childhood Activities',
    category: 'life-at-heritage',
    caption: 'Pupils enjoying outdoor play equipment and slides in the secure school courtyard.',
    uploadedAt: '2026-10-16T12:30:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
    focalPoint: { x: 50, y: 50 },
    zoom: 1.0,
  },
  {
    id: 'life-video-recess',
    url: '/assets/schools/heritage-academy/morning-assembly.svg',
    title: 'Playground Games & Children Joyful Recess Video',
    category: 'life-at-heritage',
    caption: 'Video highlight capturing children running, laughing, and playing together during break time.',
    uploadedAt: '2026-10-16T13:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'video',
    duration: '0:48',
    focalPoint: { x: 50, y: 50 },
  },
  {
    id: 'life-teachers',
    url: '/assets/schools/heritage-academy/morning-assembly.svg',
    title: 'Dedicated Teachers in Yellow Victorious Heritage Shirts',
    category: 'life-at-heritage',
    caption: 'Loving educators and mentors smiling proudly in Victorious Heritage yellow team shirts.',
    uploadedAt: '2026-10-16T13:30:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
    focalPoint: { x: 50, y: 35 },
    zoom: 1.1,
  },
];

export const PhotoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Slot photos (for hero & specific components)
  const [photos, setPhotos] = useState<Record<string, PhotoData>>(() => {
    const srvSlots: Record<string, PhotoData> = (initialServerPhotos as any)?.slotPhotos || {};
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SLOTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        const valid: Record<string, PhotoData> = {};
        for (const [k, v] of Object.entries(parsed || {})) {
          const item = v as PhotoData;
          // If the cached item has a dead blob, discard it and use the server permanent URL
          if (item && typeof item === 'object' && item.url && item.url.trim() !== '') {
            if (item.url.startsWith('blob:') && srvSlots[k]?.url) {
              valid[k] = srvSlots[k];
            } else if (!item.url.startsWith('blob:')) {
              valid[k] = item;
            }
          }
        }
        // Merge any server slots that were missing from local storage
        for (const [k, v] of Object.entries(srvSlots)) {
          if (!valid[k]) valid[k] = v;
        }
        return valid;
      }
      return srvSlots;
    } catch (e) {
      return srvSlots;
    }
  });

  // Gallery photos & videos (130 permanent photos from church archive)
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhotoItem[]>(() => {
    const srvGallery: GalleryPhotoItem[] = (initialServerPhotos as any)?.galleryPhotos;
    const defaultList = (Array.isArray(srvGallery) && srvGallery.length > 0) ? srvGallery : DEFAULT_GALLERY_PHOTOS;

    try {
      const saved = localStorage.getItem(STORAGE_KEY_GALLERY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If saved has fewer items than our server list or has dead blobs, merge with server
          const srvIds = new Set(defaultList.map((p) => p.id));
          const cleaned = parsed.map((item) => {
            if (item.url && item.url.startsWith('blob:')) {
              const matchingSrv = defaultList.find((p) => p.id === item.id);
              if (matchingSrv) return matchingSrv;
            }
            return item;
          });
          const localIds = new Set(cleaned.map((p) => p.id));
          for (const srvItem of defaultList) {
            if (!localIds.has(srvItem.id)) {
              cleaned.push(srvItem);
            }
          }
          return cleaned;
        }
      }
      return defaultList;
    } catch (e) {
      return defaultList;
    }
  });

  const [isStorageReady, setIsStorageReady] = useState(false);
  const activeObjectUrls = useRef<Set<string>>(new Set());

  // Logo management state - defaults to server persistence if configured
  const [churchLogoUrl, setChurchLogoUrl] = useState<string>(
    (initialServerPhotos as any)?.churchLogoUrl || DEFAULT_CHURCH_LOGO_URL
  );
  const [schoolLogoUrl, setSchoolLogoUrl] = useState<string>(
    (initialServerPhotos as any)?.schoolLogoUrl || DEFAULT_SCHOOL_LOGO_URL
  );
  const [isChurchLogoCustom, setIsChurchLogoCustom] = useState(
    Boolean((initialServerPhotos as any)?.churchLogoUrl)
  );
  const [isSchoolLogoCustom, setIsSchoolLogoCustom] = useState(
    Boolean((initialServerPhotos as any)?.schoolLogoUrl)
  );

  // Staff / Public mode separation
  const [isEditorMode, setIsEditorModeState] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('edit') === 'true' || window.location.hash === '#editor') {
          return true;
        }
        return localStorage.getItem('vrai_editor_mode') === 'true';
      }
      return false;
    } catch {
      return false;
    }
  });

  const setIsEditorMode = (val: boolean) => {
    setIsEditorModeState(val);
    try {
      localStorage.setItem('vrai_editor_mode', val ? 'true' : 'false');
    } catch {}
  };

  // Helper to safely track created object URLs
  const createTrackedUrl = (blob: Blob): string => {
    const url = URL.createObjectURL(blob);
    activeObjectUrls.current.add(url);
    return url;
  };

  // 1. PRIMARY HYDRATION: Permanent IndexedDB Load & Orphan Recovery
  useEffect(() => {
    let isCancelled = false;

    const hydrateFromIndexedDB = async () => {
      try {
        // A. Load Gallery Items from IndexedDB
        let idbGallery = await loadGalleryItemsFromIDB<GalleryPhotoItem[]>();
        
        // If IndexedDB metadata is empty, check localStorage fallback
        if (!idbGallery || idbGallery.length === 0) {
          try {
            const saved = localStorage.getItem(STORAGE_KEY_GALLERY);
            if (saved) {
              const parsed = JSON.parse(saved);
              if (Array.isArray(parsed) && parsed.length > 0) {
                idbGallery = parsed;
              }
            }
          } catch {}
        }

        const baseList: GalleryPhotoItem[] = (idbGallery && idbGallery.length > 0) 
          ? idbGallery 
          : DEFAULT_GALLERY_PHOTOS;

        // B. Rehydrate each user-uploaded item's binary blob directly from IndexedDB
        const hydratedGallery: GalleryPhotoItem[] = await Promise.all(
          baseList.map(async (item) => {
            if (item.isUserUploaded) {
              try {
                const blob = await getMediaFile(item.id);
                if (blob) {
                  const freshUrl = createTrackedUrl(blob);
                  if (item.mediaType === 'video') {
                    return {
                      ...item,
                      videoUrl: freshUrl,
                      url: item.url || freshUrl,
                    };
                  } else {
                    return {
                      ...item,
                      url: freshUrl,
                    };
                  }
                }
              } catch (e) {
                console.warn(`Could not hydrate blob for ${item.id}:`, e);
              }
            }
            return item;
          })
        );

        // C. ORPHANED RECOVERY CHECK:
        // If the user previously uploaded photos that disappeared from localStorage due to quota errors,
        // recover their binary blobs directly from IndexedDB so they immediately reappear!
        try {
          const allKeys = await getAllMediaBlobKeys();
          const existingIds = new Set(hydratedGallery.map((i) => i.id));
          const recoveredItems: GalleryPhotoItem[] = [];

          for (const key of allKeys) {
            if (key.startsWith('upload-') && !existingIds.has(key)) {
              const blob = await getMediaFile(key);
              if (blob) {
                const isVideo = blob.type.startsWith('video/');
                const freshUrl = createTrackedUrl(blob);
                recoveredItems.push({
                  id: key,
                  url: freshUrl,
                  videoUrl: isVideo ? freshUrl : undefined,
                  mediaType: isVideo ? 'video' : 'photo',
                  title: isVideo ? 'Recovered Video Archive' : 'Recovered Ministry Photograph',
                  category: 'life-at-heritage',
                  caption: 'Restored authentic photograph from local persistent database.',
                  uploadedAt: new Date().toISOString(),
                  isUserUploaded: true,
                  fileSize: `${(blob.size / 1024).toFixed(0)} KB`,
                });
              }
            }
          }

          if (recoveredItems.length > 0) {
            console.log(`Recovered ${recoveredItems.length} media files from IndexedDB!`);
            hydratedGallery.unshift(...recoveredItems);
          }
        } catch (recoverErr) {
          console.warn('Orphan recovery check skipped:', recoverErr);
        }

        // Server-Persisted Photos Hydration (Permanent Cross-Device Storage)
        try {
          let serverGallery: GalleryPhotoItem[] = (initialServerPhotos as any)?.galleryPhotos || [];
          const srvRes = await fetch('/api/photos').catch(() => null);
          if (srvRes && srvRes.ok) {
            const srvData = await srvRes.json();
            if (Array.isArray(srvData.galleryPhotos) && srvData.galleryPhotos.length > 0) {
              serverGallery = srvData.galleryPhotos;
            }
          }
          if (serverGallery.length > 0) {
            const currentIds = new Set(hydratedGallery.map(p => p.id));
            const newServerItems = serverGallery.filter(p => !currentIds.has(p.id));
            if (newServerItems.length > 0) {
              hydratedGallery.unshift(...newServerItems);
            }
          }
        } catch (srvErr) {
          console.warn('Server photos check skipped:', srvErr);
        }

        if (!isCancelled) {
          setGalleryPhotos(hydratedGallery);
          // Persist the consolidated list back to IndexedDB metadata
          await saveGalleryItemsToIDB(hydratedGallery);
        }

        // D. Load Slot Photos from IndexedDB
        let idbSlots = await loadSlotPhotosFromIDB<Record<string, PhotoData>>();
        if (!idbSlots || Object.keys(idbSlots).length === 0) {
          try {
            const saved = localStorage.getItem(STORAGE_KEY_SLOTS);
            if (saved) idbSlots = JSON.parse(saved);
          } catch {}
        }

        const baseSlots = idbSlots || {};
        const hydratedSlots: Record<string, PhotoData> = {};

        for (const [slotKey, slotData] of Object.entries(baseSlots)) {
          try {
            const blob = await getMediaFile(`slot-${slotKey}`);
            if (blob) {
              const freshUrl = createTrackedUrl(blob);
              hydratedSlots[slotKey] = {
                ...slotData,
                url: freshUrl,
                videoUrl: slotData.mediaType === 'video' ? freshUrl : undefined,
              };
            } else if (slotData.url && slotData.url.startsWith('blob:')) {
              // Dead blob from previous session; replace with verified fallback
              const fallback = DEFAULT_SLOT_FALLBACKS[slotKey];
              if (fallback) {
                hydratedSlots[slotKey] = {
                  ...slotData,
                  url: fallback.url,
                };
              }
            } else {
              hydratedSlots[slotKey] = slotData;
            }
          } catch {
            if (slotData.url && slotData.url.startsWith('blob:')) {
              const fallback = DEFAULT_SLOT_FALLBACKS[slotKey];
              if (fallback) {
                hydratedSlots[slotKey] = {
                  ...slotData,
                  url: fallback.url,
                };
              }
            } else {
              hydratedSlots[slotKey] = slotData;
            }
          }
        }

        // Check for any orphaned slot blobs
        try {
          const allKeys = await getAllMediaBlobKeys();
          for (const key of allKeys) {
            if (key.startsWith('slot-')) {
              const slotKey = key.replace('slot-', '');
              if (!hydratedSlots[slotKey]) {
                const blob = await getMediaFile(key);
                if (blob) {
                  const isVideo = blob.type.startsWith('video/');
                  const freshUrl = createTrackedUrl(blob);
                  hydratedSlots[slotKey] = {
                    url: freshUrl,
                    alt: `Slot ${slotKey}`,
                    uploadedAt: new Date().toISOString(),
                    mediaType: isVideo ? 'video' : 'photo',
                    videoUrl: isVideo ? freshUrl : undefined,
                  };
                }
              }
            }
          }
        } catch {}

        // D. Hydrate Custom Church and School Logos (Server First, IDB Override)
        try {
          let serverChurchLogo = (initialServerPhotos as any)?.churchLogoUrl;
          let serverSchoolLogo = (initialServerPhotos as any)?.schoolLogoUrl;

          const srvRes = await fetch('/api/photos').catch(() => null);
          if (srvRes && srvRes.ok) {
            const srvData = await srvRes.json();
            if (srvData.churchLogoUrl) serverChurchLogo = srvData.churchLogoUrl;
            if (srvData.schoolLogoUrl) serverSchoolLogo = srvData.schoolLogoUrl;
          }

          if (serverChurchLogo && !isCancelled) {
            setChurchLogoUrl(serverChurchLogo);
            setIsChurchLogoCustom(true);
          }
          if (serverSchoolLogo && !isCancelled) {
            setSchoolLogoUrl(serverSchoolLogo);
            setIsSchoolLogoCustom(true);
          }

          const churchBlob = await getMediaFile('media_church_logo');
          if (churchBlob && !isCancelled) {
            const url = createTrackedUrl(churchBlob);
            setChurchLogoUrl(url);
            setIsChurchLogoCustom(true);
          }

          const schoolBlob = await getMediaFile('media_school_logo');
          if (schoolBlob && !isCancelled) {
            const url = createTrackedUrl(schoolBlob);
            setSchoolLogoUrl(url);
            setIsSchoolLogoCustom(true);
          }
        } catch (logoHydrateErr) {
          console.warn('Logo hydration fallback:', logoHydrateErr);
        }

        // Merge server slots
        try {
          const srvSlots = (initialServerPhotos as any)?.slotPhotos || {};
          for (const [sKey, sVal] of Object.entries(srvSlots)) {
            if (!hydratedSlots[sKey] || !hydratedSlots[sKey].url || hydratedSlots[sKey].url.startsWith('blob:')) {
              hydratedSlots[sKey] = sVal as PhotoData;
            }
          }
        } catch {}

        if (!isCancelled) {
          setPhotos(hydratedSlots);
          await saveSlotPhotosToIDB(hydratedSlots);
          setIsStorageReady(true);
        }
      } catch (err) {
        console.warn('Hydration error:', err);
        if (!isCancelled) setIsStorageReady(true);
      }
    };

    hydrateFromIndexedDB();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Slot modal state
  const [activeUploadSlot, setActiveUploadSlot] = useState<string | null>(null);
  const [uploadModalLabel, setUploadModalLabel] = useState<string>('Upload real church photograph here');

  // Multi-upload modal state
  const [isMultiUploadOpen, setIsMultiUploadOpen] = useState(false);
  const [multiUploadDefaultCategory, setMultiUploadDefaultCategory] = useState<GalleryCategory>('life-at-heritage');

  // Photo Transfer & Sync modal state
  const [isPhotoSyncOpen, setIsPhotoSyncOpen] = useState(false);
  const openPhotoSyncModal = () => setIsPhotoSyncOpen(true);
  const closePhotoSyncModal = () => setIsPhotoSyncOpen(false);

  // Server sync state
  const [isSyncingToServer, setIsSyncingToServer] = useState(false);
  const [serverPhotoCount, setServerPhotoCount] = useState(0);

  // Helper: Optimizes an image blob to max 1920px dimensions and 0.85 JPEG quality
  // This shrinks a 10MB phone camera photo to ~250KB, preventing browser memory errors and Cloud Run payload limits
  const optimizeBlobForUpload = async (blob: Blob): Promise<{ base64: string; type: string }> => {
    if (blob.type.startsWith('video/') || blob.type === 'image/svg+xml') {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      return { base64, type: blob.type };
    }

    return new Promise<{ base64: string; type: string }>((resolve) => {
      const img = new Image();
      const objUrl = URL.createObjectURL(blob);
      img.onload = () => {
        URL.revokeObjectURL(objUrl);
        const maxDim = 1920;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve({ base64: dataUrl, type: 'image/jpeg' });
        } else {
          const reader = new FileReader();
          reader.onloadend = () => resolve({ base64: reader.result as string, type: blob.type });
          reader.readAsDataURL(blob);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(objUrl);
        const reader = new FileReader();
        reader.onloadend = () => resolve({ base64: reader.result as string, type: blob.type });
        reader.readAsDataURL(blob);
      };
      img.src = objUrl;
    });
  };

  // Push all local IndexedDB photos to permanent server storage in small, resilient batches
  const syncAllPhotosToServer = async (
    onProgress?: (progress: SyncProgress) => void
  ): Promise<{ success: boolean; count: number; error?: string }> => {
    try {
      setIsSyncingToServer(true);

      const userGalleryItems = galleryPhotos.filter(
        (p) => p.isUserUploaded || p.url.startsWith('blob:') || p.url.startsWith('data:')
      );

      type SyncQueueItem = {
        id: string;
        type: 'gallery' | 'slot';
        slotKey?: string;
        data: any;
      };

      const queue: SyncQueueItem[] = [];

      for (const item of userGalleryItems) {
        queue.push({
          id: item.id,
          type: 'gallery',
          data: item,
        });
      }

      for (const [slotKey, slotData] of Object.entries(photos)) {
        queue.push({
          id: `slot-${slotKey}`,
          type: 'slot',
          slotKey,
          data: slotData,
        });
      }

      const totalItems = queue.length;
      if (totalItems === 0) {
        return { success: true, count: 0 };
      }

      if (onProgress) {
        onProgress({
          current: 0,
          total: totalItems,
          percent: 0,
          message: `Preparing ${totalItems} photos for live upload...`,
        });
      }

      // Batch 2 photos per chunk (~500KB total) to stay well within Cloud Run / Nginx request limits
      const CHUNK_SIZE = 2;
      let processedCount = 0;

      for (let i = 0; i < queue.length; i += CHUNK_SIZE) {
        const slice = queue.slice(i, i + CHUNK_SIZE);
        const chunkPayload: any[] = [];

        for (const qItem of slice) {
          try {
            const blobKey = qItem.type === 'slot' ? `slot-${qItem.slotKey}` : qItem.id;
            const blob = await getMediaFile(blobKey);
            let base64 = '';
            let mimeType = 'image/jpeg';

            if (blob) {
              const opt = await optimizeBlobForUpload(blob);
              base64 = opt.base64;
              mimeType = opt.type;
            } else if (qItem.data.url && (qItem.data.url.startsWith('data:') || qItem.data.url.startsWith('blob:'))) {
              try {
                const res = await fetch(qItem.data.url);
                if (res.ok) {
                  const fetchedBlob = await res.blob();
                  const opt = await optimizeBlobForUpload(fetchedBlob);
                  base64 = opt.base64;
                  mimeType = opt.type;
                }
              } catch (fetchErr) {
                console.warn(`Could not fetch blob URL ${qItem.data.url}:`, fetchErr);
              }
            }

            chunkPayload.push({
              id: qItem.id,
              type: qItem.type,
              slotKey: qItem.slotKey,
              data: qItem.data,
              base64,
              mimeType,
            });
          } catch (itemPrepErr) {
            console.warn(`Could not prepare item ${qItem.id}:`, itemPrepErr);
          }
        }

        // Send chunk to server
        const res = await fetch('/api/photos/sync-chunk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: chunkPayload }),
        });

        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          throw new Error(errJson.error || `Server responded with status ${res.status}`);
        }

        processedCount += slice.length;
        const currentNum = Math.min(processedCount, totalItems);
        const percent = Math.min(100, Math.round((currentNum / totalItems) * 100));

        if (onProgress) {
          onProgress({
            current: currentNum,
            total: totalItems,
            percent,
            message: `Uploaded photo ${currentNum} of ${totalItems} (${percent}%)...`,
          });
        }
      }

      // Refresh latest photos from server
      const refreshed = await fetch('/api/photos').then((r) => r.json()).catch(() => null);
      if (refreshed && Array.isArray(refreshed.galleryPhotos) && refreshed.galleryPhotos.length > 0) {
        setGalleryPhotos(refreshed.galleryPhotos);
        await saveGalleryItemsToIDB(refreshed.galleryPhotos);
        setServerPhotoCount(refreshed.galleryPhotos.length);
      }
      if (refreshed && refreshed.slotPhotos && Object.keys(refreshed.slotPhotos).length > 0) {
        setPhotos(refreshed.slotPhotos);
        await saveSlotPhotosToIDB(refreshed.slotPhotos);
      }

      return { 
        success: true, 
        count: totalItems 
      };
    } catch (err: any) {
      console.error('syncAllPhotosToServer failed:', err);
      return { success: false, count: 0, error: err?.message || 'Sync failed' };
    } finally {
      setIsSyncingToServer(false);
    }
  };

  // Sync slots to IndexedDB and safe lightweight localStorage
  useEffect(() => {
    if (!isStorageReady) return;

    // 1. Permanent IndexedDB save
    saveSlotPhotosToIDB(photos);

    // 2. Safe localStorage save: exclude massive base64 strings so quota is NEVER hit
    try {
      const lightweight: Record<string, PhotoData> = {};
      for (const [key, data] of Object.entries(photos)) {
        if (!data || !data.url || data.url.trim() === '') continue;
        // If data URL is huge or blob URL, store default asset path for safe pre-hydration
        if (data.url.startsWith('data:image/') && data.url.length > 20000) {
          lightweight[key] = { ...data, url: '/assets/church/services/hero-church.svg' };
        } else if (data.url.startsWith('blob:')) {
          lightweight[key] = { ...data, url: '/assets/church/services/hero-church.svg' };
        } else {
          lightweight[key] = data;
        }
      }
      localStorage.setItem(STORAGE_KEY_SLOTS, JSON.stringify(lightweight));
    } catch (e) {
      // IndexedDB has already saved it safely
    }
  }, [photos, isStorageReady]);

  // Sync gallery to IndexedDB and safe lightweight localStorage
  useEffect(() => {
    if (!isStorageReady) return;

    // 1. Permanent IndexedDB save
    saveGalleryItemsToIDB(galleryPhotos);

    // 2. Safe localStorage save: keep items metadata but NEVER empty string url
    try {
      const sanitized = galleryPhotos.map((item) => {
        if (!item.isUserUploaded) return item;

        const copy = { ...item };
        if (copy.videoUrl && copy.videoUrl.startsWith('blob:')) {
          delete copy.videoUrl;
        }
        if (!copy.url || copy.url.startsWith('blob:') || copy.url.length > 20000) {
          // Provide safe non-empty fallback path
          copy.url = '/assets/schools/heritage-academy/morning-assembly.svg';
        }
        return copy;
      });
      localStorage.setItem(STORAGE_KEY_GALLERY, JSON.stringify(sanitized));
    } catch (e) {
      // Safe to ignore because IndexedDB is the source of truth
    }
  }, [galleryPhotos, isStorageReady]);

  // Upload single photo or video to a slot
  const uploadPhoto = async (slotKey: string, file: File, alt?: string): Promise<string> => {
    const isVideo = file.type.startsWith('video/');
    
    // Save original binary file directly to IndexedDB
    await saveMediaFile(`slot-${slotKey}`, file);
    
    // Create live ObjectURL for instant, crystal-clear rendering
    const objectUrl = createTrackedUrl(file);
    let posterUrl = objectUrl;

    if (isVideo) {
      const { thumbnailUrl } = await generateVideoThumbnail(file);
      posterUrl = thumbnailUrl || objectUrl;
    }

    const newPhotoData: PhotoData = {
      url: isVideo ? posterUrl : objectUrl,
      alt: alt || file.name,
      uploadedAt: new Date().toISOString(),
      mediaType: isVideo ? 'video' : 'photo',
      videoUrl: isVideo ? objectUrl : undefined,
    };

    setPhotos((prev) => {
      const updated = { ...prev, [slotKey]: newPhotoData };
      saveSlotPhotosToIDB(updated);
      return updated;
    });

    return isVideo ? posterUrl : objectUrl;
  };

  const removePhoto = (slotKey: string) => {
    deleteMediaFile(`slot-${slotKey}`);
    setPhotos((prev) => {
      const updated = { ...prev };
      delete updated[slotKey];
      saveSlotPhotosToIDB(updated);
      return updated;
    });
  };

  const getPhoto = (slotKey: string): PhotoData | null => {
    // 1. If user uploaded a custom photo, return it if valid (and not a dead blob from previous session)
    const custom = photos[slotKey];
    if (custom && custom.url && custom.url.trim() !== '') {
      if (custom.url.startsWith('blob:') && !activeObjectUrls.current.has(custom.url)) {
        // Expired blob from prior session; skip to bundled fallback
      } else {
        return custom;
      }
    }
    // 2. Exact match in server-persisted slot photos archive
    const serverSlot = (initialServerPhotos as any)?.slotPhotos?.[slotKey];
    if (serverSlot && serverSlot.url && serverSlot.url.trim() !== '') {
      return serverSlot;
    }
    // 3. Exact match in bundled repository assets
    if (DEFAULT_SLOT_FALLBACKS[slotKey]) {
      return DEFAULT_SLOT_FALLBACKS[slotKey];
    }
    // 3. Smart semantic fallback matching slot names
    const lower = slotKey.toLowerCase();
    if (lower.includes('wedding')) return DEFAULT_SLOT_FALLBACKS['event_wedding'];
    if (lower.includes('anniversary')) return DEFAULT_SLOT_FALLBACKS['event_anniversary'];
    if (lower.includes('women')) return DEFAULT_SLOT_FALLBACKS['women_fellowship'];
    if (lower.includes('school') || lower.includes('heritage') || lower.includes('pupil') || lower.includes('child')) {
      if (lower.includes('nutrition') || lower.includes('meal')) return DEFAULT_SLOT_FALLBACKS['school_nutrition'];
      if (lower.includes('desk') || lower.includes('expansion')) return DEFAULT_SLOT_FALLBACKS['school_expansion'];
      if (lower.includes('class')) return DEFAULT_SLOT_FALLBACKS['school_classroom'];
      return DEFAULT_SLOT_FALLBACKS['school_assembly'];
    }
    if (lower.includes('vocational') || lower.includes('trade')) {
      if (lower.includes('carpentry')) return DEFAULT_SLOT_FALLBACKS['vocational_carpentry'];
      if (lower.includes('solar')) return DEFAULT_SLOT_FALLBACKS['vocational_solar'];
      return DEFAULT_SLOT_FALLBACKS['vocational_tailoring'];
    }
    return DEFAULT_SLOT_FALLBACKS['hero_church'] || null;
  };

  const updatePhotoFocalPoint = (slotKey: string, focalPoint: FocalPoint, zoom: number = 1.0) => {
    setPhotos((prev) => {
      const existing = prev[slotKey] || getPhoto(slotKey) || {
        url: '/assets/church/services/hero-church.svg',
        alt: slotKey,
        uploadedAt: new Date().toISOString(),
      };
      const updatedItem: PhotoData = {
        ...existing,
        focalPoint,
        zoom,
      };
      const updated = { ...prev, [slotKey]: updatedItem };
      saveSlotPhotosToIDB(updated);
      return updated;
    });
  };

  const openUploadModal = (slotKey: string, label?: string) => {
    setActiveUploadSlot(slotKey);
    setUploadModalLabel(label || 'Upload real church photograph or video here');
  };

  const closeUploadModal = () => {
    setActiveUploadSlot(null);
  };

  // Upload Multiple Photos AND Videos into Gallery
  const uploadMultipleGalleryMedia = async (
    files: FileList | File[],
    category: GalleryCategory,
    defaultTitle?: string
  ): Promise<GalleryPhotoItem[]> => {
    const fileArray = Array.from(files);
    const newItems: GalleryPhotoItem[] = [];

    // Map legacy alias to proper canonical category
    const canonicalCategory: GalleryCategory = 
      category === 'heritage' ? 'victorious-heritage' : category;

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const title = defaultTitle && fileArray.length === 1 
        ? defaultTitle 
        : defaultTitle 
          ? `${defaultTitle} (${i + 1})` 
          : baseName;

      const itemId = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${i}`;
      const isVideo = file.type.startsWith('video/');

      // Save raw binary file to IndexedDB FIRST
      await saveMediaFile(itemId, file);
      const objectUrl = createTrackedUrl(file);

      if (isVideo) {
        // Video file processing
        const { thumbnailUrl, duration } = await generateVideoThumbnail(file);

        const item: GalleryPhotoItem = {
          id: itemId,
          url: thumbnailUrl || objectUrl,
          videoUrl: objectUrl,
          mediaType: 'video',
          duration,
          title,
          category: canonicalCategory,
          caption: `Uploaded video clip for ${canonicalCategory === 'life-at-heritage' ? 'Life at Victorious Heritage' : canonicalCategory} section.`,
          uploadedAt: new Date().toISOString(),
          isUserUploaded: true,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        };
        newItems.push(item);
      } else {
        // Photo file processing
        const item: GalleryPhotoItem = {
          id: itemId,
          url: objectUrl,
          mediaType: 'photo',
          title,
          category: canonicalCategory,
          caption: `Uploaded photograph for ${canonicalCategory === 'life-at-heritage' ? 'Life at Victorious Heritage' : canonicalCategory} section.`,
          uploadedAt: new Date().toISOString(),
          isUserUploaded: true,
          fileSize: `${(file.size / 1024).toFixed(0)} KB`,
        };
        newItems.push(item);
      }
    }

    setGalleryPhotos((prev) => {
      const updated = [...newItems, ...prev];
      // Immediately write to IndexedDB so it's guaranteed to be saved
      saveGalleryItemsToIDB(updated);
      return updated;
    });

    return newItems;
  };

  // Backward compatibility alias
  const uploadMultipleGalleryPhotos = uploadMultipleGalleryMedia;

  const removeGalleryPhoto = (id: string) => {
    deleteMediaFile(id);
    setGalleryPhotos((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      saveGalleryItemsToIDB(updated);
      return updated;
    });
  };

  const updateGalleryPhoto = (id: string, updates: Partial<GalleryPhotoItem>) => {
    setGalleryPhotos((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      saveGalleryItemsToIDB(updated);
      return updated;
    });
  };

  const replaceGalleryMedia = async (
    id: string,
    file: File,
    updates?: { title?: string; category?: GalleryCategory; caption?: string }
  ): Promise<GalleryPhotoItem | null> => {
    const existing = galleryPhotos.find((p) => p.id === id);
    if (!existing) return null;

    // Delete existing binary file from IndexedDB
    await deleteMediaFile(id);

    // Save replacement file to IndexedDB
    await saveMediaFile(id, file);
    const objectUrl = createTrackedUrl(file);

    const isVideo = file.type.startsWith('video/');
    let posterUrl = objectUrl;
    let videoUrl: string | undefined = undefined;
    let duration: string | undefined = undefined;

    if (isVideo) {
      const res = await generateVideoThumbnail(file);
      posterUrl = res.thumbnailUrl || objectUrl;
      videoUrl = objectUrl;
      duration = res.duration;
    }

    const updatedCategory = updates?.category 
      ? (updates.category === 'heritage' ? 'victorious-heritage' : updates.category)
      : existing.category;

    const updatedItem: GalleryPhotoItem = {
      ...existing,
      url: isVideo ? posterUrl : objectUrl,
      videoUrl,
      duration,
      mediaType: isVideo ? 'video' : 'photo',
      title: updates?.title || existing.title,
      category: updatedCategory,
      caption: updates?.caption || existing.caption,
      uploadedAt: new Date().toISOString(),
      isUserUploaded: true,
      fileSize: isVideo
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(0)} KB`,
    };

    setGalleryPhotos((prev) => {
      const updated = prev.map((p) => (p.id === id ? updatedItem : p));
      saveGalleryItemsToIDB(updated);
      return updated;
    });

    return updatedItem;
  };

  const resetDefaultGalleryPhotos = async () => {
    localStorage.removeItem(STORAGE_KEY_GALLERY);
    // Delete any user blobs
    try {
      const allKeys = await getAllMediaBlobKeys();
      for (const k of allKeys) {
        if (k.startsWith('upload-')) {
          await deleteMediaFile(k);
        }
      }
    } catch {}

    setGalleryPhotos(DEFAULT_GALLERY_PHOTOS);
    await saveGalleryItemsToIDB(DEFAULT_GALLERY_PHOTOS);
  };

  const openMultiUploadModal = (defaultCategory: GalleryCategory = 'life-at-heritage') => {
    const canonical = defaultCategory === 'heritage' ? 'victorious-heritage' : defaultCategory;
    setMultiUploadDefaultCategory(canonical);
    setIsMultiUploadOpen(true);
  };

  const closeMultiUploadModal = () => {
    setIsMultiUploadOpen(false);
  };

  const updateGalleryPhotoFocalPoint = (id: string, focalPoint: FocalPoint, zoom: number = 1.0) => {
    setGalleryPhotos((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, focalPoint, zoom } : p));
      saveGalleryItemsToIDB(updated);
      return updated;
    });
  };

  // Dedicated Church Event (Weddings & Anniversaries) Upload Modal
  const [isChurchEventUploadOpen, setIsChurchEventUploadOpen] = useState(false);
  const [churchEventDefaultType, setChurchEventDefaultType] = useState<
    'wedding' | 'anniversary' | 'church-anniversary' | 'thanksgiving' | 'dedication'
  >('wedding');

  const openChurchEventUploadModal = (
    eventType: 'wedding' | 'anniversary' | 'church-anniversary' | 'thanksgiving' | 'dedication' = 'wedding'
  ) => {
    setChurchEventDefaultType(eventType);
    setIsChurchEventUploadOpen(true);
  };

  const closeChurchEventUploadModal = () => {
    setIsChurchEventUploadOpen(false);
  };

  // Interactive Photo Framing & Face Repositioning Modal State
  const [focalAdjustTarget, setFocalAdjustTarget] = useState<FocalAdjustTarget | null>(null);

  const openFocalAdjustModal = (target: FocalAdjustTarget) => {
    setFocalAdjustTarget(target);
  };

  const closeFocalAdjustModal = () => {
    setFocalAdjustTarget(null);
  };

  const uploadChurchLogo = async (file: File): Promise<string> => {
    // 1. Convert to base64 for persistent server delivery
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // 2. Save locally to IndexedDB for instant preview
    await saveMediaFile('media_church_logo', file);
    const localUrl = createTrackedUrl(file);
    setChurchLogoUrl(localUrl);
    setIsChurchLogoCustom(true);
    try {
      localStorage.setItem(STORAGE_KEY_CHURCH_LOGO, 'true');
    } catch {}

    // 3. Post to server to save permanent file into /uploads/ & update serverPhotos.json
    try {
      const res = await fetch('/api/photos/upload-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'church',
          base64,
          mimeType: file.type || 'image/png',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setChurchLogoUrl(data.url);
          return data.url;
        }
      }
    } catch (netErr) {
      console.warn('Server logo sync pending or offline:', netErr);
    }

    return localUrl;
  };

  const uploadSchoolLogo = async (file: File): Promise<string> => {
    // 1. Convert to base64 for persistent server delivery
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // 2. Save locally to IndexedDB for instant preview
    await saveMediaFile('media_school_logo', file);
    const localUrl = createTrackedUrl(file);
    setSchoolLogoUrl(localUrl);
    setIsSchoolLogoCustom(true);
    try {
      localStorage.setItem(STORAGE_KEY_SCHOOL_LOGO, 'true');
    } catch {}

    // 3. Post to server to save permanent file into /uploads/ & update serverPhotos.json
    try {
      const res = await fetch('/api/photos/upload-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'school',
          base64,
          mimeType: file.type || 'image/png',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setSchoolLogoUrl(data.url);
          return data.url;
        }
      }
    } catch (netErr) {
      console.warn('Server school logo sync pending or offline:', netErr);
    }

    return localUrl;
  };

  const resetChurchLogo = async () => {
    try {
      await deleteMediaFile('media_church_logo');
      localStorage.removeItem(STORAGE_KEY_CHURCH_LOGO);
      await fetch('/api/photos/reset-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'church' }),
      }).catch(() => null);
    } catch {}
    setChurchLogoUrl(DEFAULT_CHURCH_LOGO_URL);
    setIsChurchLogoCustom(false);
  };

  const resetSchoolLogo = async () => {
    try {
      await deleteMediaFile('media_school_logo');
      localStorage.removeItem(STORAGE_KEY_SCHOOL_LOGO);
      await fetch('/api/photos/reset-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'school' }),
      }).catch(() => null);
    } catch {}
    setSchoolLogoUrl(DEFAULT_SCHOOL_LOGO_URL);
    setIsSchoolLogoCustom(false);
  };

  const diagnoseImageUrls = async () => {
    console.group('🔍 VRAI Image Diagnostic Utility');
    console.log('Checking all registered gallery and slot image URLs...');

    const urlsToCheck: { label: string; url: string }[] = [];

    // 1. Logos
    urlsToCheck.push({ label: 'Church Logo', url: churchLogoUrl });
    urlsToCheck.push({ label: 'School Logo', url: schoolLogoUrl });

    // 2. Slot Photos
    for (const [key, val] of Object.entries(photos)) {
      if (val?.url) {
        urlsToCheck.push({ label: `Slot [${key}]`, url: val.url });
      }
    }

    // 3. Gallery Photos
    for (const item of galleryPhotos) {
      if (item?.url) {
        urlsToCheck.push({ label: `Gallery [${item.id} - ${item.title}]`, url: item.url });
      }
    }

    console.log(`Total URLs to inspect: ${urlsToCheck.length}`);

    for (const item of urlsToCheck) {
      if (item.url.startsWith('blob:') || item.url.startsWith('data:')) {
        console.log(`%c[LOCAL BLOB/DATA] ${item.label}: ${item.url.substring(0, 40)}...`, 'color: #3b82f6');
        continue;
      }

      try {
        const response = await fetch(item.url, { method: 'HEAD', mode: 'no-cors' }).catch(() => null);
        // Since no-cors returns opaque, let's also do a standard fetch with mode 'cors' or 'get'
        const fullRes = await fetch(item.url).catch((err) => ({ ok: false, status: err.message }));
        
        if (typeof fullRes === 'object' && 'ok' in fullRes) {
          if (fullRes.ok) {
            console.log(`%c[OK 200] ${item.label} (${item.url})`, 'color: #10b981; font-weight: bold;');
          } else {
            console.warn(`%c[ERROR ${fullRes.status}] ${item.label} (${item.url})`, 'color: #ef4444; font-weight: bold;');
          }
        } else {
          console.log(`%c[CHECKED] ${item.label} (${item.url})`, 'color: #8b5cf6');
        }
      } catch (err: any) {
        console.error(`%c[FAILED FETCH] ${item.label} (${item.url}) -> ${err?.message}`, 'color: #ef4444;');
      }
    }

    console.groupEnd();
  };

  return (
    <PhotoContext.Provider
      value={{
        photos,
        uploadPhoto,
        removePhoto,
        getPhoto,
        updatePhotoFocalPoint,
        activeUploadSlot,
        openUploadModal,
        closeUploadModal,
        uploadModalLabel,
        galleryPhotos,
        uploadMultipleGalleryMedia,
        uploadMultipleGalleryPhotos,
        removeGalleryPhoto,
        updateGalleryPhoto,
        updateGalleryPhotoFocalPoint,
        replaceGalleryMedia,
        resetDefaultGalleryPhotos,
        isMultiUploadOpen,
        openMultiUploadModal,
        closeMultiUploadModal,
        multiUploadDefaultCategory,
        isChurchEventUploadOpen,
        openChurchEventUploadModal,
        closeChurchEventUploadModal,
        churchEventDefaultType,
        focalAdjustTarget,
        openFocalAdjustModal,
        closeFocalAdjustModal,
        isPhotoSyncOpen,
        openPhotoSyncModal,
        closePhotoSyncModal,
        syncAllPhotosToServer,
        isSyncingToServer,
        serverPhotoCount,
        isStorageReady,
        churchLogoUrl,
        schoolLogoUrl,
        uploadChurchLogo,
        uploadSchoolLogo,
        resetChurchLogo,
        resetSchoolLogo,
        isChurchLogoCustom,
        isSchoolLogoCustom,
        isEditorMode,
        setIsEditorMode,
        diagnoseImageUrls,
      }}
    >
      {children}
    </PhotoContext.Provider>
  );
};

export const usePhotos = () => {
  const context = useContext(PhotoContext);
  if (!context) {
    throw new Error('usePhotos must be used within a PhotoProvider');
  }
  return context;
};
