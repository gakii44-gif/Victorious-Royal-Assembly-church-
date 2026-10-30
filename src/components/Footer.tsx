import React from 'react';
import { VRAILogo } from './VRAILogo';
import { NavView } from './Navbar';
import { MapPin, Mail, Phone, ExternalLink, ShieldCheck, HeartHandshake, Compass, Shield, Lock } from 'lucide-react';
import { organizationData } from '../data/organizationData';
import { usePhotos } from '../context/PhotoContext';

interface FooterProps {
  onNavigate: (view: NavView) => void;
  onOpenAssetGuide: () => void;
  onOpenDonateModal: () => void;
  onOpenLogoPreview?: (tab?: 'church' | 'school' | 'both') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenAssetGuide,
  onOpenDonateModal,
  onOpenLogoPreview,
}) => {
  const { isEditorMode, setIsEditorMode } = usePhotos();
  const handleNav = (view: NavView) => {
    onNavigate(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      {/* Donor Integrity Ribbon */}
      <div className="bg-stone-950 py-4 px-4 sm:px-8 border-b border-stone-800/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Verified Donor Transparency Commitment:</strong> 100% of designated school donations go directly to classrooms, learning equipment, and pupil nutrition in Juba.
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onOpenLogoPreview?.('both')}
              className="flex items-center gap-1.5 text-amber-300 hover:text-white transition-colors underline underline-offset-4"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Preview Official Logos &amp; Insignia</span>
            </button>
            <button
              onClick={onOpenAssetGuide}
              className="flex items-center gap-1.5 text-stone-300 hover:text-white transition-colors underline underline-offset-4"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Site Asset &amp; Placeholder Documentation</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Organization Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <VRAILogo size={52} />
              <div>
                <h3 className="font-bold text-white text-base tracking-tight leading-snug">
                  Victorious Royal Assembly International
                </h3>
                <p className="text-xs text-emerald-400 font-medium">
                  {organizationData.subTitle}
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed pr-4">
              A Christian missionary church of the Gospel, healing, and holistic deliverance based in Juba, South Sudan. Patron body for Victorious Heritage Primary School and Victorious Vocational School.
            </p>

            <div className="space-y-2 text-xs text-stone-300 pt-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                {organizationData.location.googleMapsUrl ? (
                  <a
                    href={organizationData.location.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white underline decoration-emerald-500/50 transition-colors"
                    title="Open Church Compound on Google Maps"
                  >
                    <span>{organizationData.location.compoundDescription}</span>
                    <span className="ml-1 text-[10px] text-emerald-400 font-bold">📍 Open Maps</span>
                  </a>
                ) : (
                  <span>{organizationData.location.compoundDescription}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`mailto:${organizationData.contact.donorLiaisonEmailPlaceholder}`}
                  className="hover:text-emerald-300 transition-colors select-all"
                >
                  {organizationData.contact.donorLiaisonEmailPlaceholder}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`tel:${organizationData.contact.phone.replace(/[^0-9+]/g, '')}`}
                  className="hover:text-emerald-300 transition-colors select-all font-mono"
                  title="Call Victorious Royal Assembly"
                >
                  {organizationData.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 fill-emerald-400 shrink-0" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.074-1.638-.344-.814-.339-1.474-.834-2.062-1.422-.588-.588-1.083-1.248-1.422-2.062-.418-1.004-.389-1.326-.344-1.638.05-.333.419-1.026.824-1.17.135-.048.281-.03.393.045.105.07.72 1.737.784 1.871.063.135.048.27-.044.382-.09.112-.178.182-.268.272-.09.09-.187.187-.08.371.107.184.475.784 1.02 1.27.701.625 1.293.818 1.477.91.184.092.292.077.404-.044.112-.12.482-.562.61-.754.128-.192.256-.16.425-.096.17.064 1.08.51 1.265.602.185.092.308.138.353.215.045.077.045.45-.099.855zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.436 5.176L2 22l4.981-1.396A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                </svg>
                <a
                  href={organizationData.contact.whatsappUrl || `https://wa.me/${organizationData.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1.5"
                  title="Direct WhatsApp Chat"
                >
                  <span>WhatsApp:</span>
                  <span className="font-mono text-stone-300 hover:underline">{organizationData.contact.whatsapp}</span>
                </a>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex flex-wrap items-center gap-2.5 pt-3">
              {organizationData.socialLinks.whatsapp && (
                <a
                  href={organizationData.socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-stone-800 hover:bg-emerald-700 text-stone-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors border border-stone-700"
                  title="Chat with Victorious Royal Assembly on WhatsApp (+211 924 351 236)"
                >
                  <svg className="w-3.5 h-3.5 fill-current text-emerald-400" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.074-1.638-.344-.814-.339-1.474-.834-2.062-1.422-.588-.588-1.083-1.248-1.422-2.062-.418-1.004-.389-1.326-.344-1.638.05-.333.419-1.026.824-1.17.135-.048.281-.03.393.045.105.07.72 1.737.784 1.871.063.135.048.27-.044.382-.09.112-.178.182-.268.272-.09.09-.187.187-.08.371.107.184.475.784 1.02 1.27.701.625 1.293.818 1.477.91.184.092.292.077.404-.044.112-.12.482-.562.61-.754.128-.192.256-.16.425-.096.17.064 1.08.51 1.265.602.185.092.308.138.353.215.045.077.045.45-.099.855zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.436 5.176L2 22l4.981-1.396A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                  </svg>
                  <span>WhatsApp</span>
                </a>
              )}
              {organizationData.socialLinks.youtube && (
                <a
                  href={organizationData.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-stone-800 hover:bg-red-700 text-stone-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors border border-stone-700"
                  title="Follow Victorious Royal Assembly International on YouTube (@victoriousroyaltv3141)"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span>YouTube</span>
                </a>
              )}

              <a
                href={organizationData.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-stone-800 hover:bg-blue-600 text-stone-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors border border-stone-700"
                title="Follow Victorious Royal Assembly International on Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </a>

              <a
                href={organizationData.socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors border border-stone-700"
                title="Follow Victorious Royal Assembly on TikTok (@victorious.royal4)"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
                <span>TikTok</span>
              </a>
            </div>
          </div>

          {/* Col 3: Victorious Heritage Model Academy (Primary) */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Primary Education
            </p>
            <h4 className="text-sm font-semibold text-white">
              Heritage Model Academy
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => handleNav('heritage-academy')} className="hover:text-white transition-colors text-left">
                  School Overview &amp; Curriculum
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('heritage-academy')} className="hover:text-white transition-colors text-left">
                  Immediate Classroom Needs
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('heritage-academy')} className="hover:text-white transition-colors text-left">
                  Sponsor a Child's Education
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('heritage-academy')} className="hover:text-white transition-colors text-left">
                  Pupil Nutrition &amp; Clean Water
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('donate-partner')} className="hover:text-emerald-300 text-emerald-400 font-medium transition-colors text-left">
                  Support Primary School &rarr;
                </button>
              </li>
              <li>
                <a
                  href={organizationData.socialLinks.schoolFacebook || "https://www.facebook.com/share/19g3gASbBZ/?mibextid=wwXIfr"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-300 text-blue-400 font-medium transition-colors text-left flex items-center gap-1.5"
                  title="Victorious Heritage School Official Facebook Page"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>School Facebook Page &rarr;</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Victorious Vocational School (Vocational) */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
              Technical Training
            </p>
            <h4 className="text-sm font-semibold text-white">
              Victorious Vocational School
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => handleNav('vocational-school')} className="hover:text-white transition-colors text-left">
                  Trades &amp; Certification Tracks
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('vocational-school')} className="hover:text-white transition-colors text-left">
                  Tailoring &amp; Solar Workshops
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('vocational-school')} className="hover:text-white transition-colors text-left">
                  Carpentry &amp; ICT Training
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('vocational-school')} className="hover:text-white transition-colors text-left">
                  Graduate Startup Toolsets
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('donate-partner')} className="hover:text-amber-300 text-amber-400 font-medium transition-colors text-left">
                  Support Vocational Trainees &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Governance & International Donors */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
              Partnerships
            </p>
            <h4 className="text-sm font-semibold text-white">
              International Donors
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => handleNav('donate-partner')} className="hover:text-white transition-colors text-left">
                  Wire Transfer &amp; Bank Routing
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('donate-partner')} className="hover:text-white transition-colors text-left">
                  50/50 Dual School Fund
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('leadership')} className="hover:text-white transition-colors text-left">
                  Board &amp; Financial Governance
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('outreach')} className="hover:text-white transition-colors text-left">
                  Community &amp; Medical Outreach
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('gallery')} className="hover:text-emerald-300 text-emerald-400 font-semibold transition-colors text-left flex items-center gap-1.5">
                  <span>Photo Gallery (5 Sections) &rarr;</span>
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLogoPreview?.('both')} className="hover:text-amber-300 text-stone-300 transition-colors text-left flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Official Church &amp; School Logos</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-white transition-colors text-left">
                  Schedule Juba Compound Visit
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Neutral Legal Notice */}
        <div className="mt-14 pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>
            &copy; {new Date().getFullYear()} Victorious Royal Assembly International (VRAI). Juba, South Sudan. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-stone-400">
            <span>{organizationData.legalStatusNotice}</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsEditorMode(!isEditorMode)}
              className="text-stone-500 hover:text-stone-300 transition-colors flex items-center gap-1 font-mono text-[11px]"
              title="Toggle Staff Photo & Content Management Mode"
            >
              <Lock className="w-3 h-3 text-stone-500" />
              <span>{isEditorMode ? 'Exit Staff Editor' : 'Staff Access'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
