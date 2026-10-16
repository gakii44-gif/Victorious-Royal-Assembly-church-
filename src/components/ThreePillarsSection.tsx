import React from 'react';
import { NavView } from './Navbar';
import { organizationData, PillarItem } from '../data/organizationData';
import { 
  Church, 
  GraduationCap, 
  Wrench, 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  HeartHandshake, 
  ShieldCheck,
  Quote
} from 'lucide-react';
import { VRAILogo } from './VRAILogo';

interface ThreePillarsSectionProps {
  onNavigate: (view: NavView) => void;
  onOpenDonateModal?: (designation?: 'heritage' | 'vocational' | 'both' | 'general' | 'education' | 'missions') => void;
  className?: string;
  showHeading?: boolean;
}

export const ThreePillarsSection: React.FC<ThreePillarsSectionProps> = ({
  onNavigate,
  onOpenDonateModal,
  className = '',
  showHeading = true,
}) => {
  const { threePillars } = organizationData;

  const getPillarIcon = (type: string) => {
    switch (type) {
      case 'church':
        return <Church className="w-6 h-6 text-emerald-700" />;
      case 'school':
        return <GraduationCap className="w-6 h-6 text-amber-600" />;
      case 'vocational':
        return <Wrench className="w-6 h-6 text-sky-600" />;
      default:
        return <Church className="w-6 h-6 text-emerald-700" />;
    }
  };

  const getPillarTheme = (num: number) => {
    switch (num) {
      case 1:
        return {
          border: 'border-emerald-200 hover:border-emerald-500',
          badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          quoteBg: 'bg-emerald-50/70 border-emerald-600',
          scriptureBadge: 'bg-emerald-800 text-white',
          buttonBg: 'bg-emerald-800 hover:bg-emerald-900 text-white',
          numberColor: 'text-emerald-800',
        };
      case 2:
        return {
          border: 'border-amber-200 hover:border-amber-500',
          badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
          quoteBg: 'bg-amber-50/70 border-[#C9933B]',
          scriptureBadge: 'bg-[#C9933B] text-slate-950',
          buttonBg: 'bg-[#C9933B] hover:bg-[#B8822A] text-slate-950 font-bold',
          numberColor: 'text-[#C9933B]',
        };
      case 3:
        return {
          border: 'border-sky-200 hover:border-sky-500',
          badgeBg: 'bg-sky-100 text-sky-900 border-sky-300',
          quoteBg: 'bg-sky-50/70 border-sky-600',
          scriptureBadge: 'bg-sky-800 text-white',
          buttonBg: 'bg-sky-800 hover:bg-sky-900 text-white',
          numberColor: 'text-sky-800',
        };
      default:
        return {
          border: 'border-stone-200 hover:border-stone-400',
          badgeBg: 'bg-stone-100 text-stone-800 border-stone-300',
          quoteBg: 'bg-stone-50 border-stone-400',
          scriptureBadge: 'bg-stone-800 text-white',
          buttonBg: 'bg-stone-800 hover:bg-stone-900 text-white',
          numberColor: 'text-stone-800',
        };
    }
  };

  return (
    <section className={`max-w-7xl mx-auto px-4 sm:px-8 space-y-10 py-10 ${className}`}>
      {showHeading && (
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-bold uppercase tracking-widest border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Spiritual Foundation · Foundational Education · Skills Empowerment</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#11281E] font-heading tracking-tight">
            The Three Pillars of Our Ministry
          </h2>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl mx-auto">
            Spoken directly by Founder &amp; General Overseer <strong>Dr. Apostle Andrew Abubakar (G.O)</strong> — grounded in the Word of God to transform lives across generations in Juba, South Sudan.
          </p>
        </div>
      )}

      {/* 3 Pillar Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {threePillars.map((pillar: PillarItem) => {
          const theme = getPillarTheme(pillar.number);

          return (
            <div
              key={pillar.id}
              className={`bg-white rounded-2xl border-2 ${theme.border} p-7 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300 relative group`}
            >
              {/* Top Bar: Pillar Number & Category Badge */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center shrink-0 shadow-2xs">
                      {getPillarIcon(pillar.iconType)}
                    </div>
                    <div>
                      <span className={`text-xs font-mono font-extrabold uppercase ${theme.numberColor}`}>
                        Pillar 0{pillar.number}
                      </span>
                      <p className="text-[11px] text-stone-500 font-medium">{pillar.badge}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold font-mono tracking-tight shadow-2xs ${theme.scriptureBadge}`}>
                    {pillar.scripture.reference}
                  </span>
                </div>

                {/* Pillar Official Title */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading leading-tight group-hover:text-emerald-900 transition-colors">
                    {pillar.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 font-medium">
                    {pillar.focus}
                  </p>
                </div>

                {/* Official Apostle Abubakar Direct Quote */}
                <div className={`p-5 rounded-xl border-l-4 ${theme.quoteBg} shadow-2xs relative`}>
                  <Quote className="w-5 h-5 text-stone-400/60 absolute top-3 right-3 pointer-events-none" />
                  <blockquote className="text-xs sm:text-sm text-stone-800 font-serif italic leading-relaxed">
                    &ldquo;{pillar.quote}&rdquo;
                  </blockquote>

                  {/* Leader Signature Attribution */}
                  <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-900">
                      {pillar.leader}
                    </span>
                    <span className="text-stone-500 italic">
                      {pillar.role}
                    </span>
                  </div>
                </div>

                {/* Scripture Verse Summary */}
                {pillar.scripture.text && (
                  <p className="text-[11px] text-stone-500 italic px-1 leading-normal">
                    &ldquo;{pillar.scripture.text}&rdquo; — <strong className="text-stone-700 not-italic font-mono">{pillar.scripture.reference}</strong>
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-6 border-t border-stone-100 space-y-2">
                <button
                  onClick={() => onNavigate(pillar.viewTarget as NavView)}
                  className={`w-full py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 ${theme.buttonBg} hover:scale-[1.01]`}
                >
                  <span>
                    {pillar.number === 1
                      ? 'Explore Church & Worship'
                      : pillar.number === 2
                      ? 'Explore Nursery, Primary & Adult Ed'
                      : 'Explore Vocational Trades Centre'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {pillar.number === 2 && onOpenDonateModal && (
                  <button
                    onClick={() => onOpenDonateModal('heritage')}
                    className="w-full py-2 px-3 text-[11px] font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>💚 Sponsor a Vulnerable Pupil ($35/mo)</span>
                  </button>
                )}

                {pillar.number === 3 && onOpenDonateModal && (
                  <button
                    onClick={() => onOpenDonateModal('vocational')}
                    className="w-full py-2 px-3 text-[11px] font-bold text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Equip a Trainee with Tools ($75)</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
