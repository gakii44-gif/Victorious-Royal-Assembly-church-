import React, { useState } from 'react';
import { NavView } from '../components/Navbar';
import { organizationData, ProjectProfile } from '../data/organizationData';
import { 
  HeartHandshake, 
  Building2, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Send, 
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

interface PartnerViewProps {
  onNavigate: (view: NavView) => void;
  onOpenAssetGuide: () => void;
  onOpenDonateModal: () => void;
}

export const PartnerView: React.FC<PartnerViewProps> = ({
  onNavigate,
  onOpenAssetGuide,
  onOpenDonateModal,
}) => {
  const { partnership, donationConfig } = organizationData;
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Education' | 'Mission & Community' | 'Church & Institutional'>('All');
  
  // Partnership Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [partnershipType, setPartnershipType] = useState('Education Partnership (Victorious Heritage Primary School)');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const filteredProjects = selectedFilter === 'All' 
    ? partnership.projectProfiles 
    : partnership.projectProfiles.filter(p => p.category === selectedFilter);

  const handleSubmitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate accessible client submission with clear feedback
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 700);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Banner */}
      <section className="bg-stone-900 text-white py-16 px-4 sm:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-lime-400 font-semibold">
            <span>International Strategic Partnerships</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>Juba, South Sudan</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
            {partnership.headline}
          </h1>

          <p className="text-base sm:text-lg text-stone-300 max-w-3xl leading-relaxed">
            {partnership.supportingText}
          </p>
        </div>
      </section>

      {/* THREE PARTNERSHIP TRACKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
            Collaboration Pathways
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            How Organizations &amp; Supporters Can Partner
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Tailored engagement for Christian foundations, international NGOs, partner churches, and philanthropists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {partnership.categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-xl border border-stone-200 p-8 flex flex-col justify-between shadow-xs hover:border-emerald-500 hover:shadow-md transition-all">
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-lg font-heading">{cat.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{cat.description}</p>
                
                <div className="pt-2 border-t border-stone-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 block mb-2">
                    Key Focus Areas:
                  </span>
                  <ul className="space-y-1.5 text-xs text-stone-600">
                    {cat.opportunities.map((opp, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{opp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-100">
                <a
                  href="#enquiry-form"
                  onClick={() => setPartnershipType(cat.title)}
                  className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-emerald-800 hover:bg-emerald-900 rounded-md transition-colors shadow-xs text-center block"
                >
                  {cat.ctaText}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECT PROFILES SECTION (PROPOSED VS ACTIVE) */}
      <section className="bg-stone-100 border-y border-stone-200 py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                Structured Project Profiles
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                Proposed &amp; Active Ministry Projects
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                We clearly distinguish proposed projects from active, funded, or completed projects to maintain absolute credibility with international donors.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 p-1 bg-white rounded-lg border border-stone-200 text-xs">
              {(['All', 'Education', 'Mission & Community'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter as any)}
                  className={`px-3 py-1.5 rounded font-medium transition-colors ${
                    selectedFilter === filter
                      ? 'bg-emerald-800 text-white font-bold'
                      : 'text-stone-600 hover:text-slate-900'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((proj) => (
              <div key={proj.id} className="bg-white rounded-xl border border-stone-200 p-6 flex flex-col justify-between shadow-xs hover:border-emerald-400 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-800">{proj.category}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      proj.status === 'Proposed' 
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : proj.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-stone-100 text-stone-700'
                    }`}>
                      {proj.status} Project
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {proj.projectName}
                  </h3>

                  <div className="space-y-1 text-xs text-stone-600">
                    <strong className="text-slate-900 block text-[11px] uppercase tracking-wider">Problem Being Addressed:</strong>
                    <p className="leading-relaxed">{proj.problemAddressed}</p>
                  </div>

                  <div className="space-y-1 text-xs text-stone-600 pt-2 border-t border-stone-100">
                    <strong className="text-slate-900 block text-[11px] uppercase tracking-wider">Proposed Activities:</strong>
                    <ul className="space-y-1 text-stone-600">
                      {proj.proposedActivities.map((act, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-700 font-bold">·</span>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-stone-100 font-mono">
                    <div>
                      <span className="text-[10px] text-stone-400 block font-sans">Budget Estimate</span>
                      <span className="text-slate-900 font-bold">{proj.estimatedBudget}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block font-sans">Timeline</span>
                      <span className="text-slate-800">{proj.projectTimeline}</span>
                    </div>
                  </div>

                  <div className="text-xs text-stone-500 pt-1">
                    <span className="text-[10px] block font-sans text-stone-400">Target Beneficiaries:</span>
                    <span>{proj.targetBeneficiaries}</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100">
                  <a
                    href="#enquiry-form"
                    onClick={() => {
                      setPartnershipType(`Project Partnership: ${proj.projectName}`);
                      setMessage(`We are interested in discussing sponsorship/grant collaboration for: ${proj.projectName}`);
                    }}
                    className="w-full py-2 text-xs font-semibold text-center text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors block border border-emerald-200"
                  >
                    Discuss This Proposal &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERSHIP ENQUIRY FORM */}
      <section id="enquiry-form" className="max-w-4xl mx-auto px-4 sm:px-8 scroll-mt-24">
        <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 shadow-sm space-y-6">
          <div className="space-y-2 border-b border-stone-200 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              Direct Partnership Channel
            </span>
            <h2 className="text-2xl font-bold text-slate-900 font-heading">
              Partnership Enquiry Form
            </h2>
            <p className="text-xs text-stone-600">
              Complete this form to start a conversation with our leadership in Juba, South Sudan.
            </p>
          </div>

          {!submitSuccess ? (
            <form onSubmit={handleSubmitEnquiry} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-900 block mb-1">
                    Full Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pastor Johnathan Vance"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-md focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-900 block mb-1">
                    Email Address <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="johnathan@church.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-md focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-900 block mb-1">
                    Organization / Church / Foundation Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Grace Global Missions / Hope Trust"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-md focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-900 block mb-1">
                    Partnership Category <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={partnershipType}
                    onChange={(e) => setPartnershipType(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-md focus:border-emerald-600 focus:outline-hidden bg-white"
                  >
                    <option value="Education Partnerships">Education Partnerships (Victorious Heritage Primary School)</option>
                    <option value="Mission & Community Partnerships">Mission &amp; Community Partnerships</option>
                    <option value="Church & Organizational Partnerships">Church &amp; Organizational Partnerships (Twinning / Grants)</option>
                    <option value="Individual Sponsorship">Individual Child or Classroom Sponsorship</option>
                    <option value="Other Partnership">Other Partnership Discussion</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-900 block mb-1">
                  Message / Proposal Summary <span className="text-rose-600">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell us about your organization and how you envision partnering with Victorious Royal Assembly International or Victorious Heritage Primary School..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-md focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded border border-stone-200 text-[11px] text-stone-500">
                <span>Submission note: This enquiry will be routed to </span>
                <code className="text-emerald-800 font-mono font-semibold">{organizationData.contact.donorLiaisonEmailPlaceholder}</code>.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 rounded-md transition-colors shadow-xs flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting Enquiry...' : 'Submit Partnership Enquiry'}</span>
              </button>
            </form>
          ) : (
            <div className="p-8 text-center bg-emerald-50 rounded-xl border border-emerald-200 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">Enquiry Submitted Successfully</h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{fullName}</strong>. Your enquiry regarding <em>{partnershipType}</em> has been logged. Our leadership team in Juba will review your message and reply to <strong>{email}</strong> within 48 business hours.
              </p>
              <button
                type="button"
                onClick={() => setSubmitSuccess(false)}
                className="text-xs font-semibold text-emerald-800 hover:underline pt-2 inline-block"
              >
                Send another enquiry
              </button>
            </div>
          )}
        </div>
      </section>

      {/* DONATION & FUNDRAISING CONFIGURATION NOTICE */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="p-6 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-3">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Fundraising Integrity &amp; Payment Processor Policy</span>
          </div>
          <p className="leading-relaxed">
            {donationConfig.noticeText}
          </p>
          <p className="text-[11px] text-stone-500">
            Support categories ready for activation: <strong>{donationConfig.allocationOptions.map(o => o.name).join(' · ')}</strong>.
          </p>
        </div>
      </section>
    </div>
  );
};

export default PartnerView;
