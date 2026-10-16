import React from 'react';
import { NavView } from '../components/Navbar';
import { PlaceholderImage } from '../components/PlaceholderImage';
import { organizationData, LeaderItem } from '../data/organizationData';
import { ShieldCheck, UserCheck, FileCheck, HeartHandshake, Compass } from 'lucide-react';

interface LeadershipViewProps {
  onNavigate: (view: NavView) => void;
  onOpenAssetGuide: () => void;
  onOpenDonateModal: (designation?: 'heritage' | 'vocational' | 'both' | 'general' | 'education' | 'missions') => void;
}

export const LeadershipView: React.FC<LeadershipViewProps> = ({
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
            <span>Governance &amp; Stewardship</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>Juba, South Sudan</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
            Leadership &amp; Governance
          </h1>

          <p className="text-base sm:text-lg text-stone-300 max-w-3xl leading-relaxed">
            The pastoral council, educational board of trustees, and administrative officers overseeing <strong>Victorious Royal Assembly International</strong> and our dual schools.
          </p>
        </div>
      </section>

      {/* Leadership Profile Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
            Trust &amp; Oversight
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Pastoral Council &amp; School Governance
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            All names, biographies, and portrait placeholders are clearly designated for easy updating in <code className="text-emerald-800 font-mono">src/data/organizationData.ts</code>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {organizationData.leadership.map((leader: LeaderItem, idx: number) => (
            <div key={idx} className="bg-white rounded-xl border border-stone-200 p-6 flex flex-col sm:flex-row gap-6 shadow-xs">
              <div className="w-full sm:w-40 shrink-0">
                <PlaceholderImage
                  src={leader.photoPlaceholder}
                  alt={leader.title}
                  label={leader.title}
                  recommendedPath={`/public${leader.photoPlaceholder}`}
                  aspectRatio="1:1"
                  category="leadership"
                  onOpenAssetGuide={onOpenAssetGuide}
                />
              </div>

              <div className="space-y-2 flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                  {leader.role}
                </span>
                <h3 className="font-bold text-slate-900 text-lg">
                  {leader.title}
                </h3>
                <p className="text-xs font-mono font-medium text-stone-600">
                  {leader.namePlaceholder}
                </p>
                <p className="text-xs text-stone-500 leading-relaxed pt-2 border-t border-stone-100">
                  {leader.bioPlaceholder}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Financial Stewardship & Donor Integrity Charter */}
      <section className="bg-stone-100 border-y border-stone-200 py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              Stewardship Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Our Financial Accountability Charter
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              International donors and partner NGOs require absolute integrity. Victorious Royal Assembly International enforces four non-negotiable financial pillars:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 bg-white rounded-lg border border-stone-200 space-y-2">
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
              <h4 className="font-bold text-slate-900 text-sm">Designated Fund Separation</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Funds pledged for Heritage Academy or Vocational School are ring-fenced strictly for their designated classrooms, tools, and pupil welfare.
              </p>
            </div>

            <div className="p-5 bg-white rounded-lg border border-stone-200 space-y-2">
              <FileCheck className="w-6 h-6 text-emerald-700" />
              <h4 className="font-bold text-slate-900 text-sm">Itemized Invoices</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                All capital purchases (cement, roofing timber, sewing machines, solar units) are supported by local vendor receipts in Juba.
              </p>
            </div>

            <div className="p-5 bg-white rounded-lg border border-stone-200 space-y-2">
              <UserCheck className="w-6 h-6 text-emerald-700" />
              <h4 className="font-bold text-slate-900 text-sm">Bi-Annual Reports</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Donors receive twice-yearly narrative and photographic progress reports detailing student attendance and workshop production.
              </p>
            </div>

            <div className="p-5 bg-white rounded-lg border border-stone-200 space-y-2">
              <HeartHandshake className="w-6 h-6 text-emerald-700" />
              <h4 className="font-bold text-slate-900 text-sm">External Audit Readiness</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Books and bank statements are prepared for review by visiting foundation liaisons and international audit partners.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LeadershipView;
