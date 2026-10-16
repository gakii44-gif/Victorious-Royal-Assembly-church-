import React, { useState } from 'react';
import { NavView } from '../components/Navbar';
import { organizationData } from '../data/organizationData';
import { MapPin, Mail, Phone, Clock, Send, CheckCircle2, ShieldCheck, Map, AlertCircle, ExternalLink } from 'lucide-react';

interface ContactViewProps {
  onNavigate: (view: NavView) => void;
  onOpenAssetGuide: () => void;
  onOpenDonateModal: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({
  onNavigate,
  onOpenAssetGuide,
  onOpenDonateModal,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [enquiryType, setEnquiryType] = useState('General Church Inquiry');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Banner */}
      <section className="bg-stone-900 text-white py-16 px-4 sm:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-lime-400 font-semibold">
            <span>Direct Channels</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>Juba, South Sudan</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
            Contact Us
          </h1>

          <p className="text-base sm:text-lg text-stone-300 max-w-3xl leading-relaxed">
            Connect directly with the pastoral leadership and school administration of <strong>Victorious Royal Assembly International</strong> and <strong>Victorious Heritage Primary School</strong> in Juba, South Sudan.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left 5 Cols: Contact Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
              <h3 className="font-bold text-slate-900 text-lg border-b border-stone-100 pb-3 flex items-center justify-between">
                <span>Church &amp; School Compound</span>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Juba, South Sudan
                </span>
              </h3>

              <div className="space-y-5 text-xs text-stone-700">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block text-xs">Sanctuary &amp; School Location:</strong>
                    <p className="text-stone-700 font-semibold mt-0.5">
                      {organizationData.location.compoundDescription}
                    </p>
                    <p className="text-stone-500 text-[11px] mt-0.5">
                      {organizationData.location.city}, {organizationData.location.state}, {organizationData.location.country}
                    </p>
                  </div>
                </div>

                {/* Direct Phone Lines from Flier */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="space-y-1.5 w-full">
                    <strong className="text-slate-900 block text-xs">Official Contact Lines (From Church Flier):</strong>
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      <a
                        href={`tel:${organizationData.contact.phone.replace(/\s+/g, '')}`}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 text-slate-900 rounded-md font-mono text-[11px] font-bold border border-stone-200 transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>Line 1: {organizationData.contact.phone}</span>
                      </a>
                      <a
                        href={`tel:${organizationData.contact.phoneSecondary.replace(/\s+/g, '')}`}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 text-slate-900 rounded-md font-mono text-[11px] font-bold border border-stone-200 transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>Line 2: {organizationData.contact.phoneSecondary}</span>
                      </a>
                      <a
                        href={`tel:${organizationData.contact.phoneAlternate.replace(/\s+/g, '')}`}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 text-slate-900 rounded-md font-mono text-[11px] font-bold border border-stone-200 transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>Line 3: {organizationData.contact.phoneAlternate}</span>
                      </a>
                    </div>
                    <div className="pt-1">
                      <a
                        href={`https://wa.me/${organizationData.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-800 hover:text-emerald-950 font-bold inline-flex items-center gap-1 text-[11px] underline underline-offset-2"
                      >
                        <span>Direct WhatsApp: {organizationData.contact.whatsapp}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block text-xs">Email Correspondence:</strong>
                    <p className="text-stone-600 mt-0.5 font-mono select-all">
                      {organizationData.contact.emailPlaceholder}
                    </p>
                    <p className="text-emerald-800 mt-1 font-mono font-semibold select-all text-[11px]">
                      {organizationData.contact.donorLiaisonEmailPlaceholder}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Social Media Channels */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
              <h4 className="font-bold text-slate-900 text-sm border-b border-stone-100 pb-2">
                Official Social Media Channels
              </h4>
              <p className="text-stone-600 text-xs leading-relaxed">
                Stay connected with live-streamed services, youth events, conventions, and school updates from Juba:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <a
                  href={organizationData.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200 rounded-xl transition-all flex items-center gap-3 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="font-bold text-blue-900 text-xs block group-hover:underline">
                      Facebook Page
                    </span>
                    <span className="text-[10px] text-blue-700">
                      Victorious Royal Assembly In'l
                    </span>
                  </div>
                </a>

                <a
                  href={organizationData.socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-stone-100 hover:bg-stone-200/80 border border-stone-200 rounded-xl transition-all flex items-center gap-3 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-black text-white flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-xs block group-hover:underline">
                      TikTok Channel
                    </span>
                    <span className="text-[10px] text-stone-600">
                      @victorious.royal4
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Weekly Services Timetable from Church Flier */}
            <div className="p-6 rounded-xl border border-stone-200 bg-emerald-950 text-white space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-lime-400" />
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                  Weekly Worship &amp; Service Timetable
                </h4>
              </div>

              <div className="space-y-3 text-xs">
                {organizationData.contact.serviceSchedule.map((svc, i) => (
                  <div key={i} className="pb-2.5 border-b border-emerald-900/80 last:border-b-0 last:pb-0">
                    <p className="font-bold text-white flex items-center justify-between">
                      <span>{svc.title}</span>
                      <span className="text-[11px] font-mono text-lime-300 font-semibold">{svc.time}</span>
                    </p>
                    {svc.description && (
                      <p className="text-[11px] text-stone-300 mt-0.5">
                        {svc.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200 p-6 sm:p-8 shadow-xs">
            <h3 className="font-bold text-slate-900 text-lg mb-1">
              Send a Direct Message
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Inquiries are reviewed by the church administration in Juba.
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-900 block mb-1">
                      Full Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Grace Robinson"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-200 rounded focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-900 block mb-1">
                      Email Address <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="grace@partner.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-200 rounded focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-900 block mb-1">
                      Organization (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Church, NGO, or Foundation"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-200 rounded focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-900 block mb-1">
                      Enquiry Type <span className="text-rose-600">*</span>
                    </label>
                    <select
                      value={enquiryType}
                      onChange={(e) => setEnquiryType(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-200 rounded focus:border-emerald-600 focus:outline-hidden bg-white"
                    >
                      <option value="General Church Inquiry">General Church Inquiry</option>
                      <option value="Victorious Heritage Primary School Partnership">Victorious Heritage Primary School Partnership</option>
                      <option value="Mission & Outreach Collaboration">Mission &amp; Outreach Collaboration</option>
                      <option value="International Donor / Grant Discussion">International Donor / Grant Discussion</option>
                      <option value="Campus Visit in Juba">Campus Visit in Juba</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-900 block mb-1">
                    Your Message <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Write your message to the church administration or school leadership..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div className="p-3 bg-stone-50 rounded border border-stone-200 text-[11px] text-stone-500 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    Form integration notice: When backend mail routing or cloud API keys are connected, messages will deliver directly to the church inbox in Juba.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 rounded transition-colors shadow-xs flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                </button>
              </form>
            ) : (
              <div className="p-8 text-center bg-emerald-50 rounded-lg border border-emerald-200 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Message Received</h4>
                <p className="text-xs text-stone-600 max-w-md mx-auto">
                  Thank you, <strong>{fullName}</strong>. Your message regarding <em>{enquiryType}</em> has been recorded. Our team in Juba will review your inquiry and follow up at <strong>{email}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-semibold text-emerald-800 hover:underline pt-2 inline-block"
                >
                  Send another message
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactView;
