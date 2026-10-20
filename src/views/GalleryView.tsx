import React, { useState } from 'react';
import { NavView } from '../components/Navbar';
import { organizationData } from '../data/organizationData';
import { usePhotos, GalleryCategory, GalleryPhotoItem } from '../context/PhotoContext';
import { 
  Camera, 
  Upload, 
  Plus, 
  Filter, 
  GraduationCap, 
  Church, 
  Heart, 
  Wrench, 
  X, 
  ZoomIn, 
  Trash2, 
  Calendar, 
  AlertCircle,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Play,
  Pause,
  Film,
  Video,
  RefreshCw,
  RotateCcw,
  BookOpen,
  Smile,
  SlidersHorizontal,
  Maximize2,
  HeartHandshake,
  Move,
  HardDrive
} from 'lucide-react';
import { VRAILogo } from '../components/VRAILogo';
import { LifeAtHeritageGallerySection } from '../components/LifeAtHeritageGallerySection';
import { ReplaceMediaModal } from '../components/ReplaceMediaModal';

interface GalleryViewProps {
  onNavigate: (view: NavView) => void;
  onOpenAssetGuide: () => void;
  onOpenDonateModal: (designation?: 'heritage' | 'vocational' | 'both' | 'general' | 'education' | 'missions') => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  onNavigate,
  onOpenAssetGuide,
  onOpenDonateModal,
}) => {
  const { 
    galleryPhotos, 
    openMultiUploadModal, 
    removeGalleryPhoto, 
    updateGalleryPhoto, 
    resetDefaultGalleryPhotos,
    openChurchEventUploadModal,
    openFocalAdjustModal,
    openPhotoSyncModal
  } = usePhotos();

  // Active Section filter ('all' or one of the 6 specific sections)
  const [activeTab, setActiveTab] = useState<'all' | GalleryCategory>('all');
  const [eventSubFilter, setEventSubFilter] = useState<'all' | 'wedding' | 'anniversary' | 'milestone' | 'thanksgiving'>('all');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'photo' | 'video'>('all');
  const [activeLightboxPhoto, setActiveLightboxPhoto] = useState<GalleryPhotoItem | null>(null);
  const [replaceModalItem, setReplaceModalItem] = useState<GalleryPhotoItem | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<GalleryPhotoItem | null>(null);
  
  // Track which video is currently playing inline inside a card preview
  const [inlineVideoPlayingId, setInlineVideoPlayingId] = useState<string | null>(null);

  // The 5 Exact Sections requested by the user
  const sections: { 
    id: GalleryCategory; 
    label: string; 
    shortLabel: string;
    icon: React.ReactNode; 
    desc: string;
    badge: string;
    accentBg: string;
    accentText: string;
    badgeBorder: string;
  }[] = [
    { 
      id: 'victorious-heritage', 
      label: 'Victorious Heritage', 
      shortLabel: 'Victorious Heritage',
      icon: <BookOpen className="w-4 h-4 text-emerald-700" />,
      badge: 'Nursery, Primary & Adult Ed',
      desc: 'Classrooms, academic instruction, morning assembly, pupil nutrition porridge, handwriting, and adult literacy education in Juba.',
      accentBg: 'bg-emerald-50',
      accentText: 'text-emerald-900',
      badgeBorder: 'border-emerald-200'
    },
    { 
      id: 'church', 
      label: 'Church', 
      shortLabel: 'Church',
      icon: <Church className="w-4 h-4 text-amber-600" />,
      badge: 'Worship & Faith Altar',
      desc: 'Sunday celebration services, choir praise video clips, Word of Faith altar ministry, Holy Communion, and healing miracles.',
      accentBg: 'bg-amber-50',
      accentText: 'text-amber-900',
      badgeBorder: 'border-amber-200'
    },
    { 
      id: 'church-events', 
      label: 'Church Events', 
      shortLabel: 'Church Events',
      icon: <HeartHandshake className="w-4 h-4 text-rose-600" />,
      badge: 'Weddings & Anniversaries',
      desc: 'Holy Matrimony covenant nuptials, silver & golden wedding anniversaries, annual church jubilee conventions, baby dedications, and altar thanksgiving in Juba.',
      accentBg: 'bg-rose-50',
      accentText: 'text-rose-900',
      badgeBorder: 'border-rose-200'
    },
    { 
      id: 'women', 
      label: 'Women', 
      shortLabel: 'Women',
      icon: <Heart className="w-4 h-4 text-rose-500" />,
      badge: 'Mothers & Fellowship',
      desc: 'Women’s Fellowship gatherings, anniversary commemorative uniform fabrics, mothers intercessory vigils, and widow relief aid.',
      accentBg: 'bg-rose-50',
      accentText: 'text-rose-900',
      badgeBorder: 'border-rose-200'
    },
    { 
      id: 'vocational', 
      label: 'Vocational', 
      shortLabel: 'Vocational',
      icon: <Wrench className="w-4 h-4 text-sky-600" />,
      badge: 'Technical Trades Centre',
      desc: 'Hands-on training in heavy-duty tailoring, carpentry workbenches, solar technician electrical systems, and artisan starter toolkits.',
      accentBg: 'bg-sky-50',
      accentText: 'text-sky-900',
      badgeBorder: 'border-sky-200'
    },
    { 
      id: 'life-at-heritage', 
      label: 'Life at Victorious Heritage', 
      shortLabel: 'Life at Heritage',
      icon: <Smile className="w-4 h-4 text-purple-600" />,
      badge: 'Everyday Joy & Recess',
      desc: 'Everyday pupil happiness: playground recess swings, water slides, canopy dining fellowship, and emerald & gold graduation cap celebrations.',
      accentBg: 'bg-purple-50',
      accentText: 'text-purple-900',
      badgeBorder: 'border-purple-200'
    },
  ];

  // Map legacy 'heritage' to 'victorious-heritage' for seamless filtering
  const isMatchCategory = (itemCategory: string, tab: string) => {
    if (tab === 'all') return true;
    if (tab === 'victorious-heritage' && (itemCategory === 'victorious-heritage' || itemCategory === 'heritage')) {
      return true;
    }
    return itemCategory === tab;
  };

  const getSectionMeta = (cat: string) => {
    switch (cat) {
      case 'church-events':
        return {
          id: 'church-events' as GalleryCategory,
          label: 'Church Events',
          shortLabel: 'Church Events',
          badge: 'Weddings & Anniversaries',
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-600',
        };
      case 'victorious-heritage':
      case 'heritage':
        return {
          id: 'victorious-heritage' as GalleryCategory,
          label: 'Victorious Heritage',
          shortLabel: 'Victorious Heritage',
          badge: 'Nursery, Primary & Adult Ed',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-600',
        };
      case 'church':
        return {
          id: 'church' as GalleryCategory,
          label: 'Church',
          shortLabel: 'Church',
          badge: 'Worship & Faith Altar',
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-600',
        };
      case 'women':
        return {
          id: 'women' as GalleryCategory,
          label: 'Women',
          shortLabel: 'Women',
          badge: 'Women Fellowship & Widows',
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
        };
      case 'vocational':
        return {
          id: 'vocational' as GalleryCategory,
          label: 'Vocational',
          shortLabel: 'Vocational',
          badge: 'Trades & Toolkits',
          bg: 'bg-sky-50 text-sky-800 border-sky-200',
          dot: 'bg-sky-600',
        };
      case 'life-at-heritage':
        return {
          id: 'life-at-heritage' as GalleryCategory,
          label: 'Life at Victorious Heritage',
          shortLabel: 'Life at Heritage',
          badge: 'Joy & Milestones',
          bg: 'bg-purple-50 text-purple-800 border-purple-200',
          dot: 'bg-purple-600',
        };
      default:
        return {
          id: 'victorious-heritage' as GalleryCategory,
          label: 'Victorious Heritage',
          shortLabel: 'Victorious Heritage',
          badge: 'School & Ed',
          bg: 'bg-stone-50 text-stone-800 border-stone-200',
          dot: 'bg-stone-600',
        };
    }
  };

  const getCategoryCount = (tabId: string) => {
    return galleryPhotos.filter((p) => isMatchCategory(p.category, tabId)).length;
  };

  // Filtered by selected section tab
  const sectionFilteredPhotos = activeTab === 'all'
    ? galleryPhotos
    : activeTab === 'church-events'
      ? galleryPhotos.filter((p) => {
          if (p.category !== 'church-events') return false;
          if (eventSubFilter === 'all') return true;
          return p.eventDetails?.eventType === eventSubFilter;
        })
      : galleryPhotos.filter((p) => isMatchCategory(p.category, activeTab));

  // Filtered by media format (All / Photos / Videos)
  const filteredPhotos = mediaFilter === 'all'
    ? sectionFilteredPhotos
    : sectionFilteredPhotos.filter((p) => (p.mediaType || 'photo') === mediaFilter);

  const activeSectionInfo = sections.find((s) => s.id === activeTab);

  return (
    <div className="space-y-12 pb-24">
      {/* Top Banner */}
      <section className="bg-stone-900 text-white py-16 px-4 sm:px-8 border-b border-stone-800 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, #84cc16 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="max-w-7xl mx-auto space-y-4 relative z-10">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-lime-400 font-semibold">
            <span>Authentic Ministry Archives</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>Tongping (Former Nilepet Road), Juba</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>Photos &amp; Video Clips</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight">
                Church &amp; School Photo &amp; Video Galleries
              </h1>
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                Categorized into 5 dedicated archives: <strong>Victorious Heritage</strong>, <strong>Church</strong>, <strong>Women</strong>, <strong>Vocational</strong>, and <strong>Life at Victorious Heritage</strong>. Preview video recordings, inspect high-resolution photographs, or replace and manage individual media items.
              </p>
            </div>

            {/* Direct Multi Upload Trigger */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={openPhotoSyncModal}
                className="px-4 py-3 bg-lime-400 hover:bg-lime-300 text-slate-950 font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 hover:scale-[1.02]"
                title="Make all uploaded photos permanent and visible on the published website"
              >
                <HardDrive className="w-4 h-4 text-emerald-950" />
                <span>🚀 Publish to Live Site</span>
              </button>
              <button
                onClick={() => openMultiUploadModal(activeTab === 'all' ? 'victorious-heritage' : activeTab)}
                className="px-5 py-3 bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2.5 hover:scale-[1.02]"
              >
                <Upload className="w-4 h-4 text-lime-300" />
                <span>Upload Photos &amp; Videos</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        
        {/* Verification Policy Banner */}
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                Categorized Ministry &amp; School Media Integrity Standard
              </p>
              <p className="text-[11px] text-stone-600">
                Every photo and video belongs to its verified department in Juba. Use <strong>Replace</strong> to update misplaced photos, change categories, or swap files anytime.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs shrink-0">
            <button
              onClick={() => openMultiUploadModal(activeTab === 'all' ? 'victorious-heritage' : activeTab)}
              className="text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1.5 underline underline-offset-4"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Gallery</span>
            </button>
            <span className="text-stone-300">|</span>
            <button
              onClick={onOpenAssetGuide}
              className="text-stone-500 hover:text-stone-800"
            >
              Media Guide
            </button>
          </div>
        </div>

        {/* 5-SECTION GALLERY TABS SWITCHER */}
        <div className="space-y-4 pt-2 border-t border-stone-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-xs uppercase tracking-widest font-bold text-stone-500 flex items-center gap-2 font-mono">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
              <span>Select Gallery Section</span>
            </h2>

            {/* Media Type Filter (All / Photos / Videos) */}
            <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl self-start sm:self-auto border border-stone-200 text-xs">
              <button
                onClick={() => setMediaFilter('all')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  mediaFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-stone-600 hover:text-slate-900'
                }`}
              >
                All Media ({sectionFilteredPhotos.length})
              </button>
              <button
                onClick={() => setMediaFilter('photo')}
                className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                  mediaFilter === 'photo'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-stone-600 hover:text-slate-900'
                }`}
              >
                <Camera className="w-3 h-3 text-emerald-700" />
                <span>Photos ({sectionFilteredPhotos.filter(p => (p.mediaType || 'photo') === 'photo').length})</span>
              </button>
              <button
                onClick={() => setMediaFilter('video')}
                className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                  mediaFilter === 'video'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-stone-600 hover:text-slate-900'
                }`}
              >
                <Film className="w-3 h-3 text-amber-600" />
                <span>Videos ({sectionFilteredPhotos.filter(p => p.mediaType === 'video').length})</span>
              </button>
            </div>
          </div>

          {/* 5 Distinct Section Tabs (+ All) */}
          <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'all'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-slate-900'
              }`}
            >
              <span>All Galleries</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                activeTab === 'all' ? 'bg-stone-700 text-stone-200' : 'bg-stone-200 text-stone-700'
              }`}>
                {galleryPhotos.length}
              </span>
            </button>

            {sections.map((section) => {
              const isSelected = activeTab === section.id;
              const count = getCategoryCount(section.id);
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-slate-900'
                  }`}
                >
                  {section.icon}
                  <span>{section.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isSelected ? 'bg-emerald-950/80 text-emerald-200' : 'bg-stone-200 text-stone-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Section Header Card */}
          {activeSectionInfo ? (
            <div className={`p-5 rounded-2xl border ${activeSectionInfo.badgeBorder} ${activeSectionInfo.accentBg} flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-white rounded-lg shadow-2xs">
                    {activeSectionInfo.icon}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 font-heading">
                    {activeSectionInfo.label} Gallery
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-white rounded-full border border-stone-200 text-stone-600">
                    {activeSectionInfo.badge}
                  </span>
                </div>
                <p className="text-xs text-stone-700 max-w-2xl leading-relaxed">
                  {activeSectionInfo.desc}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                {activeSectionInfo.id === 'church-events' ? (
                  <>
                    <button
                      onClick={() => openChurchEventUploadModal('wedding')}
                      className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <HeartHandshake className="w-3.5 h-3.5 text-rose-200" />
                      <span>Upload Wedding / Anniversary</span>
                    </button>
                    <button
                      onClick={() => openMultiUploadModal('church-events')}
                      className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-lime-300" />
                      <span>Batch Upload</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => openMultiUploadModal(activeSectionInfo.id)}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-lime-300" />
                    <span>Upload to {activeSectionInfo.label}</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p>
                Viewing combined media across all 6 sections. Filter by tab above to focus on a specific ministry, school, or church events archive.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openChurchEventUploadModal('wedding')}
                  className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-bold text-xs shrink-0 inline-flex items-center gap-1.5"
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>Upload Wedding/Anniversary</span>
                </button>
                <button
                  onClick={() => openMultiUploadModal('victorious-heritage')}
                  className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold text-xs shrink-0 inline-flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-lime-300" />
                  <span>Upload Media</span>
                </button>
              </div>
            </div>
          )}

          {/* Sub-Filters specifically for Church Events (Weddings, Anniversaries, Milestones) */}
          {activeTab === 'church-events' && (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-rose-50/70 border border-rose-200/80 rounded-xl animate-in fade-in duration-200">
              <span className="text-xs font-bold text-rose-950 flex items-center gap-1 mr-1">
                <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
                <span>Filter Celebrations:</span>
              </span>
              {[
                { id: 'all', label: 'All Celebrations' },
                { id: 'wedding', label: '💍 Weddings & Nuptials' },
                { id: 'anniversary', label: '🥂 Wedding Anniversaries' },
                { id: 'milestone', label: '⛪ Church Jubilee' },
                { id: 'thanksgiving', label: '🙏 Dedications & Thanksgiving' },
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setEventSubFilter(sub.id as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    eventSubFilter === sub.id
                      ? 'bg-rose-700 text-white shadow-xs'
                      : 'bg-white text-stone-700 hover:bg-rose-100/60 border border-stone-200'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* If 'Life at Victorious Heritage' or 'All' is active, showcase the 4-column Bento mosaic segment */}
        {(activeTab === 'all' || activeTab === 'life-at-heritage') && (
          <div className="pt-2">
            <LifeAtHeritageGallerySection
              onNavigate={onNavigate}
              onOpenDonateModal={onOpenDonateModal}
            />
          </div>
        )}

        {/* GRID OF INDIVIDUAL MEDIA ITEMS (Photos & Video Previews) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <span>{activeSectionInfo ? `${activeSectionInfo.label} Media Items` : 'All Media Items'}</span>
              <span className="text-stone-400 font-normal text-xs font-mono">({filteredPhotos.length})</span>
            </h3>

            {galleryPhotos.length < 5 && (
              <button
                onClick={resetDefaultGalleryPhotos}
                className="text-xs text-stone-500 hover:text-emerald-800 font-semibold flex items-center gap-1"
                title="Restore original sample gallery archives"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restore Sample Archives</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPhotos.map((item) => {
              const meta = getSectionMeta(item.category);
              const isUserItem = item.isUserUploaded;
              const isVideo = item.mediaType === 'video';
              const isInlinePlaying = inlineVideoPlayingId === item.id;
              const focalX = item.focalPoint?.x ?? 50;
              const focalY = item.focalPoint?.y ?? 50;
              const zoom = item.zoom ?? 1.0;

              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Photo or Video Thumbnail Container with Video Preview Support */}
                  <div className="relative aspect-4/3 overflow-hidden bg-stone-900">
                    
                    {/* INLINE VIDEO PREVIEW PLAYER */}
                    {isVideo && isInlinePlaying ? (
                      <div className="w-full h-full relative bg-black flex items-center justify-center">
                        <video
                          src={item.videoUrl || item.url}
                          poster={item.url}
                          controls
                          autoPlay
                          playsInline
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInlineVideoPlayingId(null);
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-black/80 hover:bg-black text-white rounded-md z-20"
                          title="Close inline video preview"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      /* PHOTO / VIDEO POSTER DISPLAY WITH DRAGGABLE FOCAL POSITIONING */
                      <div 
                        className="w-full h-full relative cursor-pointer"
                        onClick={() => setActiveLightboxPhoto(item)}
                      >
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                          style={{
                            objectPosition: `${focalX}% ${focalY}%`,
                            transform: zoom !== 1 ? `scale(${zoom})` : undefined,
                            transformOrigin: `${focalX}% ${focalY}%`,
                          }}
                        />

                        {/* Interactive Play Button for Video Previews */}
                        {isVideo && (
                          <div className="absolute inset-0 bg-black/35 flex flex-col items-center justify-center gap-2 group-hover:bg-black/25 transition-colors">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (item.videoUrl) {
                                  setInlineVideoPlayingId(item.id);
                                } else {
                                  setActiveLightboxPhoto(item);
                                }
                              }}
                              className="w-13 h-13 rounded-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-all"
                              title="Click to preview video clip"
                            >
                              <Play className="w-6 h-6 ml-0.5 fill-current" />
                            </button>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/75 text-amber-300 tracking-wide backdrop-blur-xs">
                              Preview Video Clip
                            </span>
                          </div>
                        )}

                        {/* Top-Right Quick Fit Box Button on Card Hover */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openFocalAdjustModal({
                                type: 'gallery',
                                keyOrId: item.id,
                                url: item.url,
                                title: item.title,
                                focalPoint: item.focalPoint || { x: 50, y: 50 },
                                zoom: item.zoom || 1.0,
                                aspectRatio: '4:3',
                              });
                            }}
                            className="bg-black/80 hover:bg-black text-white text-[10px] font-semibold px-2 py-1 rounded backdrop-blur-xs flex items-center gap-1 shadow-sm border border-white/20"
                            title="Adjust framing & drag face to fit box"
                          >
                            <Move className="w-3 h-3 text-amber-300" />
                            <span>Fit Box</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Format Badge (Photo vs Video Preview) */}
                    <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 pointer-events-none">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md shadow-xs ${
                        isVideo 
                          ? 'bg-amber-600/90 text-white border-amber-400/50' 
                          : 'bg-black/65 text-white border-white/20'
                      }`}>
                        {isVideo ? (
                          <>
                            <Film className="w-3 h-3" />
                            <span>Video</span>
                          </>
                        ) : (
                          <>
                            <Camera className="w-3 h-3" />
                            <span>Photo</span>
                          </>
                        )}
                      </span>

                      {/* Event tag if wedding/anniversary */}
                      {item.eventDetails && (
                        <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-rose-700 text-white shadow-xs">
                          {item.eventDetails.eventType === 'wedding' ? '💍 Wedding' :
                           item.eventDetails.eventType === 'anniversary' ? '🥂 Anniversary' :
                           item.eventDetails.eventType === 'milestone' ? '⛪ Jubilee' : '🙏 Dedication'}
                        </span>
                      )}
                    </div>

                    {/* Duration Badge for Videos */}
                    {isVideo && item.duration && (
                      <div className="absolute bottom-2.5 right-2.5 z-10 pointer-events-none">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/85 text-amber-300 border border-white/20 backdrop-blur-xs">
                          {item.duration}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Info */}
                  <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${meta.bg}`}>
                          {meta.label}
                        </span>
                        {item.eventDetails?.anniversaryYears && (
                          <span className="text-[10px] text-rose-700 font-bold font-mono">
                            {item.eventDetails.anniversaryYears}
                          </span>
                        )}
                        {isVideo && (
                          <span className="text-[10px] text-amber-800 font-bold font-mono">
                            {item.duration || 'Video'}
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1 group-hover:text-emerald-800 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                        {item.caption}
                      </p>
                    </div>

                    {/* ACTION INTERFACE: FIT BOX, REPLACE, DELETE, QUICK MOVE & PREVIEW */}
                    <div className="space-y-2 pt-2 border-t border-stone-100">
                      
                      {/* Top Row: Quick Move Section Dropdown */}
                      <div className="flex items-center justify-between text-[10px] text-stone-500 bg-stone-50 p-1.5 rounded-lg border border-stone-200/80">
                        <span className="font-semibold text-stone-600 pl-1 shrink-0">Section:</span>
                        <select
                          value={item.category === 'heritage' ? 'victorious-heritage' : item.category}
                          onChange={(e) => {
                            const newCategory = e.target.value as GalleryCategory;
                            updateGalleryPhoto(item.id, { category: newCategory });
                          }}
                          className="bg-white border border-stone-200 rounded px-1.5 py-0.5 font-bold text-slate-900 focus:outline-hidden text-[10px] cursor-pointer max-w-[170px] truncate"
                          title="Move this item to another section"
                        >
                          <option value="victorious-heritage">Victorious Heritage</option>
                          <option value="church">Church</option>
                          <option value="church-events">Church Events (Weddings &amp; Anniversaries)</option>
                          <option value="women">Women</option>
                          <option value="vocational">Vocational</option>
                          <option value="life-at-heritage">Life at Victorious Heritage</option>
                        </select>
                      </div>

                      {/* Bottom Row: Controls */}
                      <div className="flex items-center justify-between gap-1 pt-0.5">
                        <div className="flex items-center gap-1.5">
                          {/* Fit Box / Drag Face Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openFocalAdjustModal({
                                type: 'gallery',
                                keyOrId: item.id,
                                url: item.url,
                                title: item.title,
                                focalPoint: item.focalPoint || { x: 50, y: 50 },
                                zoom: item.zoom || 1.0,
                                aspectRatio: '4:3',
                              });
                            }}
                            className="px-2 py-1.5 text-stone-700 hover:text-amber-900 bg-stone-100 hover:bg-amber-50 border border-stone-200 hover:border-amber-300 rounded-lg font-bold text-xs transition-colors inline-flex items-center gap-1"
                            title="Drag to fit box & position face squarely in view"
                          >
                            <Move className="w-3 h-3 text-amber-600" />
                            <span>Fit Box</span>
                          </button>

                          {/* Replace Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setReplaceModalItem(item);
                            }}
                            className="px-2.5 py-1.5 text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg font-bold text-xs transition-colors inline-flex items-center gap-1.5"
                            title="Replace this media or swap with new upload"
                          >
                            <RefreshCw className="w-3 h-3 text-emerald-700" />
                            <span>Replace</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmItem(item);
                            }}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                            title={`Delete ${isVideo ? 'video' : 'photo'} from gallery`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* View or Preview Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (isVideo && item.videoUrl) {
                              setInlineVideoPlayingId(inlineVideoPlayingId === item.id ? null : item.id);
                            } else {
                              setActiveLightboxPhoto(item);
                            }
                          }}
                          className="px-2.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-bold text-xs transition-colors flex items-center gap-1 shrink-0"
                        >
                          {isVideo ? (
                            isInlinePlaying ? (
                              <>
                                <Pause className="w-3 h-3 text-amber-300" />
                                <span>Pause</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3 text-amber-300 fill-current" />
                                <span>Preview</span>
                              </>
                            )
                          ) : (
                            <>
                              <span>View</span>
                              <ArrowRight className="w-3 h-3 text-stone-400" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {filteredPhotos.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 space-y-3">
            <Film className="w-10 h-10 text-stone-400 mx-auto" />
            <h4 className="font-bold text-slate-900 text-sm">
              No media items found in {activeSectionInfo ? activeSectionInfo.label : 'this view'}
            </h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Be the first to upload photographs or video clips for this section.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => openMultiUploadModal(activeTab === 'all' ? 'victorious-heritage' : activeTab)}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5 text-lime-300" />
                <span>Upload Now</span>
              </button>
              <button
                onClick={resetDefaultGalleryPhotos}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Sample Items</span>
              </button>
            </div>
          </div>
        )}

        {/* Section Cross Links / Call to Action */}
        <section className="bg-emerald-950 text-white rounded-2xl p-8 sm:p-10 border border-emerald-900 space-y-6">
          <div className="max-w-2xl space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold font-heading">
              Support Our Church &amp; Educational Work
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Every photograph and video tells a story of hope, literacy, and transformation in Juba, South Sudan. Partner with Victorious Royal Assembly International and Victorious Heritage Model Nursery &amp; Primary School &amp; Adult Education Centre today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('heritage-academy')}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors"
            >
              Explore Victorious Heritage School &amp; Adult Ed
            </button>
            <button
              onClick={() => onNavigate('vocational-school')}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-colors"
            >
              Explore Vocational Trades Centre
            </button>
            <button
              onClick={() => onOpenDonateModal('both')}
              className="px-5 py-2.5 bg-white text-emerald-950 hover:bg-stone-100 rounded-lg text-xs font-bold transition-colors"
            >
              Partner &amp; Support Mission
            </button>
          </div>
        </section>
      </div>

      {/* FULLSCREEN LIGHTBOX & VIDEO PREVIEW MODAL */}
      {activeLightboxPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveLightboxPhoto(null)}
        >
          <div 
            className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full border border-stone-800 shadow-2xl relative animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="px-6 py-3.5 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-lime-400 uppercase tracking-wider">
                  {getSectionMeta(activeLightboxPhoto.category).label}
                </span>
                <span className="text-stone-600">·</span>
                <span className="text-xs text-stone-300 truncate max-w-xs sm:max-w-md">
                  {activeLightboxPhoto.title}
                </span>
              </div>
              <button
                onClick={() => setActiveLightboxPhoto(null)}
                className="p-1 text-stone-400 hover:text-white rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player or High-Res Photo View */}
            <div className="relative aspect-video max-h-[65vh] bg-stone-950 flex items-center justify-center overflow-hidden">
              {activeLightboxPhoto.mediaType === 'video' ? (
                activeLightboxPhoto.videoUrl ? (
                  <video
                    controls
                    autoPlay
                    playsInline
                    src={activeLightboxPhoto.videoUrl}
                    poster={activeLightboxPhoto.url}
                    className="w-full h-full max-h-[65vh] object-contain bg-black"
                  />
                ) : (
                  <div className="p-8 text-center space-y-4 max-w-md text-white">
                    <div className="w-16 h-16 rounded-full bg-amber-600/30 border border-amber-500/50 mx-auto flex items-center justify-center">
                      <Play className="w-8 h-8 text-amber-400 fill-current ml-1" />
                    </div>
                    <h4 className="font-bold text-lg">{activeLightboxPhoto.title}</h4>
                    <p className="text-xs text-stone-300">{activeLightboxPhoto.caption}</p>
                    <div className="p-2.5 bg-amber-950/60 border border-amber-800/60 rounded-xl text-amber-200 text-xs">
                      Duration: <strong>{activeLightboxPhoto.duration || 'Short clip'}</strong>
                    </div>
                    <button
                      onClick={() => {
                        const current = activeLightboxPhoto;
                        setActiveLightboxPhoto(null);
                        setReplaceModalItem(current);
                      }}
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5 text-lime-300" />
                      <span>Upload / Replace with Video File</span>
                    </button>
                  </div>
                )
              ) : activeLightboxPhoto.url ? (
                <div className="w-full h-full relative flex items-center justify-center p-2">
                  <img
                    src={activeLightboxPhoto.url}
                    alt={activeLightboxPhoto.title}
                    className="max-w-full max-h-[70vh] object-contain rounded-lg"
                    style={{
                      objectPosition: `${activeLightboxPhoto.focalPoint?.x ?? 50}% ${activeLightboxPhoto.focalPoint?.y ?? 50}%`,
                    }}
                  />
                  {activeLightboxPhoto.eventDetails && (
                    <div className="absolute top-4 left-4 bg-rose-700/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5 shadow-md">
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>
                        {activeLightboxPhoto.eventDetails.eventType === 'wedding' ? '💍 Holy Matrimony' :
                         activeLightboxPhoto.eventDetails.eventType === 'anniversary' ? '🥂 Wedding Anniversary' :
                         activeLightboxPhoto.eventDetails.eventType === 'milestone' ? '⛪ Church Jubilee' : '🙏 Altar Thanksgiving'}
                      </span>
                      {activeLightboxPhoto.eventDetails.anniversaryYears && (
                        <span>· {activeLightboxPhoto.eventDetails.anniversaryYears}</span>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center space-y-4 max-w-lg">
                  <VRAILogo size={64} />
                  <div className="space-y-1">
                    <h4 className="text-white font-bold text-base">
                      {activeLightboxPhoto.title}
                    </h4>
                    <p className="text-stone-300 text-xs leading-relaxed">
                      {activeLightboxPhoto.caption}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Lightbox Footer Details & Action Controls */}
            <div className="p-5 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-stone-600">
              <div className="space-y-0.5">
                <p className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                  <span>{activeLightboxPhoto.title}</span>
                  {activeLightboxPhoto.mediaType === 'video' && (
                    <span className="px-2 py-0.5 text-[10px] bg-amber-100 text-amber-900 rounded font-bold">
                      Video Preview ({activeLightboxPhoto.duration || 'Clip'})
                    </span>
                  )}
                </p>
                <p className="text-stone-500">
                  {activeLightboxPhoto.caption}
                </p>
              </div>

              {/* Individual Media Action Interface: Fit Box, Quick Move, Replace & Delete */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {/* Fit Box / Drag to Center Face Button */}
                <button
                  type="button"
                  onClick={() => {
                    const current = activeLightboxPhoto;
                    setActiveLightboxPhoto(null);
                    openFocalAdjustModal({
                      type: 'gallery',
                      keyOrId: current.id,
                      url: current.url,
                      title: current.title,
                      focalPoint: current.focalPoint || { x: 50, y: 50 },
                      zoom: current.zoom || 1.0,
                      aspectRatio: '4:3',
                    });
                  }}
                  className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                  title="Adjust photo framing and drag to fit box"
                >
                  <Move className="w-3.5 h-3.5 text-amber-700" />
                  <span>Fit Box &amp; Drag Face</span>
                </button>

                {/* Re-categorize Dropdown ("incase its not correct placed") */}
                <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs">
                  <span className="text-[11px] font-semibold text-stone-500">Section:</span>
                  <select
                    value={activeLightboxPhoto.category === 'heritage' ? 'victorious-heritage' : activeLightboxPhoto.category}
                    onChange={(e) => {
                      const newCat = e.target.value as GalleryCategory;
                      updateGalleryPhoto(activeLightboxPhoto.id, { category: newCat });
                      setActiveLightboxPhoto({ ...activeLightboxPhoto, category: newCat });
                    }}
                    className="bg-transparent font-bold text-slate-900 focus:outline-hidden text-xs cursor-pointer"
                  >
                    <option value="victorious-heritage">Victorious Heritage</option>
                    <option value="church">Church</option>
                    <option value="church-events">Church Events (Weddings &amp; Anniversaries)</option>
                    <option value="women">Women</option>
                    <option value="vocational">Vocational</option>
                    <option value="life-at-heritage">Life at Victorious Heritage</option>
                  </select>
                </div>

                {/* Replace Button */}
                <button
                  type="button"
                  onClick={() => {
                    const current = activeLightboxPhoto;
                    setActiveLightboxPhoto(null);
                    setReplaceModalItem(current);
                  }}
                  className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                  title="Replace with new photo or video"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-lime-300" />
                  <span>Replace</span>
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => {
                    const current = activeLightboxPhoto;
                    setActiveLightboxPhoto(null);
                    setDeleteConfirmItem(current);
                  }}
                  className="px-3 py-2 text-rose-700 hover:text-rose-900 hover:bg-rose-100/70 border border-rose-200 rounded-lg font-bold transition-colors flex items-center gap-1"
                  title="Delete from gallery"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPLACE MEDIA MODAL */}
      <ReplaceMediaModal
        isOpen={!!replaceModalItem}
        item={replaceModalItem}
        onClose={() => setReplaceModalItem(null)}
        onDeleted={(id) => {
          if (activeLightboxPhoto?.id === id) setActiveLightboxPhoto(null);
        }}
      />

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setDeleteConfirmItem(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-700">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-700" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Delete {deleteConfirmItem.mediaType === 'video' ? 'Video' : 'Photo'}?
                </h3>
                <p className="text-[11px] text-stone-500">
                  Section: {getSectionMeta(deleteConfirmItem.category).label}
                </p>
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1">
              <p className="font-bold text-slate-900">{deleteConfirmItem.title}</p>
              <p className="text-[11px] text-stone-500 line-clamp-2">{deleteConfirmItem.caption}</p>
            </div>

            <p className="text-xs text-stone-600">
              Are you sure you want to remove this item? If it was placed in the wrong section, you can also use <strong>Replace</strong> to move it instead of deleting.
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => {
                  const item = deleteConfirmItem;
                  setDeleteConfirmItem(null);
                  setReplaceModalItem(item);
                }}
                className="text-xs font-bold text-emerald-800 hover:underline"
              >
                Change section instead &rarr;
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmItem(null)}
                  className="px-3.5 py-2 text-stone-600 hover:text-stone-900 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    removeGalleryPhoto(deleteConfirmItem.id);
                    if (activeLightboxPhoto?.id === deleteConfirmItem.id) {
                      setActiveLightboxPhoto(null);
                    }
                    setDeleteConfirmItem(null);
                  }}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Confirm Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryView;
