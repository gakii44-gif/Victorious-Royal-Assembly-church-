import React from 'react';
import { 
  TrendingUp, 
  Award, 
  Globe2, 
  BookOpen, 
  ExternalLink, 
  CheckCircle2, 
  HeartHandshake, 
  Users, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface MonthlyImpactSectionProps {
  onOpenDonateModal: (designation?: 'heritage' | 'vocational' | 'both' | 'general' | 'education' | 'missions') => void;
  onNavigate?: (view: any) => void;
}

export const MonthlyImpactSection: React.FC<MonthlyImpactSectionProps> = ({
  onOpenDonateModal,
  onNavigate,
}) => {
  const currentMonthYear = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  const newsHighlights = [
    {
      source: 'UNICEF South Sudan & MoGEI',
      tag: 'Strategic Grant',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      title: '$58 Million Transforming Education (GPE-TESS) Program Underway',
      date: '2024–2025 Initiative',
      stat: '$58M',
      statLabel: 'National Grant',
      snippet:
        'The Ministry of General Education & Instruction in partnership with UNICEF and Save the Children consortium has mobilized $58M through the Global Partnership for Education, accelerating girls’ enrollment and foundational primary learning.',
      verificationNote: 'Verified UNICEF South Sudan Humanitarian & Development Framework',
      link: 'https://www.unicef.org/southsudan',
    },
    {
      source: 'East Africa Education Monitor',
      tag: 'Enrollment Drive',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
      title: '743,300+ Children Supported with Formal & Alternative Learning',
      date: 'Regional Milestone',
      stat: '743,344',
      statLabel: 'Pupils Reached',
      snippet:
        'Mobilization dialogues across 10 states helped over 97,200 out-of-school children return to primary classrooms, overcoming economic displacement barriers and expanding foundational numeracy in urban and rural hubs.',
      verificationNote: 'UNICEF Annual Humanitarian Sector Report',
      link: 'https://www.unicef.org/southsudan/education',
    },
    {
      source: 'Victorious Heritage Model Academy',
      tag: 'Ground Impact in Juba',
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-200',
      title: 'Daily Nutrition Porridge & Phonics Delivered in Tongping, Juba',
      date: `${currentMonthYear} Update`,
      stat: 'Daily',
      statLabel: 'Meal & Mentorship',
      snippet:
        'While national policies expand, Victorious Heritage delivers frontline nourishment: each child receives warm nutritious grain porridge, qualified Christian teachers, and foundational primary education right inside Juba.',
      verificationNote: 'VRAI Ministry Altar & School Administration Records',
      link: null,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8">
      <div className="bg-gradient-to-br from-stone-900 via-emerald-950 to-stone-900 rounded-3xl p-6 sm:p-10 border border-emerald-900/60 shadow-xl text-white relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div 
          aria-hidden="true" 
          className="absolute -top-32 -right-32 w-80 h-80 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" 
        />
        <div 
          aria-hidden="true" 
          className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" 
        />

        <div className="relative z-10 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-emerald-900/80">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lime-400">
                <TrendingUp className="w-4 h-4 text-lime-400" />
                <span>Monthly Regional Impact &middot; {currentMonthYear}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                Inspiring Progress in East African &amp; South Sudanese Education
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Tracking regional milestones alongside our grassroots mission at Victorious Heritage Primary School in Juba. Your prayers and partnerships directly shape the next generation.
              </p>
            </div>

            <button
              onClick={() => onOpenDonateModal('heritage')}
              className="self-start md:self-auto px-5 py-2.5 bg-lime-400 hover:bg-lime-300 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-950" />
              <span>Sponsor a Pupil This Month</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsHighlights.map((item, idx) => (
              <div
                key={idx}
                className="bg-stone-900/85 backdrop-blur-sm border border-stone-800 hover:border-emerald-700/60 rounded-2xl p-5 flex flex-col justify-between transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                      {item.tag}
                    </span>
                    <span className="text-[10px] font-mono text-stone-400 font-semibold">
                      {item.date}
                    </span>
                  </div>

                  <div className="pt-1">
                    <div className="text-2xl font-black font-heading text-lime-400 font-mono tracking-tight">
                      {item.stat}
                    </div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                      {item.statLabel}
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-white group-hover:text-lime-300 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-stone-300 leading-relaxed">
                    {item.snippet}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-stone-400 font-medium text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{item.source}</span>
                  </span>

                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                    >
                      <span>Read More</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <button
                      onClick={() => onNavigate?.('heritage-academy')}
                      className="text-lime-400 hover:text-lime-300 font-semibold flex items-center gap-1"
                    >
                      <span>School Tour</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Ground-Truth Callout */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-900/40 border border-emerald-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white font-semibold">Grassroots Direct Impact: </strong>
                <span className="text-stone-200">
                  Every $35 sponsored provides a child with a full month of schooling, exercise books, daily morning nutrition porridge, and loving Christian mentorship at Victorious Heritage in Juba.
                </span>
              </div>
            </div>

            <button
              onClick={() => onOpenDonateModal('heritage')}
              className="text-lime-400 hover:text-white font-bold underline shrink-0 transition-colors text-xs"
            >
              Learn About Sponsorship &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
