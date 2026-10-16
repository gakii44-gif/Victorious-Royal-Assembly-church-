import React, { useState, useEffect } from 'react';
import Navbar, { NavView } from './components/Navbar';
import Footer from './components/Footer';
import AssetGuideModal from './components/AssetGuideModal';
import QuickDonateModal from './components/QuickDonateModal';
import { PhotoUploadModal } from './components/PhotoUploadModal';
import { MultiPhotoUploadModal } from './components/MultiPhotoUploadModal';
import { FloatingHelpChildButton } from './components/FloatingHelpChildButton';

// Views
import HomeView from './views/HomeView';
import HeritageAcademyView from './views/HeritageAcademyView';
import VocationalSchoolView from './views/VocationalSchoolView';
import { SchoolView } from './views/SchoolView';
import DonatePartnerView from './views/DonatePartnerView';
import { PartnerView } from './views/PartnerView';
import AboutView from './views/AboutView';
import LeadershipView from './views/LeadershipView';
import OutreachView from './views/OutreachView';
import { MinistriesView } from './views/MinistriesView';
import { MissionsView } from './views/MissionsView';
import { NewsView } from './views/NewsView';
import { GalleryView } from './views/GalleryView';
import ContactView from './views/ContactView';

export function App() {
  const [currentView, setCurrentView] = useState<NavView>('home');
  const [isAssetGuideOpen, setIsAssetGuideOpen] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [donateDesignation, setDonateDesignation] = useState<'heritage' | 'vocational' | 'both' | 'general'>('both');
  const [selectedNewsStoryId, setSelectedNewsStoryId] = useState<string | null>(null);

  // Listen to hash changes for deep links if any
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as NavView;
      const validViews: NavView[] = [
        'home',
        'about',
        'ministries',
        'school',
        'heritage-academy',
        'vocational-school',
        'missions',
        'outreach',
        'leadership',
        'partner',
        'donate-partner',
        'gallery',
        'news',
        'contact',
      ];
      if (validViews.includes(hash)) {
        setCurrentView(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (view: NavView) => {
    setCurrentView(view);
    window.location.hash = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDonateModal = (
    designation?: 'heritage' | 'vocational' | 'both' | 'general' | 'education' | 'missions'
  ) => {
    const mapped: 'heritage' | 'vocational' | 'both' | 'general' = 
      designation === 'education' ? 'heritage' :
      designation === 'missions' ? 'general' :
      (designation || 'both');
    setDonateDesignation(mapped);
    setIsDonateModalOpen(true);
  };

  const handleSelectStory = (storyId: string) => {
    setSelectedNewsStoryId(storyId);
    handleNavigate('news');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeView
            onNavigate={handleNavigate}
            onOpenAssetGuide={() => setIsAssetGuideOpen(true)}
            onOpenDonateModal={handleOpenDonateModal}
            onSelectStory={handleSelectStory}
          />
        );
      case 'school':
        return (
          <SchoolView
            onNavigate={handleNavigate}
            onOpenAssetGuide={() => setIsAssetGuideOpen(true)}
            onOpenDonateModal={handleOpenDonateModal}
          />
        );
      case 'heritage-academy':
        return (
          <HeritageAcademyView
            onNavigate={handleNavigate}
            onOpenAssetGuide={() => setIsAssetGuideOpen(true)}
            onOpenDonateModal={handleOpenDonateModal}
          />
        );
      case 'vocational-school':
        return (
          <VocationalSchoolView
            onNavigate={handleNavigate}
            onOpenAssetGuide={() => setIsAssetGuideOpen(true)}
            onOpenDonateModal={handleOpenDonateModal}
          />
        );
      case 'donate-partner':
        return (
          <DonatePartnerView
            onNavigate={handleNavigate}
            onOpenAssetGuide={() => setIsAssetGuideOpen(true)}
            onOpenDonateModal={handleOpenDonateModal}
          />
        );
      case 'partner':
        return (
          <PartnerView
            onNavigate={handleNavigate}
            onOpenAssetGuide={() => setIsAssetGuideOpen(true)}
            onOpenDonateModal={() => handleOpenDonateModal('both')}
          />
        );
      case 'about':
        return (
          <AboutView
            onNavigate={handleNavigate}
            onOpenAssetGuide={() => setIsAssetGuideOpen(true)}
            onOpenDonateModal={handleOpenDonateModal}
          />
        );
      case 'leadership':
        return (
          <LeadershipView
            onNavigate={handleNavigate}
            onOpenAssetGuide={() => setIsAssetGuideOpen(true)}
            onOpenDonateModal={handleOpenDonateModal}
          />
        );
      case 'ministries':
        return (
          <MinistriesView
            onNavigate={handleNavigate}
            onOpenAssetGuide={() => setIsAssetGuideOpen(true)}
            onOpenDonateModal={() => handleOpenDonateModal('general')}
          />
        );
      case 'missions':
        return (
          <MissionsView
            onNavigate={handleNavigate}
            onOpenAssetGuide={() => setIsAssetGuideOpen(true)}
            onOpenDonateModal={() => handleOpenDonateModal('missions')}
          />
        );
      case 'outreach':
        return (
          <OutreachView
            onNavigate={handleNavigate}
            onOpenAssetGuide={() => setIsAssetGuideOpen(true)}
            onOpenDonateModal={handleOpenDonateModal}
          />
        );
      case 'news':
        return (
          <NewsView
            onNavigate={handleNavigate}
            onOpenAssetGuide={() => setIsAssetGuideOpen(true)}
            selectedStoryId={selectedNewsStoryId}
          />
        );
      case 'gallery':
        return (
          <GalleryView
            onNavigate={handleNavigate}
            onOpenAssetGuide={() => setIsAssetGuideOpen(true)}
            onOpenDonateModal={handleOpenDonateModal}
          />
        );
      case 'contact':
        return (
          <ContactView
            onNavigate={handleNavigate}
            onOpenAssetGuide={() => setIsAssetGuideOpen(true)}
            onOpenDonateModal={handleOpenDonateModal}
          />
        );
      default:
        return (
          <HomeView
            onNavigate={handleNavigate}
            onOpenAssetGuide={() => setIsAssetGuideOpen(true)}
            onOpenDonateModal={handleOpenDonateModal}
            onSelectStory={handleSelectStory}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-slate-900 font-sans selection:bg-emerald-700 selection:text-white">
      {/* Shared Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAssetGuide={() => setIsAssetGuideOpen(true)}
        onOpenDonateModal={() => handleOpenDonateModal('both')}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Institutional Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAssetGuide={() => setIsAssetGuideOpen(true)}
        onOpenDonateModal={() => handleOpenDonateModal('both')}
      />

      {/* Interactive Asset Guide & Content Replacement Documentation Modal */}
      <AssetGuideModal
        isOpen={isAssetGuideOpen}
        onClose={() => setIsAssetGuideOpen(false)}
      />

      {/* Interactive Quick Pledge & Wire Modal */}
      <QuickDonateModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
        defaultDesignation={donateDesignation}
      />

      {/* Single Slot Photo Upload Modal */}
      <PhotoUploadModal />

      {/* Multi-Photo Gallery Upload Modal */}
      <MultiPhotoUploadModal />

      {/* Floating 'Help a Child Today' Button from Design Screenshots */}
      <FloatingHelpChildButton
        onClick={() => handleOpenDonateModal('heritage')}
      />
    </div>
  );
}

export default App;
