import React from 'react';
import { NavView } from '../components/Navbar';
import { PlaceholderImage } from '../components/PlaceholderImage';
import { organizationData } from '../data/organizationData';
import { HeartHandshake, Compass, Users, CheckCircle2, ArrowRight, ShieldCheck, Camera } from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';

interface MissionsViewProps {
  onNavigate: (view: NavView) => void;
  onOpenAssetGuide: () => void;
  onOpenDonateModal: () => void;
}

export const MissionsView: React.FC<MissionsViewProps> = ({
  onNavigate,
  onOpenAssetGuide,
  onOpenDonateModal,
}) => {
  const { missionsAndOutreach } = organizationData;
  const { openUploadModal } = usePhotos();

  return (
    <div className="space-y-16 pb-20">
      {/* Banner */}
      <section className="bg-stone-900 text-white py-16 px-4 sm:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-lime-400 font-semibold">
            <span>Grassroots Compassion &amp; Evangelism</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>Juba, South Sudan</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
            Missions &amp; Community Outreach
          </h1>

          <p className="text-base sm:text-lg text-stone-300 max-w-3xl leading-relaxed">
            {missionsAndOutreach.overview}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenDonateModal}
              className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-emerald-800 hover:bg-emerald-700 rounded transition-colors shadow-xs"
            >
              Support Missionary Outreach
            </button>
            <button
              onClick={() => onNavigate('partner')}
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded transition-colors border border-stone-700"
            >
              Discuss NGO / Church Mission Twinning &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Main Focus Areas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              Frontline Compassion
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Touching Lives Across Juba &amp; Central Equatoria
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              In post-conflict South Sudan, social recovery and spiritual wholeness go hand in hand. Victorious Royal Assembly International is actively engaged in grassroots relief: providing basic food staples to widows, hosting community reconciliation vigils, and encouraging youth toward godly citizenship.
            </p>

            <div className="space-y-3 pt-2">
              {missionsAndOutreach.focusAreas.map((area, idx) => (
                <div key={idx} className="p-4 bg-stone-50 rounded-lg border border-stone-200 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <p className="text-xs text-stone-700 leading-relaxed">{area}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-3">
            <PlaceholderImage
              slotKey={missionsAndOutreach.photoSlotKey}
              src={missionsAndOutreach.photoPlaceholderPath}
              alt="Missionary Outreach in Juba"
              label="Missionary Outreach &amp; Community Gathering"
              recommendedPath="/public/assets/church/outreach/convocation-ceremony.jpg"
              aspectRatio="4:3"
              category="outreach"
              onOpenAssetGuide={onOpenAssetGuide}
            />
            <p className="text-xs text-stone-500 text-center italic">
              Space reserved for real photographs from community outreaches and convocations in Juba.
            </p>
          </div>
        </div>
      </section>

      {/* Verified Stories & Reports Grid */}
      <section className="bg-stone-100 border-y border-stone-200 py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              Field Reports
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              Missionary Activities &amp; Outreach Reports
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Confirmed outreach initiatives published directly by our pastoral team in Juba.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white rounded-xl border border-stone-200 space-y-3 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                Annual Convocation
              </span>
              <h3 className="font-bold text-slate-900 text-lg">
                Academic Convocation &amp; Honorary Recognition Ceremony
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Ministers, educators, and community workers gathered in academic doctoral and master's gowns to affirm the dignity of learning, spiritual scholarship, and service to South Sudan.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('news')}
                  className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1"
                >
                  <span>Read Full Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl border border-stone-200 space-y-3 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                Family Welfare
              </span>
              <h3 className="font-bold text-slate-900 text-lg">
                Women's Fellowship Relief &amp; Prayer Circles
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Women from across Juba united in matching church anniversary wax print attire for intercessory prayer and food pack distribution for vulnerable single mothers.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('news')}
                  className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1"
                >
                  <span>Read Full Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MissionsView;
