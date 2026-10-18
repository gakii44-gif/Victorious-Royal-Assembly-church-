import React from 'react';
import { NavView } from '../components/Navbar';
import { PlaceholderImage } from '../components/PlaceholderImage';
import { EveryChildLearnsSection } from '../components/EveryChildLearnsSection';
import { LifeAtHeritageGallerySection } from '../components/LifeAtHeritageGallerySection';
import { 
  organizationData, 
  SchoolImmediateNeed, 
  SchoolSponsorshipTier, 
  SchoolGalleryPlaceholder 
} from '../data/organizationData';
import { 
  Building2, 
  BookOpen, 
  HeartHandshake, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  Utensils, 
  Droplet,
  ArrowRight
} from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';

interface HeritageAcademyViewProps {
  onNavigate: (view: NavView) => void;
  onOpenAssetGuide: () => void;
  onOpenDonateModal: (designation?: 'heritage' | 'vocational' | 'both' | 'general' | 'education' | 'missions') => void;
}

export const HeritageAcademyView: React.FC<HeritageAcademyViewProps> = ({
  onNavigate,
  onOpenAssetGuide,
  onOpenDonateModal,
}) => {
  const school = organizationData.schools.heritageAcademy;
  const { schoolLogoUrl } = usePhotos();

  return (
    <div className="space-y-16 pb-20">
      {/* School Header Banner */}
      <section className="bg-stone-900 text-white py-16 px-4 sm:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-emerald-400 font-semibold">
              <span>Primary &amp; Nursery Education</span>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <span>{school.level}</span>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <span>Juba, South Sudan</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
              {school.name}
            </h1>

            <p className="text-base sm:text-lg text-amber-300 max-w-3xl font-semibold italic">
              "{school.motto}" · "I Am Victorious"
            </p>

            <p className="text-sm text-stone-300 max-w-3xl leading-relaxed">
              {school.overview}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenDonateModal('heritage')}
                className="px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white bg-emerald-700 hover:bg-emerald-600 rounded-md transition-colors shadow-md flex items-center gap-2"
              >
                <HeartHandshake className="w-4 h-4 text-emerald-300" />
                <span>Sponsor a Heritage Pupil or Classroom</span>
              </button>
              <button
                onClick={() => onNavigate('vocational-school')}
                className="px-4 py-3 text-xs sm:text-sm font-medium text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-md transition-colors"
              >
                View Vocational School Sister Wing &rarr;
              </button>
            </div>
          </div>

          {/* School Crest Display Card */}
          <div className="shrink-0 p-5 bg-white/10 rounded-2xl border border-stone-700/80 backdrop-blur-xs flex flex-col items-center text-center max-w-xs shadow-xl">
            <img 
              src={schoolLogoUrl} 
              alt="Victorious Heritage School Official Crest" 
              className="w-36 h-36 sm:w-44 sm:h-44 object-contain drop-shadow-md transition-transform hover:scale-105 duration-300" 
            />
            <span className="text-xs font-bold text-amber-300 mt-2">Official School Crest</span>
            <span className="text-[11px] text-stone-300">"Knowledge is Victory"</span>
          </div>
        </div>
      </section>

      {/* SEGMENT 1: EVERY CHILD DESERVES AN OPPORTUNITY TO LEARN */}
      <EveryChildLearnsSection
        onNavigate={onNavigate}
        onOpenDonateModal={onOpenDonateModal}
        onOpenAssetGuide={onOpenAssetGuide}
      />

      {/* School Overview & Operational Metrics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left 8 Cols: Curriculum & Vision */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                Foundational Learning
              </span>
              <h2 className="text-2xl font-bold text-slate-900 font-heading">
                Nurturing Character, Literacy &amp; Faith in Juba
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                In a region where conflict and displacement have historically disrupted formal schooling, Victorious Heritage Model Academy serves as a beacon of stability. We welcome pupils regardless of ethnic background, fostering a culture of mutual respect, academic diligence, and biblical values.
              </p>
            </div>

            {/* Curriculum Framework */}
            <div className="bg-stone-50 rounded-xl p-6 border border-stone-200 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-800" />
                South Sudan Standard Primary Curriculum:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700">
                {school.curriculum.map((subj: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-white rounded border border-stone-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium">{subj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* School Welfare & Nutrition Pillar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-white rounded-lg border border-stone-200 space-y-2">
                <div className="w-9 h-9 rounded-md bg-amber-50 text-amber-800 flex items-center justify-center">
                  <Utensils className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Daily School Nutrition</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  For many pupils, morning school porridge and a warm lunch provide their only complete meal of the day, dramatically reducing absenteeism.
                </p>
              </div>

              <div className="p-5 bg-white rounded-lg border border-stone-200 space-y-2">
                <div className="w-9 h-9 rounded-md bg-blue-50 text-blue-800 flex items-center justify-center">
                  <Droplet className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Safe Water &amp; Hygiene</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Dedicated on-site clean water points prevent cholera and waterborne infections, keeping our students healthy and in class.
                </p>
              </div>
            </div>
          </div>

          {/* Right 4 Cols: Statistical & Governance Box */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm border-b border-stone-100 pb-2">
                School Census &amp; Verification
              </h3>
              
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-stone-500 block">Class Levels:</span>
                  <span className="font-semibold text-slate-900">{school.level}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Estimated Enrollment:</span>
                  <span className="font-mono text-slate-900 font-semibold">{school.stats.enrollmentPlaceholder}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Teaching &amp; Support Staff:</span>
                  <span className="font-mono text-slate-900 font-semibold">{school.stats.teachingStaffPlaceholder}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Classrooms Available:</span>
                  <span className="font-mono text-slate-900 font-semibold">{school.stats.classroomsCountPlaceholder}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Campus Location:</span>
                  <span className="text-slate-900 font-medium">{school.location}</span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded border border-stone-200 text-[11px] text-stone-600 space-y-1">
                <span className="font-semibold text-slate-900 block">Admin Note:</span>
                <p>
                  All figures above are maintained in <code className="text-emerald-800 font-mono">src/data/organizationData.ts</code> and can be verified by the school board.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ITEMIZED IMMEDIATE CAPITAL & EXPANSION NEEDS */}
      <section className="bg-stone-50 border-y border-stone-200 py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              Targeted Capital Projects
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Immediate Primary School Priorities
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              International donors and partner congregations can fund any of these specific, itemized initiatives directly with photographic verification upon completion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {school.immediateNeeds.map((need: SchoolImmediateNeed) => (
              <div key={need.id} className="bg-white rounded-xl border border-stone-200 p-5 flex flex-col justify-between shadow-xs hover:border-emerald-300 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-800">{need.category}</span>
                    <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      {need.urgency}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug">
                    {need.title}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {need.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-900">
                    {need.costEstimate}
                  </span>
                  <button
                    onClick={() => onOpenDonateModal('heritage')}
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-2"
                  >
                    Fund Project &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPONSORSHIP TIERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
            Sponsorship Opportunities
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            Invest Directly in a Child's Future
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Every sponsorship package includes formal acknowledgement, direct photo updates, and termly academic cards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {school.sponsorshipTiers.map((tier: SchoolSponsorshipTier) => (
            <div key={tier.id} className="bg-white rounded-xl border border-stone-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-500 block">
                  {tier.period}
                </span>
                <h3 className="text-xl font-bold text-slate-900 font-heading">
                  {tier.title}
                </h3>
                <div className="text-2xl font-black text-emerald-800 font-mono">
                  {tier.amount}
                </div>

                <ul className="space-y-2 text-xs text-stone-600 pt-2 border-t border-stone-100">
                  {tier.benefits.map((b: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-100">
                <button
                  onClick={() => onOpenDonateModal('heritage')}
                  className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-emerald-800 hover:bg-emerald-900 rounded-md transition-colors shadow-xs"
                >
                  Select Sponsorship
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEGMENT 2: LIFE AT VICTORIOUS HERITAGE MOSAIC GALLERY */}
      <LifeAtHeritageGallerySection
        onNavigate={onNavigate}
        onOpenDonateModal={onOpenDonateModal}
      />
    </div>
  );
};

export default HeritageAcademyView;
