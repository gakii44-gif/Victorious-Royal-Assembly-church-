import React from 'react';
import { NavView } from '../components/Navbar';
import { VRAILogo } from '../components/VRAILogo';
import { PlaceholderImage } from '../components/PlaceholderImage';
import { organizationData } from '../data/organizationData';
import { ShieldCheck, BookOpen, HeartHandshake, CheckCircle2, MapPin, Church, Camera, User } from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';
import { ThreePillarsSection } from '../components/ThreePillarsSection';

interface AboutViewProps {
  onNavigate: (view: NavView) => void;
  onOpenAssetGuide: () => void;
  onOpenDonateModal: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onNavigate,
  onOpenAssetGuide,
  onOpenDonateModal,
}) => {
  const { openUploadModal } = usePhotos();

  return (
    <div className="space-y-16 pb-20">
      {/* Banner */}
      <section className="bg-stone-900 text-white py-16 px-4 sm:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-lime-400 font-semibold">
            <span>Our Foundation &amp; Calling</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>Juba, South Sudan</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
            About Victorious Royal Assembly International
          </h1>

          <p className="text-base sm:text-lg text-emerald-300 font-semibold max-w-3xl">
            {organizationData.tagline}
          </p>

          <p className="text-sm text-stone-300 max-w-3xl leading-relaxed">
            A Christian missionary ministry based in Juba, South Sudan, dedicated to the Gospel of Jesus Christ, prayer, healing, community deliverance, and education through Victorious Heritage Primary School.
          </p>
        </div>
      </section>

      {/* Main Narrative & Official Seal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              Spiritual &amp; Missionary Calling
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Faith, Healing, Deliverance &amp; Community Service
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
              <p>
                Based in Juba, the capital of South Sudan, Victorious Royal Assembly International was established to minister the living Word of God to individuals, families, and communities. Rooted in the mandate of faith, healing, and spiritual deliverance, our church gathers believers in reverent worship while reaching outward into neighboring communities.
              </p>
              <p>
                Recognizing that spiritual development must be paired with practical love and educational upliftment, the church founded <strong>Victorious Heritage Primary School</strong>. Through this educational ministry, we provide a safe, disciplined, and nurturing environment where children in Juba can gain foundational literacy, numeracy, and biblical values.
              </p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong>Strict Historical &amp; Factual Integrity:</strong>
                <p className="text-emerald-900 mt-0.5">
                  We do not invent founding dates, membership figures, branch lists, or ministry achievements. Historical milestones and official church records will be updated as authorized by the church secretariat.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="p-8 bg-white rounded-2xl border border-stone-200 shadow-sm flex flex-col items-center text-center max-w-sm w-full">
              <div className="w-48 h-48 mb-4">
                <VRAILogo size="100%" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Victorious Royal Assembly</h3>
              <p className="text-xs text-emerald-800 font-semibold mt-0.5">Official Church Insignia</p>
              <p className="text-[11px] text-stone-500 mt-2 italic leading-relaxed">
                The Holy Dove descending over the Open Holy Scriptures with the reading hand, VRAI emblem, and crimson red ribbon.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* THE THREE PILLARS OF OUR MINISTRY */}
      <ThreePillarsSection
        onNavigate={onNavigate}
        onOpenDonateModal={onOpenDonateModal}
      />

      {/* Leadership Profile Placeholders */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-200 pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              Spiritual &amp; Administrative Oversight
            </span>
            <h2 className="text-2xl font-bold text-slate-900 font-heading">
              Pastoral Leadership &amp; Board
            </h2>
            <p className="text-xs text-stone-500">
              Photographs and biographical details waiting for official church provision
            </p>
          </div>
          <button
            onClick={onOpenAssetGuide}
            className="text-xs font-semibold text-emerald-800 hover:underline"
          >
            How to Update Profiles &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-white rounded-xl border border-stone-200 flex flex-col sm:flex-row gap-6 shadow-xs">
            <div className="w-full sm:w-36 shrink-0">
              <PlaceholderImage
                slotKey="leader-overseer"
                src="/assets/church/leadership/senior-pastor.svg"
                alt="Senior Pastor and General Overseer"
                label="Senior Pastor / Overseer"
                recommendedPath="/public/assets/church/leadership/senior-pastor.svg"
                aspectRatio="1:1"
                category="leadership"
                onOpenAssetGuide={onOpenAssetGuide}
              />
            </div>
            <div className="space-y-2 flex-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                Spiritual Oversight
              </span>
              <h3 className="font-bold text-slate-900 text-lg">Senior Pastor / General Overseer</h3>
              <p className="text-xs font-semibold text-emerald-800">Dr. Apostle Andrew Abubakar (G.O)</p>
              <p className="text-xs text-stone-600 leading-relaxed pt-2 border-t border-stone-100">
                Foundational leader of Victorious Royal Assembly International, providing spiritual guidance, pastoral care, and vision for church planting and education in South Sudan.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl border border-stone-200 flex flex-col sm:flex-row gap-6 shadow-xs">
            <div className="w-full sm:w-36 shrink-0">
              <PlaceholderImage
                slotKey="leader-education"
                src="/assets/church/leadership/head-teacher.svg"
                alt="Victorious Heritage Primary School Head of School"
                label="Head of School / Education Board"
                recommendedPath="/public/assets/church/leadership/head-teacher.svg"
                aspectRatio="1:1"
                category="leadership"
                onOpenAssetGuide={onOpenAssetGuide}
              />
            </div>
            <div className="space-y-2 flex-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                Academic Administration
              </span>
              <h3 className="font-bold text-slate-900 text-lg">Head of Primary School</h3>
              <p className="text-xs font-mono text-stone-500">[Head of School Name — Update with official name]</p>
              <p className="text-xs text-stone-600 leading-relaxed pt-2 border-t border-stone-100">
                Directing daily educational activities, curriculum alignment, teacher development, and pupil welfare at Victorious Heritage Primary School in Juba.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutView;
