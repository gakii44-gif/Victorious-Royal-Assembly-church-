import React from 'react';
import { NavView } from '../components/Navbar';
import { PlaceholderImage } from '../components/PlaceholderImage';
import { organizationData, CommunityOutreachItem } from '../data/organizationData';
import { HeartHandshake, GraduationCap, Users, Stethoscope, Sparkles } from 'lucide-react';

interface OutreachViewProps {
  onNavigate: (view: NavView) => void;
  onOpenAssetGuide: () => void;
  onOpenDonateModal: (designation?: 'heritage' | 'vocational' | 'both' | 'general' | 'education' | 'missions') => void;
}

export const OutreachView: React.FC<OutreachViewProps> = ({
  onNavigate,
  onOpenAssetGuide,
  onOpenDonateModal,
}) => {
  return (
    <div className="space-y-16 pb-20">
      {/* Banner */}
      <section className="bg-stone-900 text-white py-16 px-4 sm:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-emerald-400 font-semibold">
            <span>Community Upliftment &amp; Honors</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>Juba, South Sudan</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
            Community Outreach &amp; Missionary Programs
          </h1>

          <p className="text-base sm:text-lg text-stone-300 max-w-3xl leading-relaxed">
            Beyond the classroom walls, Victorious Royal Assembly International reaches into the neighborhoods of Juba with medical support, widow care, youth peace circles, and academic convocations.
          </p>
        </div>
      </section>

      {/* Program Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {organizationData.communityOutreach.map((prog: CommunityOutreachItem) => (
            <div key={prog.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between">
              <div className="p-6 pb-2">
                <PlaceholderImage
                  src={prog.photoPlaceholder}
                  alt={prog.title}
                  label={prog.title}
                  recommendedPath={`/public${prog.photoPlaceholder}`}
                  aspectRatio="16:9"
                  category="outreach"
                  onOpenAssetGuide={onOpenAssetGuide}
                />
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">
                    {prog.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {prog.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500 font-medium">
                    Active Program in Juba
                  </span>
                  <button
                    onClick={() => onOpenDonateModal('general')}
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-2"
                  >
                    Support Program &rarr;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Graduation Convocation Spotlight */}
      <section className="bg-stone-100 border-y border-stone-200 py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              Academic Dignity
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Annual Academic Convocation &amp; Honorary Recognition
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Every year, Victorious Royal Assembly International gathers educators, theological scholars, vocational graduates, and community leaders in Juba for formal academic convocations. Adorned in doctoral and master's academic regalia, we celebrate human achievement under the grace of God.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed space-y-2">
            <p>
              In our recent convocation ceremony, leaders and educators received formal honors for their tireless service to youth education in South Sudan. Such ceremonies inspire both young primary pupils and vocational apprentices to aspire to the highest levels of scholarly, professional, and civic excellence.
            </p>
            <p className="text-stone-500 italic text-[11px]">
              (Photographs from our recent convocation ceremony can be placed into <code className="bg-stone-100 text-emerald-800 px-1 py-0.5 rounded font-mono">/public/assets/church/outreach/convocation-ceremony.svg</code>.)
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OutreachView;
