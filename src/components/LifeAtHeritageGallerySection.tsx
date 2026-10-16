import React, { useState } from 'react';
import { NavView } from './Navbar';
import { usePhotos } from '../context/PhotoContext';
import { 
  Camera, 
  Upload, 
  ZoomIn, 
  X, 
  Sparkles, 
  HeartHandshake, 
  ArrowRight,
  GraduationCap,
  Users,
  Sun,
  Smile,
  Award,
  Film
} from 'lucide-react';
import { VRAILogo } from './VRAILogo';

interface LifeAtHeritageGallerySectionProps {
  onNavigate: (view: NavView) => void;
  onOpenDonateModal: (designation?: 'heritage' | 'vocational' | 'both' | 'general' | 'education' | 'missions') => void;
  className?: string;
}

interface MosaicItem {
  key: string;
  badge: string;
  title: string;
  subtitle: string;
  alt: string;
  gradientFrom: string;
  gradientTo: string;
  accentColor: string;
  icon: React.ReactNode;
}

export const LifeAtHeritageGallerySection: React.FC<LifeAtHeritageGallerySectionProps> = ({
  onNavigate,
  onOpenDonateModal,
  className = '',
}) => {
  const { getPhoto, openUploadModal, openMultiUploadModal } = usePhotos();
  const [lightboxItem, setLightboxItem] = useState<{ url?: string; title: string; subtitle: string; badge: string } | null>(null);

  // 6 specific mosaic tiles matching the exact composition in the user's screenshot
  const col1Item: MosaicItem = {
    key: 'heritage-graduate-portrait',
    badge: 'Academic Milestone',
    title: 'Young Pupil Graduate',
    subtitle: 'Nursery graduate celebrating in emerald green & gold cap and gown with diploma scroll.',
    alt: 'Young pupil in graduation cap and gown holding diploma scroll at Victorious Heritage Model Academy',
    gradientFrom: '#153628',
    gradientTo: '#0B1C15',
    accentColor: '#D4A353',
    icon: <GraduationCap className="w-8 h-8 text-[#D4A353]" />,
  };

  const col2TopItem: MosaicItem = {
    key: 'heritage-dining-celebration',
    badge: 'School Community',
    title: 'Fellowship & School Meals',
    subtitle: 'Pupils gathered under colorful canopies for warm nutritious porridge and community lunch.',
    alt: 'Outdoor school celebration with pupils seated at tables under colorful canopies in Juba',
    gradientFrom: '#1C3A27',
    gradientTo: '#102217',
    accentColor: '#84CC16',
    icon: <Users className="w-6 h-6 text-lime-400" />,
  };

  const col2BottomItem: MosaicItem = {
    key: 'heritage-playground-fun',
    badge: 'Recreation & Play',
    title: 'Early Childhood Play',
    subtitle: 'Young pupils cooling off and playing on the playground slides and play equipment.',
    alt: 'Children enjoying safe recreation and playground play at Victorious Heritage School',
    gradientFrom: '#1A3347',
    gradientTo: '#0C1C29',
    accentColor: '#38BDF8',
    icon: <Sun className="w-6 h-6 text-sky-400" />,
  };

  const col3Item: MosaicItem = {
    key: 'heritage-swings-joy',
    badge: 'Everyday Joy',
    title: 'Playground Swings',
    subtitle: 'Pupils sharing laughter and brotherhood on the purple school swings during morning recess.',
    alt: 'Smiling children on playground swings at Victorious Heritage Primary School',
    gradientFrom: '#2E1E3B',
    gradientTo: '#170E1F',
    accentColor: '#C084FC',
    icon: <Smile className="w-8 h-8 text-purple-400" />,
  };

  const col4TopItem: MosaicItem = {
    key: 'heritage-convocation-leaders',
    badge: 'Leadership & Faculty',
    title: 'Convocation Regalia',
    subtitle: 'Founder Dr. Apostle Andrew Abubakar, church ministers, and educators in ceremonial regalia.',
    alt: 'Victorious Royal Assembly leadership and teachers in academic and African print robes',
    gradientFrom: '#2E2215',
    gradientTo: '#18120B',
    accentColor: '#F59E0B',
    icon: <Award className="w-6 h-6 text-amber-400" />,
  };

  const col4BottomItem: MosaicItem = {
    key: 'heritage-teachers-team',
    badge: 'Teaching Faculty',
    title: 'Dedicated Teachers & Staff',
    subtitle: 'Caring teachers in yellow Victorious Heritage t-shirts committed to nurturing each child.',
    alt: 'Teachers and caregivers wearing yellow Victorious Heritage t-shirts smiling together',
    gradientFrom: '#3B3315',
    gradientTo: '#1E1A0B',
    accentColor: '#EAB308',
    icon: <Users className="w-6 h-6 text-yellow-400" />,
  };

  // Helper renderer for a single photo tile
  const renderTile = (
    item: MosaicItem,
    aspectClass: string,
    isTall: boolean = false
  ) => {
    const photo = getPhoto(item.key);

    return (
      <div
        className={`group relative rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-300 bg-stone-900 ${aspectClass}`}
      >
        {photo ? (
          <img
            src={photo.url}
            alt={photo.alt || item.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
            onClick={() =>
              setLightboxItem({
                url: photo.url,
                title: item.title,
                subtitle: item.subtitle,
                badge: item.badge,
              })
            }
          />
        ) : (
          /* High fidelity representation matching the user screenshot */
          <div
            onClick={() =>
              setLightboxItem({
                title: item.title,
                subtitle: item.subtitle,
                badge: item.badge,
              })
            }
            className="w-full h-full p-5 sm:p-6 flex flex-col justify-between text-white relative cursor-pointer select-none"
            style={{
              background: `linear-gradient(145deg, ${item.gradientFrom} 0%, ${item.gradientTo} 100%)`,
            }}
          >
            {/* Background texture */}
            <div
              className="absolute inset-0 opacity-[0.08] pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)`,
                backgroundSize: '16px 16px',
              }}
            />

            {/* Top Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs"
                style={{
                  backgroundColor: `${item.accentColor}25`,
                  color: item.accentColor,
                  border: `1px solid ${item.accentColor}50`,
                }}
              >
                {item.badge}
              </span>
              <span className="text-[10px] text-stone-400 font-mono">VRAI</span>
            </div>

            {/* Center Graphic */}
            <div className="relative z-10 my-auto text-center space-y-2 py-2">
              <div
                className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center shadow-md backdrop-blur-xs"
                style={{ backgroundColor: `${item.accentColor}20` }}
              >
                {item.icon}
              </div>
              <h4 className="font-bold text-white text-xs sm:text-sm font-heading line-clamp-1">
                {item.title}
              </h4>
              <p className="text-[11px] text-stone-300 leading-snug line-clamp-2 max-w-[220px] mx-auto">
                {item.subtitle}
              </p>
            </div>

            {/* Bottom Tap to View */}
            <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-stone-400">
              <span>Victorious Heritage</span>
              <span className="text-white/80 font-medium group-hover:text-white transition-colors">
                Click to view
              </span>
            </div>
          </div>
        )}

        {/* Hover Action Overlay: Upload Real Photo & Zoom */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3 z-20 backdrop-blur-2xs">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openUploadModal(item.key, item.title);
            }}
            className="px-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-bold shadow-md hover:bg-stone-100 transition-colors flex items-center gap-1.5"
            title="Upload real photograph for this slot"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-800" />
            <span>Upload Photo</span>
          </button>

          <button
            onClick={() =>
              setLightboxItem({
                url: photo?.url,
                title: item.title,
                subtitle: item.subtitle,
                badge: item.badge,
              })
            }
            className="p-1.5 bg-black/60 text-white rounded-lg hover:bg-black/80 transition-colors"
            title="View Fullscreen"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className={`max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-6 ${className}`}>
      {/* Header matching Image 1: GALLERY / Life at Victorious Heritage. */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 font-mono">
          GALLERY
        </span>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#11281E] font-heading tracking-tight">
              Life at Victorious Heritage.
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              Classroom moments, worship, celebrations and community — a glimpse into the everyday joy our pupils bring.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => openMultiUploadModal('heritage')}
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-xs flex items-center gap-2"
            >
              <Upload className="w-3.5 h-3.5 text-lime-300" />
              <span>Upload Photos &amp; Videos</span>
            </button>
            <button
              onClick={() => onNavigate('gallery')}
              className="px-4 py-2.5 text-stone-700 hover:text-emerald-900 font-bold text-xs transition-colors"
            >
              All 4 Galleries &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* 4-Column Bento / Mosaic Layout matching Image 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Column 1: Tall Young Graduate Portrait */}
        <div className="h-full">
          {renderTile(col1Item, 'h-80 sm:h-96 lg:h-full min-h-[380px]', true)}
        </div>

        {/* Column 2: 2 Stacked Tiles (Celebration Dining & Playground Water Slide) */}
        <div className="flex flex-col gap-4 sm:gap-5">
          {renderTile(col2TopItem, 'h-44 sm:h-48 lg:h-[185px]')}
          {renderTile(col2BottomItem, 'h-44 sm:h-48 lg:h-[185px]')}
        </div>

        {/* Column 3: Tall Playground Swings */}
        <div className="h-full">
          {renderTile(col3Item, 'h-80 sm:h-96 lg:h-full min-h-[380px]', true)}
        </div>

        {/* Column 4: 2 Stacked Tiles (Convocation Leaders & Teachers Team) */}
        <div className="flex flex-col gap-4 sm:gap-5">
          {renderTile(col4TopItem, 'h-44 sm:h-48 lg:h-[185px]')}
          {renderTile(col4BottomItem, 'h-44 sm:h-48 lg:h-[185px]')}
        </div>
      </div>

      {/* Interactive Lightbox Modal */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative max-w-3xl w-full bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image or Detailed Preview */}
            <div className="aspect-16/10 sm:aspect-16/9 bg-black flex items-center justify-center overflow-hidden">
              {lightboxItem.url ? (
                <img
                  src={lightboxItem.url}
                  alt={lightboxItem.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="p-8 text-center text-white space-y-4 max-w-md">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-950 border border-emerald-700/50 flex items-center justify-center">
                    <VRAILogo size={40} />
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#D4A353] text-slate-950 uppercase tracking-wider">
                    {lightboxItem.badge}
                  </span>
                  <h3 className="text-xl font-bold font-heading text-white">
                    {lightboxItem.title}
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {lightboxItem.subtitle}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Info Bar */}
            <div className="p-5 bg-stone-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-stone-800">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4A353]">
                  {lightboxItem.badge} · Victorious Heritage Model Academy
                </span>
                <h4 className="font-bold text-sm text-white">
                  {lightboxItem.title}
                </h4>
                <p className="text-xs text-stone-400">
                  {lightboxItem.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setLightboxItem(null);
                    onOpenDonateModal('heritage');
                  }}
                  className="px-4 py-2 bg-[#D4A353] hover:bg-[#B8822A] text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-sm"
                >
                  💚 Help a Child Today
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
