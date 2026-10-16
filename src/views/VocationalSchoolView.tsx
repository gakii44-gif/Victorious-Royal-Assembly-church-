import React from 'react';
import { NavView } from '../components/Navbar';
import { PlaceholderImage } from '../components/PlaceholderImage';
import { 
  organizationData, 
  SchoolImmediateNeed, 
  SchoolSponsorshipTier, 
  SchoolGalleryPlaceholder 
} from '../data/organizationData';
import { 
  Wrench, 
  Scissors, 
  SunMedium, 
  Laptop, 
  Hammer, 
  HeartHandshake, 
  CheckCircle2, 
  ShieldCheck, 
  Briefcase,
  ArrowRight
} from 'lucide-react';

interface VocationalSchoolViewProps {
  onNavigate: (view: NavView) => void;
  onOpenAssetGuide: () => void;
  onOpenDonateModal: (designation?: 'heritage' | 'vocational' | 'both' | 'general' | 'education' | 'missions') => void;
}

export const VocationalSchoolView: React.FC<VocationalSchoolViewProps> = ({
  onNavigate,
  onOpenAssetGuide,
  onOpenDonateModal,
}) => {
  const school = organizationData.schools.vocationalSchool;

  const tradeIcons: Record<string, React.ReactNode> = {
    'Tailoring': <Scissors className="w-5 h-5 text-amber-800" />,
    'Solar': <SunMedium className="w-5 h-5 text-amber-800" />,
    'Carpentry': <Hammer className="w-5 h-5 text-amber-800" />,
    'Computer': <Laptop className="w-5 h-5 text-amber-800" />,
    'Catering': <Briefcase className="w-5 h-5 text-amber-800" />,
  };

  return (
    <div className="space-y-16 pb-20">
      {/* School Header Banner */}
      <section className="bg-stone-900 text-white py-16 px-4 sm:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-semibold">
            <span>Technical &amp; Vocational Training</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>{school.level}</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>Juba, South Sudan</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
            {school.name}
          </h1>

          <p className="text-base sm:text-lg text-stone-300 max-w-3xl italic">
            "{school.motto}"
          </p>

          <p className="text-sm text-stone-400 max-w-3xl leading-relaxed">
            {school.overview}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenDonateModal('vocational')}
              className="px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white bg-amber-700 hover:bg-amber-600 rounded-md transition-colors shadow-md flex items-center gap-2"
            >
              <HeartHandshake className="w-4 h-4 text-amber-200" />
              <span>Equip a Vocational Trainee or Workshop</span>
            </button>
            <button
              onClick={() => onNavigate('heritage-academy')}
              className="px-4 py-3 text-xs sm:text-sm font-medium text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-md transition-colors"
            >
              View Heritage Primary School Sister Wing &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Official Scripture & Vision Callout from G.O */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-amber-50/80 rounded-2xl border-l-4 border-amber-600 p-6 sm:p-8 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-amber-800 text-white rounded-md text-xs font-bold uppercase tracking-wider font-mono">
              Colossians 3:23
            </span>
            <span className="text-xs text-amber-900 font-bold">
              Dr. Apostle Andrew Abubakar
            </span>
          </div>
          <blockquote className="text-base sm:text-lg text-stone-800 font-serif italic leading-relaxed">
            &ldquo;Our vocational training programme exists to empower individuals with practical skills, restore dignity, and create opportunities for a better future. When we equip one person, we uplift an entire community.&rdquo;
          </blockquote>
          <p className="text-xs text-stone-500 italic">
            &ldquo;Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.&rdquo; — Colossians 3:23
          </p>
        </div>
      </section>

      {/* Hero Workshop Photo Placeholder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="rounded-xl overflow-hidden border border-stone-200 shadow-xs">
          <PlaceholderImage
            src={school.heroImagePlaceholder}
            alt="Victorious Vocational School Training Workshops in Juba"
            label="Victorious Vocational School — Practical Training Workshops"
            recommendedPath="/public/assets/schools/vocational/hero-vocational.jpg"
            aspectRatio="21:9"
            category="vocational"
            onOpenAssetGuide={onOpenAssetGuide}
          />
        </div>
      </section>

      {/* Trades & Curriculum Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left 8 Cols: Practical Tracks */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
                Livelihoods &amp; Self-Reliance
              </span>
              <h2 className="text-2xl font-bold text-slate-900 font-heading">
                Market-Driven Technical Skills for South Sudan's Reconstruction
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                South Sudan relies heavily on imported goods and foreign technical labor. Victorious Vocational School trains local South Sudanese youths, conflict-affected women, and former combatants in practical trades so they can establish sustainable small enterprises right here in Juba.
              </p>
            </div>

            {/* Vocational Trades Grid */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-800" />
                Active Training Departments:
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {school.curriculum.map((trade: string, idx: number) => (
                  <div key={idx} className="p-4 bg-white rounded-lg border border-stone-200 flex items-start gap-3 shadow-xs">
                    <div className="w-8 h-8 rounded bg-amber-50 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-amber-700" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{trade}</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-normal">
                        6-month intensive competency certification with practical workshop hours.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Graduate Launch Philosophy */}
            <div className="p-6 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-800" />
                From Training to Independent Enterprise
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed">
                Certification without tools leaves graduates stranded. Our donor partnership model equips graduating trainees with personal starter toolkits (such as manual sewing machines, solar electrical testers, or woodworking toolboxes) so they can generate income the very week they graduate.
              </p>
            </div>
          </div>

          {/* Right 4 Cols: Statistical & Governance Box */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm border-b border-stone-100 pb-2">
                Vocational Center Census
              </h3>
              
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-stone-500 block">Training Level:</span>
                  <span className="font-semibold text-slate-900">{school.level}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Estimated Trainees:</span>
                  <span className="font-mono text-slate-900 font-semibold">{school.stats.enrollmentPlaceholder}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Master Instructors:</span>
                  <span className="font-mono text-slate-900 font-semibold">{school.stats.teachingStaffPlaceholder}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Active Workshops:</span>
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
                  Workshop inventories and trainee registries are maintained in <code className="text-emerald-800 font-mono">src/data/organizationData.ts</code>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ITEMIZED IMMEDIATE WORKSHOP & EQUIPMENT NEEDS */}
      <section className="bg-stone-50 border-y border-stone-200 py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              Workshop Equipment Needs
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Immediate Vocational Priorities
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Donors can sponsor individual machine stations, solar toolboxes, or full graduate launch kits with direct photographic confirmation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {school.immediateNeeds.map((need: SchoolImmediateNeed) => (
              <div key={need.id} className="bg-white rounded-xl border border-stone-200 p-5 flex flex-col justify-between shadow-xs hover:border-amber-300 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-800">{need.category}</span>
                    <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
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
                    onClick={() => onOpenDonateModal('vocational')}
                    className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline underline-offset-2"
                  >
                    Fund Equipment &rarr;
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
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
            Sponsorship Opportunities
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            Equip a Youth for Self-Reliance
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Every trainee sponsorship includes a student bio card, milestone workshop photos, and graduation certification notice.
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
                <div className="text-2xl font-black text-amber-800 font-mono">
                  {tier.amount}
                </div>

                <ul className="space-y-2 text-xs text-stone-600 pt-2 border-t border-stone-100">
                  {tier.benefits.map((b: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-100">
                <button
                  onClick={() => onOpenDonateModal('vocational')}
                  className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-amber-800 hover:bg-amber-900 rounded-md transition-colors shadow-xs"
                >
                  Select Sponsorship
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PHOTO GALLERY SLOTS (Neutral placeholders) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Workshop &amp; Apprenticeship Gallery</h3>
            <p className="text-xs text-stone-500">Real photographs pending upload to public assets directory</p>
          </div>
          <button
            onClick={onOpenAssetGuide}
            className="text-xs font-medium text-amber-800 hover:underline"
          >
            How to Upload Photos &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {school.galleryPlaceholders.map((item: SchoolGalleryPlaceholder) => (
            <div key={item.id} className="space-y-2">
              <PlaceholderImage
                src={item.path}
                alt={item.title}
                label={item.title}
                recommendedPath={item.path}
                aspectRatio="4:3"
                category="vocational"
                onOpenAssetGuide={onOpenAssetGuide}
              />
              <p className="text-xs text-stone-600 font-medium">{item.title}</p>
              <p className="text-[11px] text-stone-500">{item.caption}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default VocationalSchoolView;
