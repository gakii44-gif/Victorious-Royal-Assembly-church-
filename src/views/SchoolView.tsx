import React from 'react';
import { NavView } from '../components/Navbar';
import { PlaceholderImage } from '../components/PlaceholderImage';
import { organizationData } from '../data/organizationData';
import { 
  BookOpen, 
  HeartHandshake, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  Utensils, 
  Droplet,
  ArrowRight,
  School,
  Sparkles,
  Camera
} from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';

interface SchoolViewProps {
  onNavigate: (view: NavView) => void;
  onOpenAssetGuide: () => void;
  onOpenDonateModal: (designation?: 'education' | 'missions' | 'general') => void;
}

export const SchoolView: React.FC<SchoolViewProps> = ({
  onNavigate,
  onOpenAssetGuide,
  onOpenDonateModal,
}) => {
  const { school } = organizationData;
  const { openUploadModal } = usePhotos();

  return (
    <div className="space-y-16 pb-20">
      {/* Banner */}
      <section className="bg-stone-900 text-white py-16 px-4 sm:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-lime-400 font-semibold">
            <span>Christian Educational Ministry</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>Juba, South Sudan</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
            {school.name}
          </h1>

          <p className="text-base sm:text-lg text-emerald-300 font-semibold max-w-3xl">
            {school.headline}
          </p>

          <p className="text-sm text-stone-300 max-w-3xl leading-relaxed">
            {school.supportingText}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenDonateModal('education')}
              className="px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white bg-emerald-800 hover:bg-emerald-700 rounded-md transition-colors shadow-md flex items-center gap-2"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-300" />
              <span>Support Education</span>
            </button>
            <button
              onClick={() => onNavigate('partner')}
              className="px-5 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-md transition-colors"
            >
              Discuss School Partnership &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Hero Campus Photo Slot */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              School Campus &amp; Pupil Assembly
            </h2>
            <button
              onClick={() => openUploadModal(school.photoSlotKey, 'School Campus Photograph')}
              className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Upload Real School Photo</span>
            </button>
          </div>

          <PlaceholderImage
            slotKey={school.photoSlotKey}
            src={school.photoPlaceholderPath}
            alt="Victorious Heritage Primary School Campus in Juba"
            label="Victorious Heritage Primary School Campus"
            recommendedPath="/public/assets/schools/heritage-academy/hero-heritage.jpg"
            aspectRatio="21:9"
            category="school"
            onOpenAssetGuide={onOpenAssetGuide}
          />
        </div>
      </section>

      {/* School Approach & Programs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left 7 Cols: Educational Approach */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                Foundational Education in South Sudan
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                Nurturing Character, Literacy &amp; Faith
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
                {school.overview.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            <div className="space-y-3 bg-stone-50 rounded-xl p-6 border border-stone-200">
              <h3 className="font-bold text-slate-900 text-sm">
                Our Four Core Educational Pillars:
              </h3>
              <ul className="space-y-2 text-xs text-stone-700">
                {school.educationalApproach.map((pillar, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{pillar}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right 5 Cols: Programs Offered */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base border-b border-stone-100 pb-2">
                Classes &amp; Programs Offered
              </h3>
              <div className="space-y-2 text-xs">
                {school.programsOffered.map((prog, i) => (
                  <div key={i} className="p-3 bg-stone-50 rounded border border-stone-100 flex items-center gap-2.5">
                    <School className="w-4 h-4 text-emerald-800 shrink-0" />
                    <span className="font-semibold text-slate-800">{prog}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-emerald-50 rounded text-[11px] text-emerald-950 border border-emerald-200">
                <strong>Honest Information Policy:</strong> Exact pupil enrollment, certified staff counts, and school fees will be updated once confirmed by the education board. We do not publish unverified statistics.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities & Needs Section (Clear editable placeholders) */}
      <section className="bg-stone-100 border-y border-stone-200 py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              School Development
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Current Facilities &amp; Educational Needs
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Areas where international foundations, churches, and donors can partner with Victorious Heritage Primary School.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {school.facilitiesAndNeeds.map((need, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-stone-200 p-6 flex flex-col justify-between shadow-xs hover:border-emerald-300 transition-colors">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 px-2 py-0.5 rounded inline-block">
                    {need.status}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">
                    {need.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {need.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100">
                  <button
                    onClick={() => onNavigate('partner')}
                    className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1"
                  >
                    <span>Discuss Sponsorship</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery Slots */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Classroom &amp; Pupil Life Gallery</h3>
            <p className="text-xs text-stone-500">Reserved for verified photographs of pupils, teachers, and classroom activities</p>
          </div>
          <button
            onClick={onOpenAssetGuide}
            className="text-xs font-semibold text-emerald-800 hover:underline"
          >
            Asset Guide &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {school.gallerySlots.map((slot) => (
            <div key={slot.id} className="space-y-2">
              <PlaceholderImage
                slotKey={slot.slotKey}
                src={slot.path}
                alt={slot.title}
                label={slot.title}
                recommendedPath={`/public${slot.path}`}
                aspectRatio="4:3"
                category="school"
                onOpenAssetGuide={onOpenAssetGuide}
              />
              <p className="text-xs font-semibold text-slate-900">{slot.title}</p>
              <p className="text-[11px] text-stone-500">{slot.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SchoolView;
