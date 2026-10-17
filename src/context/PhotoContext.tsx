import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveMediaFile, getMediaFile, deleteMediaFile, generateVideoThumbnail } from '../utils/mediaStorage';

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
  url: string; // Image URL/DataURL or Video Poster Thumbnail
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
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

const STORAGE_KEY_SLOTS = 'vrai_church_uploaded_photos';
const STORAGE_KEY_GALLERY = 'vrai_church_gallery_photos';

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
    uploadedAt: '2026-10-06T11:30:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
  },
  {
    id: 'church-communion',
    url: '/assets/church/services/midweek-communion.jpg',
    title: 'Wednesday Mid-Week Communion Service',
    category: 'church',
    caption: 'Believers taking the holy communion table during our 5:00 PM Wednesday mid-week service.',
    uploadedAt: '2026-10-07T17:30:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
  },
  {
    id: 'church-video-sample',
    url: '/assets/church/services/sunday-worship.jpg',
    title: 'Sunday Celebration Choir Praise & Anointing Video',
    category: 'church',
    caption: 'Live praise and worship service with choir and congregation in Juba, South Sudan.',
    uploadedAt: '2026-10-08T10:45:00.000Z',
    isUserUploaded: false,
    mediaType: 'video',
    duration: '2:15',
  },
  {
    id: 'church-convocation',
    url: '/assets/church/outreach/convocation-ceremony.jpg',
    title: 'Solemn Leadership & Convocation Service',
    category: 'church',
    caption: 'Academic regalia ceremony honoring Christian educators, missionaries, and community pioneers in Juba.',
    uploadedAt: '2026-10-08T15:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
  },

  // 3. Women Section Photos & Videos
  {
    id: 'women-anniversary',
    url: '/assets/church/outreach/womens-fellowship.jpg',
    title: 'Women’s Fellowship in Custom Anniversary Uniform',
    category: 'women',
    caption: 'Mothers and sisters dressed in vibrant custom church anniversary attire for praise and fellowship.',
    uploadedAt: '2026-10-09T10:30:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
  },
  {
    id: 'women-prayer',
    url: '/assets/church/outreach/womens-prayer-circle.jpg',
    title: 'Mothers Intercessory Altar & Prayer Circle',
    category: 'women',
    caption: 'Monthly dedicated prayer vigil for families, children in South Sudan, and missionary breakthroughs.',
    uploadedAt: '2026-10-10T11:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
  },
  {
    id: 'women-widow-relief',
    url: '/assets/church/outreach/womens-relief.jpg',
    title: 'Widow Support & Food Basket Distribution',
    category: 'women',
    caption: 'Compassion ministry outreach delivering dry food rations, cooking oil, and counseling to vulnerable widows.',
    uploadedAt: '2026-10-11T13:45:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
  },
  {
    id: 'women-fabric',
    url: '/assets/church/outreach/womens-fabric-details.jpg',
    title: 'Church Commemorative Print Fabric Patterns',
    category: 'women',
    caption: 'Close-up of the celebratory Christian jubilee print cloth worn during church convocations.',
    uploadedAt: '2026-10-12T16:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
  },

  // 4. School Vocational Photos & Videos
  {
    id: 'vocational-tailoring',
    url: '/assets/schools/vocational-school/tailoring-class.jpg',
    title: 'Tailoring & Garment Construction Workshop',
    category: 'vocational',
    caption: 'Youth and adult learners operating manual sewing machines crafting school uniforms and local attire.',
    uploadedAt: '2026-10-13T09:00:00.000Z',
    isUserUploaded: false,
    mediaType: 'photo',
  },
  {
    id: 'vocational-carpentry',
    url: '/assets/schools/vocational-school/carpentry-workshop.jpg',
    title: 'Carpentry & Joinery Apprentice Station',
    category: 'vocational',
    caption: 'Young apprentices learning joinery, planing, and crafting wooden desks for local schools.',
    uploadedAt: '2026-10-14T11:20:00.000Z',
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

/**
 * Client-side image compression using canvas
 */
const compressImage = (file: File, maxDimension = 1400, quality = 0.85): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let { width, height } = img;
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export const PhotoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Slot photos (for hero & specific components)
  const [photos, setPhotos] = useState<Record<string, PhotoData>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SLOTS);
      return saved ? JSON.parse(saved) : {};
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
          return parsed;
        }
      }
      return DEFAULT_GALLERY_PHOTOS;
    } catch (e) {
      return DEFAULT_GALLERY_PHOTOS;
    }
  });

  // Re-hydrate video URLs from IndexedDB for any user-uploaded videos after refresh
  useEffect(() => {
    const rehydrateVideos = async () => {
      let hasUpdates = false;
      const updatedList = await Promise.all(
        galleryPhotos.map(async (item) => {
          if (item.isUserUploaded && item.mediaType === 'video' && !item.videoUrl) {
            try {
              const blob = await getMediaFile(item.id);
              if (blob) {
                hasUpdates = true;
                return {
                  ...item,
                  videoUrl: URL.createObjectURL(blob),
                };
              }
            } catch (e) {
              console.warn('Could not rehydrate video blob:', e);
            }
          }
          return item;
        })
      );

      if (hasUpdates) {
        setGalleryPhotos(updatedList);
      }
    };

    rehydrateVideos();
  }, []);

  // Slot modal state
  const [activeUploadSlot, setActiveUploadSlot] = useState<string | null>(null);
  const [uploadModalLabel, setUploadModalLabel] = useState<string>('Upload real church photograph here');

  // Multi-upload modal state
  const [isMultiUploadOpen, setIsMultiUploadOpen] = useState(false);
  const [multiUploadDefaultCategory, setMultiUploadDefaultCategory] = useState<GalleryCategory>('heritage');

  // Sync slots to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SLOTS, JSON.stringify(photos));
    } catch (e) {
      console.warn('Failed to persist slot photos to localStorage:', e);
    }
  }, [photos]);

  // Sync gallery to localStorage (exclude volatile object URLs so JSON stringifies cleanly)
  useEffect(() => {
    try {
      const sanitized = galleryPhotos.map((item) => {
        if (item.videoUrl && item.videoUrl.startsWith('blob:')) {
          // Keep item metadata but don't stringify dead blob URLs to localStorage
          const { videoUrl, ...rest } = item;
          return rest;
        }
        return item;
      });
      localStorage.setItem(STORAGE_KEY_GALLERY, JSON.stringify(sanitized));
    } catch (e) {
      console.warn('Failed to persist gallery to localStorage:', e);
    }
  }, [galleryPhotos]);

  const uploadPhoto = async (slotKey: string, file: File, alt?: string): Promise<string> => {
    const isVideo = file.type.startsWith('video/');
    let url = '';
    let videoUrl: string | undefined = undefined;

    if (isVideo) {
      const { thumbnailUrl } = await generateVideoThumbnail(file);
      url = thumbnailUrl || '/assets/church/services/hero-church.jpg';
      videoUrl = URL.createObjectURL(file);
      await saveMediaFile(`slot-${slotKey}`, file);
    } else {
      url = await compressImage(file, 1600, 0.88);
      await saveMediaFile(`slot-${slotKey}`, file);
    }

    const newPhotoData: PhotoData = {
      url,
      alt: alt || file.name,
      uploadedAt: new Date().toISOString(),
      mediaType: isVideo ? 'video' : 'photo',
      videoUrl,
    };

    setPhotos((prev) => ({
      ...prev,
      [slotKey]: newPhotoData,
    }));
    return url;
  };

  const removePhoto = (slotKey: string) => {
    deleteMediaFile(`slot-${slotKey}`);
    setPhotos((prev) => {
      const updated = { ...prev };
      delete updated[slotKey];
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

      if (isVideo) {
        // Video file processing
        const { thumbnailUrl, duration } = await generateVideoThumbnail(file);
        const videoUrl = URL.createObjectURL(file);
        await saveMediaFile(itemId, file);

        const item: GalleryPhotoItem = {
          id: itemId,
          url: thumbnailUrl || '/assets/schools/heritage-academy/morning-assembly.jpg',
          videoUrl,
          mediaType: 'video',
          duration,
          title,
          category,
          caption: `Uploaded video clip for ${category === 'heritage' ? 'Life at Victorious Heritage' : category} section.`,
          uploadedAt: new Date().toISOString(),
          isUserUploaded: true,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        };
        newItems.push(item);
      } else {
        // Photo file processing
        const url = await compressImage(file, 1400, 0.85);
        await saveMediaFile(itemId, file);

        const item: GalleryPhotoItem = {
          id: itemId,
          url,
          mediaType: 'photo',
          title,
          category,
          caption: `Uploaded photograph for ${category === 'heritage' ? 'Life at Victorious Heritage' : category} section.`,
          uploadedAt: new Date().toISOString(),
          isUserUploaded: true,
          fileSize: `${(file.size / 1024).toFixed(0)} KB`,
        };
        newItems.push(item);
      }
    }

    setGalleryPhotos((prev) => [...newItems, ...prev]);
    return newItems;
  };

  // Backward compatibility alias
  const uploadMultipleGalleryPhotos = uploadMultipleGalleryMedia;

  const removeGalleryPhoto = (id: string) => {
    deleteMediaFile(id);
    setGalleryPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const updateGalleryPhoto = (id: string, updates: Partial<GalleryPhotoItem>) => {
    setGalleryPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const replaceGalleryMedia = async (
    id: string,
    file: File,
    updates?: { title?: string; category?: GalleryCategory; caption?: string }
  ): Promise<GalleryPhotoItem | null> => {
    const existing = galleryPhotos.find((p) => p.id === id);
    if (!existing) return null;

    // Delete existing binary file from IndexedDB if it was stored
    await deleteMediaFile(id);

    const isVideo = file.type.startsWith('video/');
    let url = '';
    let videoUrl: string | undefined = undefined;
    let duration: string | undefined = undefined;

    if (isVideo) {
      const res = await generateVideoThumbnail(file);
      url = res.thumbnailUrl || '/assets/schools/heritage-academy/morning-assembly.jpg';
      videoUrl = URL.createObjectURL(file);
      duration = res.duration;
      await saveMediaFile(id, file);
    } else {
      url = await compressImage(file, 1600, 0.88);
      await saveMediaFile(id, file);
    }

    const updatedItem: GalleryPhotoItem = {
      ...existing,
      url,
      videoUrl,
      duration,
      mediaType: isVideo ? 'video' : 'photo',
      title: updates?.title || existing.title,
      category: updates?.category || existing.category,
      caption: updates?.caption || existing.caption,
      uploadedAt: new Date().toISOString(),
      isUserUploaded: true,
      fileSize: isVideo
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(0)} KB`,
    };

    setGalleryPhotos((prev) =>
      prev.map((p) => (p.id === id ? updatedItem : p))
    );

    return updatedItem;
  };

  const resetDefaultGalleryPhotos = () => {
    localStorage.removeItem(STORAGE_KEY_GALLERY);
    setGalleryPhotos(DEFAULT_GALLERY_PHOTOS);
  };

  const openMultiUploadModal = (defaultCategory: GalleryCategory = 'heritage') => {
    setMultiUploadDefaultCategory(defaultCategory);
    setIsMultiUploadOpen(true);
  };

  const closeMultiUploadModal = () => {
    setIsMultiUploadOpen(false);
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
