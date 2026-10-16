import React from 'react';
import { NavView } from '../components/Navbar';
import { PlaceholderImage } from '../components/PlaceholderImage';
import { organizationData } from '../data/organizationData';
import { Church, Compass, Flame, Users, Baby, CheckCircle2, HeartHandshake, ArrowRight, Camera } from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';

interface MinistriesViewProps {
  onNavigate: (view: NavView) => void;
  onOpenAssetGuide: () => void;
  onOpenDonateModal: () => void;
}

export const MinistriesView: React.FC<MinistriesViewProps> = ({
  onNavigate,
  onOpenAssetGuide,
  onOpenDonateModal,
}) => {
  const { ministries } = organizationData;
  const { openUploadModal } = usePhotos();

  const getIcon = (type: string) => {
    switch (type) {
      case 'worship':
        return <Church className="w-6 h-6 text-emerald-800" />;
      case 'evangelism':
        return <Compass className="w-6 h-6 text-emerald-800" />;
      case 'healing':
        return <Flame className="w-6 h-6 text-emerald-800" />;
      case 'outreach':
        return <Users className="w-6 h-6 text-emerald-800" />;
      case 'children':
        return <Baby className="w-6 h-6 text-emerald-800" />;
      default:
        return <Church className="w-6 h-6 text-emerald-800" />;
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Banner */}
      <section className="bg-stone-900 text-white py-16 px-4 sm:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-lime-400 font-semibold">
            <span>Ministry Arms</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>Juba, South Sudan</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
            Our Ministries
          </h1>

          <p className="text-base sm:text-lg text-stone-300 max-w-3xl leading-relaxed">
            Victorious Royal Assembly International serves the spiritual, relational, and physical needs of people in South Sudan through dedicated pastoral, missionary, and educational ministries.
          </p>
        </div>
      </section>

      {/* Ministries List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {ministries.map((min, idx) => (
          <div 
            key={min.id}
            id={min.id}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center p-8 rounded-2xl border border-stone-200 bg-white shadow-xs ${
              idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            {/* 6 Cols: Photo Slot */}
            <div className={`lg:col-span-6 ${idx % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
              <PlaceholderImage
                slotKey={min.photoSlotKey}
                src={min.photoPlaceholderPath}
                alt={`${min.name} in Juba, South Sudan`}
                label={`${min.name} Photograph`}
                recommendedPath={`/public${min.photoPlaceholderPath}`}
                aspectRatio="16:9"
                category={min.iconType === 'outreach' ? 'outreach' : 'church'}
                onOpenAssetGuide={onOpenAssetGuide}
              />
            </div>

            {/* 6 Cols: Description & Activities */}
            <div className={`lg:col-span-6 space-y-4 ${idx % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  {getIcon(min.iconType)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 font-heading">{min.name}</h2>
                  <p className="text-xs text-emerald-800 font-semibold">{min.subtitle}</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {min.description}
              </p>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
                  Key Ministry Activities:
                </span>
                <ul className="space-y-1.5 text-xs text-stone-600">
                  {min.keyActivities.map((act, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => openUploadModal(min.photoSlotKey, `${min.name} Photograph`)}
                  className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors flex items-center gap-1.5 border border-emerald-200"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Upload Real Ministry Photo</span>
                </button>
                <button
                  onClick={() => onNavigate('contact')}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <span>Connect with this Ministry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Call to Partner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-emerald-950 text-white rounded-2xl p-8 sm:p-12 border border-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-xl sm:text-2xl font-bold font-heading">
              Support Our Ministry Across South Sudan
            </h3>
            <p className="text-xs sm:text-sm text-stone-300">
              Partner churches, mission societies, and individuals are invited to pray, support, and connect with our missionary endeavors in Juba.
            </p>
          </div>
          <button
            onClick={onOpenDonateModal}
            className="px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-emerald-950 bg-white hover:bg-stone-100 rounded-md transition-colors shrink-0 shadow-md"
          >
            Support Our Mission
          </button>
        </div>
      </section>
    </div>
  );
};

export default MinistriesView;
