import React, { useState } from 'react';
import { Menu, X, HeartHandshake, Compass, Camera, Shield } from 'lucide-react';
import { VRAILogo } from './VRAILogo';
import { organizationData } from '../data/organizationData';
import { usePhotos } from '../context/PhotoContext';

export type NavView = 
  | 'home'
  | 'about'
  | 'ministries'
  | 'school'
  | 'heritage-academy'
  | 'vocational-school'
  | 'missions'
  | 'outreach'
  | 'leadership'
  | 'partner'
  | 'donate-partner'
  | 'gallery'
  | 'news'
  | 'contact';

interface NavbarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  onOpenAssetGuide: () => void;
  onOpenDonateModal: () => void;
  onOpenLogoPreview?: (tab?: 'church' | 'school' | 'both') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAssetGuide,
  onOpenDonateModal,
  onOpenLogoPreview,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [schoolsDropdownOpen, setSchoolsDropdownOpen] = useState(false);
  const { photos, openMultiUploadModal, galleryPhotos, schoolLogoUrl } = usePhotos();
  const uploadedCount = Object.keys(photos).length + galleryPhotos.filter(p => p.isUserUploaded).length;

  const navLinks: { label: string; view: NavView; isSchool?: boolean }[] = [
    { label: 'Home', view: 'home' },
    { label: 'About Us', view: 'about' },
    { label: 'Our Ministries', view: 'ministries' },
    { label: 'Our Schools', view: 'school', isSchool: true },
    { label: 'Missions & Outreach', view: 'missions' },
    { label: 'Photo Gallery', view: 'gallery' },
    { label: 'Partner With Us', view: 'partner' },
    { label: 'News & Stories', view: 'news' },
    { label: 'Contact', view: 'contact' },
  ];

  const handleLinkClick = (view: NavView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    setSchoolsDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Trust Ribbon */}
      <div className="bg-emerald-950 text-stone-200 text-xs py-1.5 px-4 sm:px-8 border-b border-emerald-900">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white tracking-wide">VICTORIOUS ROYAL ASSEMBLY INTERNATIONAL</span>
            <span className="text-emerald-600" aria-hidden="true">·</span>
            <span className="text-emerald-300">Juba, South Sudan</span>
            <span className="hidden md:inline text-emerald-600" aria-hidden="true">·</span>
            <span className="hidden md:inline text-stone-400 font-mono text-[11px]">+211 925 332 626</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[11px] text-stone-300">
            {/* Social Media Links from Flier */}
            <div className="flex items-center gap-2 pr-2 border-r border-emerald-800/80">
              <a
                href={organizationData.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white text-emerald-300 font-semibold flex items-center gap-1 transition-colors"
                title="Follow Victorious Royal Assembly International on Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="hidden lg:inline">Facebook</span>
              </a>

              <a
                href={organizationData.socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white text-lime-300 font-semibold flex items-center gap-1 transition-colors"
                title="Follow Victorious Royal Assembly on TikTok (@victorious.royal4)"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
                <span className="hidden lg:inline">TikTok</span>
              </a>
            </div>

            <button
              onClick={() => openMultiUploadModal()}
              className="text-lime-300 hover:text-white font-semibold flex items-center gap-1 transition-colors"
              title="Upload your real church or school photos directly"
            >
              <Camera className="w-3.5 h-3.5 text-lime-400" />
              <span>Upload Photos ({uploadedCount})</span>
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => onOpenLogoPreview?.('both')}
              className="text-amber-300 hover:text-white font-semibold flex items-center gap-1 transition-colors"
              title="Preview Official Church and School Logos"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Logos</span>
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={onOpenAssetGuide}
              className="text-stone-300 hover:text-white font-medium flex items-center gap-1 transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Asset Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-6">
        {/* Brand Lockup */}
        <button
          onClick={() => handleLinkClick('home')}
          className="flex items-center gap-3 text-left shrink-0 group focus-visible:outline-2 focus-visible:outline-emerald-600 rounded-lg p-1 -m-1"
        >
          <VRAILogo size={46} showWordmark={true} />
        </button>

        {/* Primary Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-5 text-sm font-medium text-slate-700">
          {navLinks.map((link) => {
            const isSchoolGroup = link.isSchool && (currentView === 'school' || currentView === 'heritage-academy' || currentView === 'vocational-school');
            const isPartnerGroup = link.view === 'partner' && (currentView === 'partner' || currentView === 'donate-partner');
            const isActive = currentView === link.view || isSchoolGroup || isPartnerGroup;

            if (link.isSchool) {
              return (
                <div 
                  key={link.view} 
                  className="relative group py-2"
                  onMouseEnter={() => setSchoolsDropdownOpen(true)}
                  onMouseLeave={() => setSchoolsDropdownOpen(false)}
                >
                  <button
                    onClick={() => handleLinkClick('school')}
                    className={`whitespace-nowrap shrink-0 transition-colors py-1 relative flex items-center gap-1 hover:text-emerald-800 ${
                      isActive ? 'text-emerald-800 font-bold' : 'text-slate-600'
                    }`}
                  >
                    <span>Our Schools</span>
                    <span className="text-[10px] opacity-70">▾</span>
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-700 rounded-full" />
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {schoolsDropdownOpen && (
                    <div className="absolute top-full left-0 w-64 bg-white rounded-lg shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                        Educational Ministries
                      </div>
                      <button
                        onClick={() => handleLinkClick('school')}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-emerald-50 hover:text-emerald-800 flex items-center justify-between"
                      >
                        <span>All Schools Overview</span>
                        <span className="text-[10px] text-stone-400">&rarr;</span>
                      </button>
                      <button
                        onClick={() => handleLinkClick('heritage-academy')}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2.5"
                      >
                        <img 
                          src={schoolLogoUrl} 
                          alt="School Crest" 
                          className="w-7 h-7 object-contain shrink-0 rounded-full border border-stone-200 bg-white" 
                        />
                        <div>
                          <p className="font-semibold text-slate-900">Victorious Heritage Model Academy</p>
                          <p className="text-[11px] text-stone-500">Nursery &amp; Primary Education</p>
                        </div>
                      </button>
                      <button
                        onClick={() => handleLinkClick('vocational-school')}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-900 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">Victorious Vocational School</p>
                          <p className="text-[11px] text-stone-500">Technical Trades &amp; Enterprise</p>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={link.view}
                onClick={() => handleLinkClick(link.view)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative hover:text-emerald-800 ${
                  isActive ? 'text-emerald-800 font-bold' : 'text-slate-600'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-700 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Support Our Mission CTA */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <button
            onClick={() => onOpenDonateModal()}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 bg-[#D4A353] hover:bg-[#C49235] active:bg-[#B58229] transition-all rounded-lg shadow-xs whitespace-nowrap shrink-0 hover:scale-[1.02]"
          >
            <HeartHandshake className="w-4 h-4 text-emerald-950" />
            <span>Donate Today</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex xl:hidden items-center gap-2">
          <button
            onClick={() => handleLinkClick('donate-partner')}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-800 rounded-md"
          >
            Donate
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 rounded-md hover:bg-stone-100"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              if (link.isSchool) {
                return (
                  <div key={link.view} className="space-y-1 py-1 border-y border-stone-100 my-1">
                    <button
                      onClick={() => handleLinkClick('school')}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-bold flex items-center justify-between ${
                        currentView === 'school' ? 'bg-emerald-50 text-emerald-900' : 'text-slate-900 hover:bg-stone-100'
                      }`}
                    >
                      <span>Our Schools (Both Priorities)</span>
                      <span className="text-xs text-emerald-800 font-semibold">View Both</span>
                    </button>
                    <div className="pl-4 space-y-1">
                      <button
                        onClick={() => handleLinkClick('heritage-academy')}
                        className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-medium ${
                          currentView === 'heritage-academy' ? 'bg-emerald-100 text-emerald-950 font-bold' : 'text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        • Victorious Heritage Model Academy (Primary)
                      </button>
                      <button
                        onClick={() => handleLinkClick('vocational-school')}
                        className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-medium ${
                          currentView === 'vocational-school' ? 'bg-amber-100 text-amber-950 font-bold' : 'text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        • Victorious Vocational School (Technical Trades)
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={link.view}
                  onClick={() => handleLinkClick(link.view)}
                  className={`text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    currentView === link.view
                      ? 'bg-emerald-50 text-emerald-900 font-bold'
                      : 'text-slate-700 hover:bg-stone-100'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            <button
              onClick={() => handleLinkClick('donate-partner')}
              className="text-left px-3 py-2.5 rounded-md text-sm font-semibold bg-emerald-800 text-white flex items-center justify-between mt-2"
            >
              <span>Donate &amp; Partner With Us</span>
              <HeartHandshake className="w-4 h-4 text-emerald-300" />
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDonateModal();
              }}
              className="text-left px-3 py-2.5 rounded-md text-sm font-semibold bg-emerald-800 text-white flex items-center justify-between mt-2"
            >
              <span>Support Our Mission</span>
              <HeartHandshake className="w-4 h-4 text-emerald-300" />
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openMultiUploadModal();
              }}
              className="text-left px-3 py-2 text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded font-bold flex items-center gap-1.5 mt-2"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-700" />
              <span>Upload Photos ({uploadedCount} Photos)</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogoPreview?.('both');
              }}
              className="text-left px-3 py-2 text-xs text-amber-900 bg-amber-50 hover:bg-amber-100 rounded font-bold flex items-center gap-1.5 mt-1"
            >
              <Shield className="w-3.5 h-3.5 text-amber-700" />
              <span>Preview Official Logos &amp; Crests</span>
            </button>

            {/* Social Links in Mobile Menu */}
            <div className="pt-3 border-t border-stone-200 mt-2 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-3">Connect With Us</p>
              <a
                href={organizationData.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-xs text-blue-700 hover:bg-blue-50 rounded"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="font-semibold">Facebook: Victorious Royal Assembly</span>
              </a>
              <a
                href={organizationData.socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-xs text-stone-900 hover:bg-stone-100 rounded"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
                <span className="font-semibold">TikTok: @victorious.royal4</span>
              </a>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAssetGuide();
              }}
              className="text-left px-3 py-2 text-xs text-stone-500 hover:text-emerald-700 flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Asset &amp; Verification Guide</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
