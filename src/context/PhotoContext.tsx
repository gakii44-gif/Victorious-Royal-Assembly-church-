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

export type GalleryCategory = 
  | 'victorious-heritage' 
  | 'church' 
  | 'women' 
  | 'vocational' 
  | 'life-at-heritage'
  | 'heritage'; // backward compatibility alias for victorious-heritage
export type MediaType = 'photo' | 'video';

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
}

export interface PhotoData {
  url: string;
  alt?: string;
  uploadedAt: string;
  mediaType?: MediaType;
  videoUrl?: string;
}

interface PhotoContextType {
  // Slot-based single uploads (for hero banners, specific page cards)
  photos: Record<string, PhotoData>;
  uploadPhoto: (slotKey: string, file: File, alt?: string) => Promise<string>;
  removePhoto: (slotKey: string) => void;
  getPhoto: (slotKey: string) => PhotoData | null;
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

  // Storage hydration state
  isStorageReady: boolean;

  // Dedicated Official Church & School Logo Management
  churchLogoUrl: string;
  schoolLogoUrl: string;
  uploadChurchLogo: (file: File) => Promise<string>;
  uploadSchoolLogo: (file: File) => Promise<string>;
  resetChurchLogo: () => void;
  resetSchoolLogo: () => void;
  isChurchLogoCustom: boolean;
  isSchoolLogoCustom: boolean;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

const STORAGE_KEY_SLOTS = 'vrai_church_uploaded_photos';
const STORAGE_KEY_GALLERY = 'vrai_church_gallery_photos';
const STORAGE_KEY_CHURCH_LOGO = 'vrai_church_custom_logo_key';
const STORAGE_KEY_SCHOOL_LOGO = 'vrai_school_custom_logo_key';

const DEFAULT_CHURCH_LOGO_URL = '/vrai-church-logo.svg';
const DEFAULT_SCHOOL_LOGO_URL = '/victorious-heritage-school-logo.svg';

// Default initial curated gallery placeholders
const DEFAULT_GALLERY_PHOTOS: GalleryPhotoItem[] = [
  // 1. Victorious Heritage (Nursery & Primary School & Adult Education)
  {
    id: 'heritage-assembly',
    url: '/assets/schools/heritage-academy/morning-assembly.jpg',
    title: 'Victorious Heritage Morning Assembly & Prayer',
    category: 'victorious-heritage',
    caption: 'Primary school pupils and teachers gathering for morning devotions, scripture reading, and South Sudan national anthem.',
    uploadedAt: '2026-10-01T08:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
  },
  {
    id: 'heritage-classroom',
    url: '/assets/schools/heritage-academy/classroom-reading.jpg',
    title: 'Classroom Literacy & Science Lesson',
    category: 'victorious-heritage',
    caption: 'Pupils engaged in English, mathematics, and South Sudan national curriculum studies.',
    uploadedAt: '2026-10-02T09:30:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
  },
  {
    id: 'heritage-nutrition',
    url: '/assets/schools/heritage-academy/school-nutrition.jpg',
    title: 'Pupil Nutrition & Midday Meal Program',
    category: 'victorious-heritage',
    caption: 'Daily nutritious morning porridge and meals served to support active learning and pupil health.',
    uploadedAt: '2026-10-03T12:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
  },
  {
    id: 'heritage-expansion',
    url: '/assets/schools/heritage-academy/classroom-expansion.jpg',
    title: 'Classroom Desks & Facility Upgrades',
    category: 'victorious-heritage',
    caption: 'Wooden dual writing desks built by local craftsmen to ensure no child sits on the floor.',
    uploadedAt: '2026-10-04T14:15:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
  },
  {
    id: 'heritage-video-sample',
    url: '/assets/schools/heritage-academy/classroom-reading.jpg',
    title: 'Pupils Singing & Worship at Morning Devotion',
    category: 'victorious-heritage',
    caption: 'Video highlight of pupils praising and singing hymns before morning classes in Juba.',
    uploadedAt: '2026-10-05T08:15:00.000Z',
    isUserUploaded: false,
    mediaType: 'video',
    duration: '1:24',
  },

  // 2. Church Photos & Videos
  {
    id: 'church-worship',
    url: '/assets/church/services/sunday-worship.jpg',
    title: 'Sunday Worship & Word of Faith Altar',
    category: 'church',
    caption: 'Victorious Royal Assembly congregation gathered for Sunday morning praise, healing, and anointed preaching.',
    uploadedAt: '2026-10-05T10:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
  },
  {
    id: 'church-healing',
    url: '/assets/church/services/hero-church.jpg',
    title: 'Healing & Deliverance Altar Ministry',
    category: 'church',
    caption: 'A.k.a Word of Faith Healing & Deliverance Ministry Int’l — Altar intercession and divine restoration in Juba.',
    uploadedAt: '2026-10-06T11:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
  },
  {
    id: 'church-communion',
    url: '/assets/church/services/sunday-worship.jpg',
    title: 'Holy Communion & Covenant Service',
    category: 'church',
    caption: 'Breaking bread and receiving covenant blessings at the altar on former Nilepet Road, Tongping.',
    uploadedAt: '2026-10-07T11:30:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
  },
  {
    id: 'church-video-sample',
    url: '/assets/church/services/hero-church.jpg',
    title: 'Anointed Worship & Choir Praise Video',
    category: 'church',
    caption: 'Video clip of the choir leading the assembly in uplifting African gospel worship.',
    uploadedAt: '2026-10-08T10:30:00.000Z',
    isUserUploaded: false,
    mediaType: 'video',
    duration: '1:45',
  },

  // 3. Women Section Photos & Videos
  {
    id: 'women-anniversary',
    url: '/assets/church/fellowships/women-fellowship.jpg',
    title: 'Women Fellowship Annual Anniversary',
    category: 'women',
    caption: 'Sisters dressed in matching African print commemorative fabrics celebrating grace and unity.',
    uploadedAt: '2026-10-09T14:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
  },
  {
    id: 'women-prayer',
    url: '/assets/church/fellowships/women-fellowship.jpg',
    title: 'Mothers Intercessory Vigil & Prayer Altar',
    category: 'women',
    caption: 'Faithful women interceding for families, children, church growth, and peace in South Sudan.',
    uploadedAt: '2026-10-10T16:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
  },
  {
    id: 'women-widows',
    url: '/assets/church/fellowships/women-fellowship.jpg',
    title: 'Widow Support & Food Basket Distribution',
    category: 'women',
    caption: 'Empowering vulnerable women and widows with essential food grain, cooking oil, and fellowship support.',
    uploadedAt: '2026-10-11T15:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
  },
  {
    id: 'women-video-sample',
    url: '/assets/church/fellowships/women-fellowship.jpg',
    title: 'Women Fellowship Dance & Thanksgiving Song',
    category: 'women',
    caption: 'Joyful video clip of the women praising the Lord with traditional South Sudanese rhythms.',
    uploadedAt: '2026-10-12T15:30:00.000Z',
    isUserUploaded: false,
    mediaType: 'video',
    duration: '1:10',
  },

  // 4. Vocational Photos & Videos
  {
    id: 'vocational-tailoring',
    url: '/assets/schools/vocational-school/tailoring-class.jpg',
    title: 'Tailoring & Garment Design Training',
    category: 'vocational',
    caption: 'Trainees learning precision machine sewing, pattern drafting, and apparel making.',
    uploadedAt: '2026-10-13T10:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
  },
  {
    id: 'vocational-carpentry',
    url: '/assets/schools/vocational-school/carpentry-workshop.jpg',
    title: 'Carpentry & Furniture Joinery Workshop',
    category: 'vocational',
    caption: 'Youth crafting study desks, classroom benches, doors, and timber furniture.',
    uploadedAt: '2026-10-14T11:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
  },
  {
    id: 'vocational-solar',
    url: '/assets/schools/vocational-school/solar-electrical.jpg',
    title: 'Solar Photovoltaic Technician Training',
    category: 'vocational',
    caption: 'Students assembling solar storage systems, charge controllers, and off-grid lighting.',
    uploadedAt: '2026-10-15T14:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
  },
  {
    id: 'vocational-video-sample',
    url: '/assets/schools/vocational-school/tailoring-class.jpg',
    title: 'Tailoring Workshop In Action Video',
    category: 'vocational',
    caption: 'Video walkthrough of apprentice trainees operating treadle sewing machines.',
    uploadedAt: '2026-10-16T10:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'video',
    duration: '0:58',
  },

  // 5. Life at Victorious Heritage (Joy, Recess, Playground & Celebrations)
  {
    id: 'life-graduate',
    url: '/assets/schools/heritage-academy/morning-assembly.jpg',
    title: 'Young Pupil Nursery Graduate in Emerald & Gold Gown',
    category: 'life-at-heritage',
    caption: 'Celebrating early childhood milestone completion with diploma scroll and radiant joy.',
    uploadedAt: '2026-10-16T11:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
  },
  {
    id: 'life-swings',
    url: '/assets/schools/heritage-academy/classroom-expansion.jpg',
    title: 'Playground Swings & Laughter During Morning Recess',
    category: 'life-at-heritage',
    caption: 'Children sharing moments of play, friendship, and everyday happiness on the school swings.',
    uploadedAt: '2026-10-16T11:30:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
  },
  {
    id: 'life-dining',
    url: '/assets/schools/heritage-academy/school-nutrition.jpg',
    title: 'Fellowship Dining & Warm Meals Under Canopies',
    category: 'life-at-heritage',
    caption: 'Pupils gathered together enjoying warm midday porridge and nutritious lunches.',
    uploadedAt: '2026-10-16T12:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
  },
  {
    id: 'life-slide',
    url: '/assets/schools/heritage-academy/classroom-reading.jpg',
    title: 'Playground Recreation & Childhood Activities',
    category: 'life-at-heritage',
    caption: 'Pupils enjoying outdoor play equipment and slides in the secure school courtyard.',
    uploadedAt: '2026-10-16T12:30:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
  },
  {
    id: 'life-video-recess',
    url: '/assets/schools/heritage-academy/morning-assembly.jpg',
    title: 'Playground Games & Children Joyful Recess Video',
    category: 'life-at-heritage',
    caption: 'Video highlight capturing children running, laughing, and playing together during break time.',
    uploadedAt: '2026-10-16T13:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'video',
    duration: '0:48',
  },
  {
    id: 'life-teachers',
    url: '/assets/schools/heritage-academy/morning-assembly.jpg',
    title: 'Dedicated Teachers in Yellow Victorious Heritage Shirts',
    category: 'life-at-heritage',
    caption: 'Loving educators and mentors smiling proudly in Victorious Heritage yellow team shirts.',
    uploadedAt: '2026-10-16T13:30:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
  },
];

export const PhotoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Slot photos (for hero & specific components)
  const [photos, setPhotos] = useState<Record<string, PhotoData>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SLOTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        const valid: Record<string, PhotoData> = {};
        for (const [k, v] of Object.entries(parsed || {})) {
          const item = v as PhotoData;
          if (item && typeof item === 'object' && item.url && item.url.trim() !== '') {
            valid[k] = item;
          }
        }
        return valid;
      }
      return {};
    } catch (e) {
      return {};
    }
  });

  // Gallery photos & videos
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhotoItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GALLERY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item) => {
            if (!item.url || item.url.trim() === '') {
              return { ...item, url: '/assets/schools/heritage-academy/morning-assembly.jpg' };
            }
            return item;
          });
        }
      }
      return DEFAULT_GALLERY_PHOTOS;
    } catch (e) {
      return DEFAULT_GALLERY_PHOTOS;
    }
  });

  const [isStorageReady, setIsStorageReady] = useState(false);
  const activeObjectUrls = useRef<Set<string>>(new Set());

  // Logo management state
  const [churchLogoUrl, setChurchLogoUrl] = useState<string>(DEFAULT_CHURCH_LOGO_URL);
  const [schoolLogoUrl, setSchoolLogoUrl] = useState<string>(DEFAULT_SCHOOL_LOGO_URL);
  const [isChurchLogoCustom, setIsChurchLogoCustom] = useState(false);
  const [isSchoolLogoCustom, setIsSchoolLogoCustom] = useState(false);

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
            } else {
              hydratedSlots[slotKey] = slotData;
            }
          } catch {
            hydratedSlots[slotKey] = slotData;
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

        // D. Hydrate Custom Church and School Logos if uploaded
        try {
          const churchBlob = await getMediaFile('media_church_logo');
          if (churchBlob && !isCancelled) {
            const url = createTrackedUrl(churchBlob);
            setChurchLogoUrl(url);
            setIsChurchLogoCustom(true);
          }
        } catch {}

        try {
          const schoolBlob = await getMediaFile('media_school_logo');
          if (schoolBlob && !isCancelled) {
            const url = createTrackedUrl(schoolBlob);
            setSchoolLogoUrl(url);
            setIsSchoolLogoCustom(true);
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
          lightweight[key] = { ...data, url: '/assets/church/services/hero-church.jpg' };
        } else if (data.url.startsWith('blob:')) {
          lightweight[key] = { ...data, url: '/assets/church/services/hero-church.jpg' };
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
          copy.url = '/assets/schools/heritage-academy/morning-assembly.jpg';
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
    return photos[slotKey] || null;
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

  const uploadChurchLogo = async (file: File): Promise<string> => {
    await saveMediaFile('media_church_logo', file);
    const url = createTrackedUrl(file);
    setChurchLogoUrl(url);
    setIsChurchLogoCustom(true);
    try {
      localStorage.setItem(STORAGE_KEY_CHURCH_LOGO, 'true');
    } catch {}
    return url;
  };

  const uploadSchoolLogo = async (file: File): Promise<string> => {
    await saveMediaFile('media_school_logo', file);
    const url = createTrackedUrl(file);
    setSchoolLogoUrl(url);
    setIsSchoolLogoCustom(true);
    try {
      localStorage.setItem(STORAGE_KEY_SCHOOL_LOGO, 'true');
    } catch {}
    return url;
  };

  const resetChurchLogo = async () => {
    try {
      await deleteMediaFile('media_church_logo');
      localStorage.removeItem(STORAGE_KEY_CHURCH_LOGO);
    } catch {}
    setChurchLogoUrl(DEFAULT_CHURCH_LOGO_URL);
    setIsChurchLogoCustom(false);
  };

  const resetSchoolLogo = async () => {
    try {
      await deleteMediaFile('media_school_logo');
      localStorage.removeItem(STORAGE_KEY_SCHOOL_LOGO);
    } catch {}
    setSchoolLogoUrl(DEFAULT_SCHOOL_LOGO_URL);
    setIsSchoolLogoCustom(false);
  };

  return (
    <PhotoContext.Provider
      value={{
        photos,
        uploadPhoto,
        removePhoto,
        getPhoto,
        activeUploadSlot,
        openUploadModal,
        closeUploadModal,
        uploadModalLabel,
        galleryPhotos,
        uploadMultipleGalleryMedia,
        uploadMultipleGalleryPhotos,
        removeGalleryPhoto,
        updateGalleryPhoto,
        replaceGalleryMedia,
        resetDefaultGalleryPhotos,
        isMultiUploadOpen,
        openMultiUploadModal,
        closeMultiUploadModal,
        multiUploadDefaultCategory,
        isStorageReady,
        churchLogoUrl,
        schoolLogoUrl,
        uploadChurchLogo,
        uploadSchoolLogo,
        resetChurchLogo,
        resetSchoolLogo,
        isChurchLogoCustom,
        isSchoolLogoCustom,
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
