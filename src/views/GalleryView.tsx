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
  Film,
  Video
} from 'lucide-react';
import { VRAILogo } from '../components/VRAILogo';
import { LifeAtHeritageGallerySection } from '../components/LifeAtHeritageGallerySection';

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
  const { galleryPhotos, openMultiUploadModal, removeGalleryPhoto } = usePhotos();
  const [activeTab, setActiveTab] = useState<'all' | GalleryCategory>('all');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'photo' | 'video'>('all');
  const [activeLightboxPhoto, setActiveLightboxPhoto] = useState<GalleryPhotoItem | null>(null);

  const categories: { id: GalleryCategory; label: string; icon: React.ReactNode; desc: string }[] = [
    { 
      id: 'heritage', 
      label: 'Life at Victorious Heritage', 
      icon: <GraduationCap className="w-4 h-4 text-emerald-600" />,
      desc: 'Pupils, classrooms, teachers, morning assembly, playtime, adult education, and school milestones in Juba.'
    },
    { 
      id: 'church', 
      label: 'Church Photos & Videos', 
      icon: <Church className="w-4 h-4 text-amber-600" />,
      desc: 'Sunday celebration services, choir praise videos, Word of Faith altar ministry, communion, and healing miracles.'
    },
    { 
      id: 'women', 
      label: 'Women Section Photos & Videos', 
      icon: <Heart className="w-4 h-4 text-rose-500" />,
      desc: 'Women’s Fellowship, anniversary print fabrics & attire, mothers prayer vigils, widow care and community relief.'
    },
    { 
      id: 'vocational', 
      label: 'School Vocational Photos & Videos', 
      icon: <Wrench className="w-4 h-4 text-sky-600" />,
      desc: 'Tailoring & sewing machines, carpentry workshops, solar/electrical trades, artisan apprenticeships.'
    },
  ];

  // Filtering by category & media type
  const categoryFiltered = activeTab === 'all' 
    ? galleryPhotos 
    : galleryPhotos.filter((p) => p.category === activeTab);

  const filteredPhotos = mediaFilter === 'all'
    ? categoryFiltered
    : categoryFiltered.filter((p) => (p.mediaType || 'photo') === mediaFilter);

  const getCategoryMeta = (cat: GalleryCategory) => {
    switch (cat) {
      case 'heritage':
        return {
          label: 'Life at Victorious Heritage',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-600',
        };
      case 'church':
        return {
          label: 'Church & Altar',
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-600',
        };
      case 'women':
        return {
          label: 'Women Section',
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
        };
      case 'vocational':
        return {
          label: 'School Vocational',
          bg: 'bg-sky-50 text-sky-800 border-sky-200',
          dot: 'bg-sky-600',
        };
    }
  };

  const getCategoryCount = (cat: GalleryCategory) => {
    return galleryPhotos.filter((p) => p.category === cat).length;
  };

  const totalPhotosCount = galleryPhotos.filter((p) => (p.mediaType || 'photo') === 'photo').length;
  const totalVideosCount = galleryPhotos.filter((p) => p.mediaType === 'video').length;

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
                Church &amp; School Photo &amp; Video Gallery
              </h1>
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                Explore verified moments of faith, education, and vocational empowerment from <strong>Victorious Royal Assembly International</strong> and <strong>Victorious Heritage Model Nursery &amp; Primary School &amp; Adult Education Centre</strong> in Juba, South Sudan.
              </p>
            </div>

            {/* Direct Multi Upload Trigger for Both Photos & Videos */}
            <button
              onClick={() => openMultiUploadModal(activeTab === 'all' ? 'heritage' : activeTab)}
              className="px-5 py-3 bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2.5 shrink-0 hover:scale-[1.02]"
            >
              <Upload className="w-4 h-4 text-lime-300" />
              <span>Upload Photos &amp; Videos</span>
            </button>
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
                Authentic Photographic &amp; Video Integrity Standard
              </p>
              <p className="text-[11px] text-stone-600">
                This website features exclusively real photographs and video recordings from church and school activities. Uploaded media is saved to the verified archives.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs shrink-0">
            <button
              onClick={() => openMultiUploadModal()}
              className="text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1.5 underline underline-offset-4"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Media Batch</span>
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

        {/* FEATURED SEGMENT: LIFE AT VICTORIOUS HERITAGE MOSAIC */}
        <LifeAtHeritageGallerySection
          onNavigate={onNavigate}
          onOpenDonateModal={onOpenDonateModal}
        />

        {/* 4-Part Category Tabs & Media Type Filters */}
        <div className="space-y-4 pt-4 border-t border-stone-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-xs uppercase tracking-widest font-bold text-stone-500 flex items-center gap-2 font-mono">
              <Filter className="w-3.5 h-3.5 text-emerald-700" />
              <span>Browse by Category &amp; Format</span>
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
                All Media ({categoryFiltered.length})
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
                <span>Photos ({categoryFiltered.filter(p => (p.mediaType || 'photo') === 'photo').length})</span>
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
                <span>Videos ({categoryFiltered.filter(p => p.mediaType === 'video').length})</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'all'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-slate-900'
              }`}
            >
              <span>All Categories</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                activeTab === 'all' ? 'bg-stone-700 text-stone-200' : 'bg-stone-200 text-stone-700'
              }`}>
                {galleryPhotos.length}
              </span>
            </button>

            {categories.map((cat) => {
              const isSelected = activeTab === cat.id;
              const count = getCategoryCount(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-slate-900'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isSelected ? 'bg-emerald-950/80 text-emerald-200' : 'bg-stone-200 text-stone-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Category Description Bar */}
          {activeTab !== 'all' && (
            <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-100 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="font-medium">
                {categories.find((c) => c.id === activeTab)?.desc}
              </p>
              <button
                onClick={() => openMultiUploadModal(activeTab)}
                className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold text-[11px] shrink-0 flex items-center gap-1.5 self-start sm:self-center transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload to {categories.find((c) => c.id === activeTab)?.label}</span>
              </button>
            </div>
          )}
        </div>

        {/* Gallery Grid of Photos & Videos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPhotos.map((item) => {
            const meta = getCategoryMeta(item.category);
            const isUserItem = item.isUserUploaded;
            const isVideo = item.mediaType === 'video';

            return (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                {/* Photo or Video Thumbnail Container */}
                <div 
                  className="relative aspect-4/3 overflow-hidden bg-stone-900 cursor-pointer"
                  onClick={() => setActiveLightboxPhoto(item)}
                >
                  {isUserItem ? (
                    <div className="w-full h-full relative">
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isVideo && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-amber-600/90 hover:bg-amber-500 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 ml-0.5 fill-current" />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Tasteful Branded Placeholder */
                    <div className="w-full h-full bg-gradient-to-br from-emerald-900 via-stone-900 to-emerald-950 p-6 flex flex-col items-center justify-between text-center relative overflow-hidden group-hover:opacity-95 transition-opacity">
                      <div
                        className="absolute inset-0 opacity-[0.08] pointer-events-none"
                        style={{
                          backgroundImage: `radial-gradient(circle at 50% 50%, #84cc16 1.5px, transparent 1.5px)`,
                          backgroundSize: '18px 18px',
                        }}
                      />

                      <div className="relative z-10 w-full flex items-center justify-between text-[10px] text-lime-400 font-semibold tracking-wider uppercase">
                        <span>{meta.label}</span>
                        <span className="bg-stone-800/80 text-stone-300 px-1.5 py-0.5 rounded border border-stone-700">
                          {isVideo ? 'Video Clip' : 'Photo'}
                        </span>
                      </div>

                      <div className="relative z-10 flex flex-col items-center gap-2 my-auto">
                        {isVideo ? (
                          <div className="w-12 h-12 rounded-full bg-amber-500/30 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-md">
                            <Play className="w-6 h-6 ml-0.5 fill-current" />
                          </div>
                        ) : (
                          <VRAILogo size={40} />
                        )}
                        <p className="text-white text-xs font-bold leading-snug max-w-[200px]">
                          {item.title}
                        </p>
                      </div>

                      <div className="relative z-10 w-full pt-1 border-t border-white/10 text-[10px] text-stone-300 flex items-center justify-center gap-1 font-medium">
                        {isVideo ? <Film className="w-3 h-3 text-amber-400" /> : <Camera className="w-3 h-3 text-lime-400" />}
                        <span>Click to play / upload</span>
                      </div>
                    </div>
                  )}

                  {/* Format Badge (Photo vs Video) */}
                  <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md shadow-xs ${
                      isVideo 
                        ? 'bg-amber-600/90 text-white border-amber-400/50' 
                        : 'bg-black/60 text-white border-white/20'
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
                  </div>

                  {/* Duration Badge for Videos */}
                  {isVideo && item.duration && (
                    <div className="absolute bottom-2.5 right-2.5 z-10">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/80 text-white border border-white/20 backdrop-blur-xs">
                        {item.duration}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Info */}
                <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                  <div className="space-y-1">
                    <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${meta.bg}`}>
                      {meta.label}
                    </span>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1 group-hover:text-emerald-800 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                      {item.caption}
                    </p>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      <span>{new Date(item.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      {isUserItem && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Remove this ${isVideo ? 'video' : 'photo'} from gallery?`)) {
                              removeGalleryPhoto(item.id);
                            }
                          }}
                          className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                          title="Delete media item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => setActiveLightboxPhoto(item)}
                        className="text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1 text-[11px]"
                      >
                        {isVideo ? 'Play Video' : 'View Photo'}
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredPhotos.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 space-y-3">
            <Film className="w-10 h-10 text-stone-400 mx-auto" />
            <h4 className="font-bold text-slate-900 text-sm">No media items found in this section</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Be the first to upload videos or photographs for this section.
            </p>
            <button
              onClick={() => openMultiUploadModal(activeTab === 'all' ? 'heritage' : activeTab)}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photos &amp; Videos Now</span>
            </button>
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

      {/* Interactive Lightbox Modal for Photos & Videos */}
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
                  {getCategoryMeta(activeLightboxPhoto.category).label}
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

            {/* Lightbox Media Player (Video or Photo) */}
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
                    <button
                      onClick={() => {
                        const cat = activeLightboxPhoto.category;
                        setActiveLightboxPhoto(null);
                        openMultiUploadModal(cat);
                      }}
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5 text-lime-300" />
                      <span>Upload Video Clip (.mp4, .mov, .webm)</span>
                    </button>
                  </div>
                )
              ) : activeLightboxPhoto.isUserUploaded ? (
                <img
                  src={activeLightboxPhoto.url}
                  alt={activeLightboxPhoto.title}
                  className="w-full h-full object-contain"
                />
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
                  <div className="p-3 bg-stone-900 rounded-lg border border-stone-800 text-[11px] text-lime-400">
                    Placeholders clearly demarcated in accordance with strict authentic integrity standards.
                  </div>
                </div>
              )}
            </div>

            {/* Lightbox Footer Details & Controls */}
            <div className="p-5 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-stone-600">
              <div>
                <p className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                  <span>{activeLightboxPhoto.title}</span>
                  {activeLightboxPhoto.mediaType === 'video' && (
                    <span className="px-2 py-0.5 text-[10px] bg-amber-100 text-amber-900 rounded font-bold">
                      Video Clip
                    </span>
                  )}
                </p>
                <p className="text-stone-500 mt-0.5">
                  {activeLightboxPhoto.caption}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const cat = activeLightboxPhoto.category;
                    setActiveLightboxPhoto(null);
                    openMultiUploadModal(cat);
                  }}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Media for {getCategoryMeta(activeLightboxPhoto.category).label}</span>
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
