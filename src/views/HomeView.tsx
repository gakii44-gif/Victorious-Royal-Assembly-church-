import React from 'react';
import { NavView } from '../components/Navbar';
import { VRAILogo } from '../components/VRAILogo';
import { PlaceholderImage } from '../components/PlaceholderImage';
import { organizationData, ProjectProfile } from '../data/organizationData';
import { 
  Building2, 
  HeartHandshake, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  BookOpen, 
  Church,
  Flame,
  Users,
  Compass,
  Sparkles,
  Baby,
  Calendar,
  ExternalLink,
  Upload,
  Camera,
  Wrench,
  Scissors,
  SunMedium,
  Briefcase,
  GraduationCap,
  Heart,
  Smile,
  Film
} from 'lucide-react';
import { usePhotos, GalleryCategory } from '../context/PhotoContext';
import { EveryChildLearnsSection } from '../components/EveryChildLearnsSection';
import { LifeAtHeritageGallerySection } from '../components/LifeAtHeritageGallerySection';
import { ThreePillarsSection } from '../components/ThreePillarsSection';

interface HomeViewProps {
  onNavigate: (view: NavView) => void;
  onOpenAssetGuide: () => void;
  onOpenDonateModal: (designation?: 'heritage' | 'vocational' | 'both' | 'general' | 'education' | 'missions') => void;
  onSelectStory?: (storyId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenAssetGuide,
  onOpenDonateModal,
  onSelectStory,
}) => {
  const { hero, welcome, missionAndVision, ministries, school, schools, missionsAndOutreach, partnership, newsStories, callToAction, socialLinks } = organizationData;
  const { getPhoto, openUploadModal, galleryPhotos, openMultiUploadModal } = usePhotos();
  const [homeGalleryTab, setHomeGalleryTab] = React.useState<'all' | GalleryCategory>('all');
  const heroPhoto = getPhoto(hero.photoSlotKey);

  const getMinistryIcon = (type: string) => {
    switch (type) {
      case 'worship':
        return <Church className="w-5 h-5 text-emerald-800" />;
      case 'evangelism':
        return <Compass className="w-5 h-5 text-emerald-800" />;
      case 'healing':
        return <Flame className="w-5 h-5 text-emerald-800" />;
      case 'outreach':
        return <Users className="w-5 h-5 text-emerald-800" />;
      case 'children':
        return <Baby className="w-5 h-5 text-emerald-800" />;
      default:
        return <BookOpen className="w-5 h-5 text-emerald-800" />;
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* SECTION B: HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-emerald-950 to-stone-900 text-white pt-16 pb-24 px-4 sm:px-8 border-b border-stone-800">
        {/* Subtle patterned overlay */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, #84cc16 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left 7 Cols: Exact Hero Text & Actions */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-lime-400 font-semibold">
                <span>Christian Missionary Ministry</span>
                <span aria-hidden="true" className="text-stone-600">·</span>
                <span>Juba, South Sudan</span>
                <span aria-hidden="true" className="text-stone-600">·</span>
                <span>Victorious Heritage Primary School</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] font-heading text-balance">
                {hero.headline}
              </h1>

              <p className="text-base sm:text-lg text-stone-200 leading-relaxed max-w-2xl">
                {hero.supportingText}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('about')}
                  className="px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 transition-all rounded-md shadow-md flex items-center gap-2 whitespace-nowrap"
                >
                  <span>{hero.primaryButtonText}</span>
                  <ArrowRight className="w-4 h-4 text-emerald-300" />
                </button>
                <button
                  onClick={() => onNavigate('partner')}
                  className="px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-100 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 rounded-md transition-colors whitespace-nowrap flex items-center gap-2"
                >
                  <HeartHandshake className="w-4 h-4 text-lime-300" />
                  <span>{hero.secondaryButtonText}</span>
                </button>
              </div>
            </div>

            {/* Right 5 Cols: Dedicated Space for Real Photograph or Beautiful Brand Emblem */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              {heroPhoto ? (
                <div className="relative w-full aspect-video sm:aspect-square rounded-2xl overflow-hidden shadow-2xl border border-stone-700 group">
                  <img
                    src={heroPhoto.url}
                    alt={heroPhoto.alt || 'Victorious Royal Assembly International Hero Photograph'}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => openUploadModal(hero.photoSlotKey, 'Hero Banner Photograph')}
                    className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white text-xs font-semibold px-2.5 py-1 rounded backdrop-blur-xs flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Camera className="w-3.5 h-3.5 text-lime-400" />
                    <span>Change Photo</span>
                  </button>
                </div>
              ) : (
                /* Elegant Green-and-White Design with Subtle Patterns & Church Logo */
                <div className="relative p-8 rounded-2xl bg-white/95 text-slate-900 shadow-2xl border border-emerald-200/80 max-w-sm w-full flex flex-col items-center text-center backdrop-blur-sm">
                  <div className="w-44 h-44 sm:w-52 sm:h-52 mb-4">
                    <VRAILogo size="100%" className="w-full h-full" />
                  </div>

                  <h2 className="text-base font-bold text-slate-900 font-heading">
                    Victorious Royal Assembly
                  </h2>
                  <p className="text-xs text-emerald-800 font-semibold mt-0.5">
                    {organizationData.tagline}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-2 leading-relaxed">
                    Juba, Central Equatoria State · Republic of South Sudan
                  </p>

                  <div className="mt-4 pt-3 border-t border-stone-200 w-full flex items-center justify-center">
                    <button
                      onClick={() => openUploadModal(hero.photoSlotKey, 'Homepage Hero Banner Photograph')}
                      className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors flex items-center gap-1.5 border border-emerald-200"
                    >
                      <Camera className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Upload Real Church Photo Here</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C: WELCOME TO VRAI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-xl border border-stone-200 p-8 sm:p-12 shadow-xs space-y-6">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              Christian Missionary Ministry in South Sudan
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              {welcome.title}
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
              {welcome.body.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('about')}
                className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-emerald-800 hover:bg-emerald-900 rounded-md transition-colors shadow-xs inline-flex items-center gap-2"
              >
                <span>{welcome.learnButtonText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* THE THREE PILLARS OF OUR MINISTRY */}
      <ThreePillarsSection
        onNavigate={onNavigate}
        onOpenDonateModal={onOpenDonateModal}
      />

      {/* SECTION E: OUR MINISTRIES */}
      <section className="bg-stone-100 border-y border-stone-200 py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                Frontline Gospel Services
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                Our Ministries
              </h2>
              <p className="text-xs sm:text-sm text-stone-600">
                Serving spiritual, family, and community needs in Juba, South Sudan
              </p>
            </div>
            <button
              onClick={() => onNavigate('ministries')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 shrink-0"
            >
              <span>Explore All Ministries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ministries.map((min) => (
              <div key={min.id} className="bg-white rounded-xl border border-stone-200 p-6 flex flex-col justify-between shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    {getMinistryIcon(min.iconType)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{min.name}</h3>
                    <p className="text-xs text-emerald-800 font-medium">{min.subtitle}</p>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {min.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate('ministries')}
                    className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => openUploadModal(min.photoSlotKey, `${min.name} Photograph`)}
                    className="text-[11px] text-stone-400 hover:text-stone-700 flex items-center gap-1"
                    title="Upload real photograph"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Upload Photo</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEGMENT 1: EVERY CHILD DESERVES AN OPPORTUNITY TO LEARN */}
      <EveryChildLearnsSection
        onNavigate={onNavigate}
        onOpenDonateModal={onOpenDonateModal}
        onOpenAssetGuide={onOpenAssetGuide}
      />

      {/* SECTION F: OUR SCHOOLS — EQUAL PROMINENCE DUAL SPONSORSHIP PRIORITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-widest">
            <BookOpen className="w-3.5 h-3.5 text-emerald-800" />
            <span>Primary Fundraising Priorities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Our Twin Educational Ministries in Juba
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Victorious Royal Assembly International directly operates two complementary institutions with equal strategic priority: equipping children with foundational literacy and empowering youth with market-ready technical trades.
          </p>
        </div>

        {/* Dual School Equal Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* School 1: Victorious Heritage Model Academy */}
          <div className="bg-white rounded-2xl border-2 border-stone-200 overflow-hidden shadow-xs hover:border-emerald-600/60 transition-all flex flex-col justify-between">
            <div className="p-6 sm:p-8 space-y-6">
              {/* Badge & Level */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  Primary &amp; Early Childhood
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  {schools.heritageAcademy.level}
                </span>
              </div>

              {/* Photo Slot */}
              <div className="rounded-xl overflow-hidden border border-stone-200 bg-stone-50">
                <PlaceholderImage
                  slotKey={schools.heritageAcademy.photoSlotKey}
                  src={schools.heritageAcademy.photoPlaceholderPath}
                  alt="Victorious Heritage Model Academy Pupils and Classrooms"
                  label="Heritage Model Academy Campus &amp; Pupils"
                  recommendedPath={schools.heritageAcademy.photoPlaceholderPath}
                  aspectRatio="16:9"
                  category="school"
                  onOpenAssetGuide={onOpenAssetGuide}
                />
              </div>

              {/* Title & Headline */}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900 font-heading">
                  {schools.heritageAcademy.name}
                </h3>
                <p className="text-xs font-semibold text-emerald-800">
                  {schools.heritageAcademy.headline}
                </p>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {schools.heritageAcademy.supportingText}
                </p>
              </div>

              {/* Key Needs Preview */}
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-800" />
                    Immediate Primary Needs:
                  </span>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    4 Priority Projects
                  </span>
                </div>
                <ul className="text-xs text-stone-600 space-y-1.5 pt-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Classroom Weatherproofing &amp; Cement Screed Flooring</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Dual Wooden Pupil Desks to replace floor seating</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Daily Morning Nutrition Porridge &amp; Clean Water Point</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* School 1 Actions */}
            <div className="p-6 sm:p-8 pt-0 border-t border-stone-100 flex flex-wrap items-center gap-3 bg-stone-50/50">
              <button
                onClick={() => onNavigate('heritage-academy')}
                className="flex-1 min-w-[160px] py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-emerald-800 hover:bg-emerald-900 rounded-md transition-colors shadow-xs flex items-center justify-center gap-1.5 text-center"
              >
                <span>View Heritage Academy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onOpenDonateModal('heritage')}
                className="py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-md transition-colors flex items-center gap-1.5"
              >
                <HeartHandshake className="w-4 h-4 text-emerald-800" />
                <span>Sponsor a Pupil</span>
              </button>
            </div>
          </div>

          {/* School 2: Victorious Vocational School */}
          <div className="bg-white rounded-2xl border-2 border-stone-200 overflow-hidden shadow-xs hover:border-amber-600/60 transition-all flex flex-col justify-between">
            <div className="p-6 sm:p-8 space-y-6">
              {/* Badge & Level */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                  Technical Trades &amp; Enterprise
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  {schools.vocationalSchool.level}
                </span>
              </div>

              {/* Photo Slot */}
              <div className="rounded-xl overflow-hidden border border-stone-200 bg-stone-50">
                <PlaceholderImage
                  slotKey={schools.vocationalSchool.photoSlotKey}
                  src={schools.vocationalSchool.photoPlaceholderPath}
                  alt="Victorious Vocational School Workshops and Practical Training"
                  label="Vocational Workshops &amp; Apprenticeship Training"
                  recommendedPath={schools.vocationalSchool.photoPlaceholderPath}
                  aspectRatio="16:9"
                  category="vocational"
                  onOpenAssetGuide={onOpenAssetGuide}
                />
              </div>

              {/* Title & Headline */}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900 font-heading">
                  {schools.vocationalSchool.name}
                </h3>
                <p className="text-xs font-semibold text-amber-800">
                  {schools.vocationalSchool.headline}
                </p>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {schools.vocationalSchool.supportingText}
                </p>
              </div>

              {/* Key Needs Preview */}
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-amber-800" />
                    Immediate Vocational Needs:
                  </span>
                  <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    4 Workshop Needs
                  </span>
                </div>
                <ul className="text-xs text-stone-600 space-y-1.5 pt-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Heavy-Duty Manual Sewing Machines (Tailoring Department)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Solar Technician Training Bench, Meters &amp; Inverters</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Graduate Starter Toolkits for immediate small business launch</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* School 2 Actions */}
            <div className="p-6 sm:p-8 pt-0 border-t border-stone-100 flex flex-wrap items-center gap-3 bg-stone-50/50">
              <button
                onClick={() => onNavigate('vocational-school')}
                className="flex-1 min-w-[160px] py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-amber-800 hover:bg-amber-900 rounded-md transition-colors shadow-xs flex items-center justify-center gap-1.5 text-center"
              >
                <span>View Vocational School</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onOpenDonateModal('vocational')}
                className="py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-md transition-colors flex items-center gap-1.5"
              >
                <HeartHandshake className="w-4 h-4 text-amber-800" />
                <span>Sponsor a Trainee</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dual Impact 50/50 Callout */}
        <div className="bg-gradient-to-r from-emerald-900 via-stone-900 to-amber-950 text-white rounded-2xl p-6 sm:p-8 border border-stone-700 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[11px] uppercase font-bold tracking-widest text-lime-400">
              Equal Impact Partnership
            </span>
            <h4 className="text-xl sm:text-2xl font-bold font-heading">
              Support Both Schools Simultaneously (50/50 Split)
            </h4>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Designate your gift to be distributed equally between primary pupils at Heritage Model Academy and apprentice youths at Victorious Vocational School with consolidated impact reporting.
            </p>
          </div>
          <button
            onClick={() => onNavigate('donate-partner')}
            className="px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-900 bg-lime-400 hover:bg-lime-300 rounded-md transition-all shadow-md shrink-0 whitespace-nowrap flex items-center gap-2"
          >
            <HeartHandshake className="w-4 h-4 text-slate-900" />
            <span>Donate &amp; Partner With Both</span>
          </button>
        </div>
      </section>

      {/* SECTION G: MISSIONS & COMMUNITY OUTREACH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left 5 Cols: Real Photo Slot */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <PlaceholderImage
              slotKey={missionsAndOutreach.photoSlotKey}
              src={missionsAndOutreach.photoPlaceholderPath}
              alt="Victorious Royal Assembly International Missionary Outreach and Convocation"
              label="Missionary Outreach &amp; Community Service"
              recommendedPath="/public/assets/church/outreach/convocation-ceremony.jpg"
              aspectRatio="4:3"
              category="outreach"
              onOpenAssetGuide={onOpenAssetGuide}
            />
          </div>

          {/* Right 7 Cols: Mission Purpose */}
          <div className="lg:col-span-7 space-y-5 order-1 lg:order-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              Grassroots Impact
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Missions &amp; Community Outreach in South Sudan
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {missionsAndOutreach.overview}
            </p>

            <div className="space-y-2 pt-1 text-xs text-stone-700">
              {missionsAndOutreach.focusAreas.map((area, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{area}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('missions')}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-4 flex items-center gap-1"
              >
                <span>Read Verified Missionary Reports</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION H: PARTNER WITH US — INTERNATIONAL DONORS AND NGOS */}
      <section className="bg-stone-900 text-white py-16 px-4 sm:px-8 border-y border-stone-800">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-lime-400 font-bold">
              <ShieldCheck className="w-4 h-4 text-lime-400" />
              <span>International Donor, NGO &amp; Church Collaboration</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
              {partnership.headline}
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed">
              {partnership.supportingText}
            </p>
          </div>

          {/* 3 Partnership Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partnership.categories.map((cat) => (
              <div key={cat.id} className="bg-stone-800/90 rounded-xl border border-stone-700 p-6 flex flex-col justify-between space-y-4 hover:border-emerald-500 transition-colors">
                <div className="space-y-3">
                  <h3 className="font-bold text-white text-base font-heading">{cat.title}</h3>
                  <p className="text-xs text-stone-400 leading-relaxed">{cat.description}</p>
                  <ul className="space-y-1.5 text-xs text-stone-300 pt-2 border-t border-stone-700">
                    {cat.opportunities.map((opp, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-lime-400 shrink-0 mt-0.5" />
                        <span>{opp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-stone-700">
                  <button
                    onClick={() => onNavigate('partner')}
                    className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-emerald-700 hover:bg-emerald-600 rounded transition-colors shadow-xs"
                  >
                    Discuss a Partnership
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Project Profile Area (Showing Proposed vs Active projects) */}
          <div className="space-y-6 pt-6 border-t border-stone-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-white text-lg">Featured Project Profiles</h3>
                <p className="text-xs text-stone-400">
                  Structured proposals available for grant consideration and church sponsorship
                </p>
              </div>
              <button
                onClick={() => onNavigate('partner')}
                className="text-xs text-lime-400 hover:underline flex items-center gap-1"
              >
                <span>View All Proposals &amp; Budgets</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {partnership.projectProfiles.slice(0, 2).map((proj) => (
                <div key={proj.id} className="bg-stone-950/80 rounded-xl border border-stone-800 p-6 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-emerald-400 uppercase font-semibold">{proj.category}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-900/50 text-amber-300 border border-amber-700">
                      {proj.status} Project
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-sm leading-snug">{proj.projectName}</h4>
                  <p className="text-xs text-stone-400 leading-relaxed">{proj.problemAddressed}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-stone-800">
                    <div>
                      <span className="text-[10px] text-stone-500 font-sans block">Budget Estimate:</span>
                      <span className="text-white font-semibold">{proj.estimatedBudget}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 font-sans block">Funding Sought:</span>
                      <span className="text-lime-400 font-semibold">{proj.fundingRequested}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('partner')}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 flex items-center gap-1"
                  >
                    <span>Read Full Proposal &amp; Timeline</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION I: IMPACT AND STORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-200 pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              Verified Updates
            </span>
            <h2 className="text-2xl font-bold text-slate-900 font-heading">
              Impact &amp; Stories
            </h2>
            <p className="text-xs text-stone-500">
              Authentic news, educational milestones, and ministry reports from Juba
            </p>
          </div>
          <button
            onClick={() => onNavigate('news')}
            className="text-xs font-semibold text-emerald-800 hover:underline"
          >
            All Stories &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsStories.map((story) => (
            <div key={story.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between">
              <div className="p-5 pb-2">
                <PlaceholderImage
                  slotKey={story.photoSlotKey}
                  src={story.photoPlaceholderPath}
                  alt={story.title}
                  label={story.title}
                  recommendedPath={`/public${story.photoPlaceholderPath}`}
                  aspectRatio="16:9"
                  category="general"
                  onOpenAssetGuide={onOpenAssetGuide}
                />
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span className="font-semibold text-emerald-800">{story.category}</span>
                    <span>{story.date}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{story.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">{story.summary}</p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (onSelectStory) onSelectStory(story.id);
                      onNavigate('news');
                    }}
                    className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
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

      {/* SECTION: 4-PART PHOTO GALLERY & MULTI-PHOTO UPLOADER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-800">
              <Camera className="w-4 h-4 text-emerald-700" />
              <span>Authentic Church &amp; School Archives</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading mt-1">
              Ministry &amp; Educational Photo Gallery
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
              Divided across our core ministry arms in Juba, South Sudan: Victorious Heritage Primary School, Church &amp; Altar, Women’s Section, and Vocational Technical Training.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => openMultiUploadModal(homeGalleryTab === 'all' ? 'heritage' : homeGalleryTab)}
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2"
            >
              <Upload className="w-3.5 h-3.5 text-lime-300" />
              <span>Upload Multiple Photos</span>
            </button>
            <button
              onClick={() => onNavigate('gallery')}
              className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>Full Gallery ({galleryPhotos.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        {/* Category Tabs */}
        {(() => {
          const isMatchCategory = (itemCat: string, tab: string) => {
            if (tab === 'all') return true;
            if (tab === 'heritage' || tab === 'victorious-heritage') {
              return itemCat === 'victorious-heritage' || itemCat === 'heritage';
            }
            return itemCat === tab;
          };

          const filteredHomeItems = (homeGalleryTab === 'all'
            ? galleryPhotos
            : galleryPhotos.filter((p) => isMatchCategory(p.category, homeGalleryTab))
          ).slice(0, 8);

          return (
            <>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setHomeGalleryTab('all')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    homeGalleryTab === 'all'
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  All Categories ({galleryPhotos.length})
                </button>
                <button
                  onClick={() => setHomeGalleryTab('victorious-heritage')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    homeGalleryTab === 'victorious-heritage' || homeGalleryTab === 'heritage'
                      ? 'bg-emerald-800 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Victorious Heritage</span>
                  <span className="text-[10px] opacity-75 font-mono">
                    ({galleryPhotos.filter(p => isMatchCategory(p.category, 'victorious-heritage')).length})
                  </span>
                </button>
                <button
                  onClick={() => setHomeGalleryTab('church')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    homeGalleryTab === 'church'
                      ? 'bg-amber-800 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <Church className="w-3.5 h-3.5 text-amber-500" />
                  <span>Church</span>
                  <span className="text-[10px] opacity-75 font-mono">
                    ({galleryPhotos.filter(p => p.category === 'church').length})
                  </span>
                </button>
                <button
                  onClick={() => setHomeGalleryTab('women')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    homeGalleryTab === 'women'
                      ? 'bg-rose-700 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>Women</span>
                  <span className="text-[10px] opacity-75 font-mono">
                    ({galleryPhotos.filter(p => p.category === 'women').length})
                  </span>
                </button>
                <button
                  onClick={() => setHomeGalleryTab('vocational')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    homeGalleryTab === 'vocational'
                      ? 'bg-sky-800 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5 text-sky-400" />
                  <span>Vocational</span>
                  <span className="text-[10px] opacity-75 font-mono">
                    ({galleryPhotos.filter(p => p.category === 'vocational').length})
                  </span>
                </button>
                <button
                  onClick={() => setHomeGalleryTab('life-at-heritage')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    homeGalleryTab === 'life-at-heritage'
                      ? 'bg-purple-800 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <Smile className="w-3.5 h-3.5 text-purple-400" />
                  <span>Life at Victorious Heritage</span>
                  <span className="text-[10px] opacity-75 font-mono">
                    ({galleryPhotos.filter(p => p.category === 'life-at-heritage').length})
                  </span>
                </button>
              </div>

              {/* Gallery Preview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {filteredHomeItems.map((item) => {
                  const isUser = item.isUserUploaded;
                  const isVideo = item.mediaType === 'video';
                  const categoryLabel = 
                    (item.category === 'heritage' || item.category === 'victorious-heritage') ? 'Victorious Heritage' :
                    item.category === 'church' ? 'Church' :
                    item.category === 'women' ? 'Women' :
                    item.category === 'vocational' ? 'Vocational' : 'Life at Victorious Heritage';

                  return (
                    <div
                      key={item.id}
                      onClick={() => onNavigate('gallery')}
                      className="group bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                        {isUser ? (
                          <div className="w-full h-full relative">
                            <img
                              src={item.url}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {isVideo && (
                              <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg">
                                  <Film className="w-5 h-5" />
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-950 via-stone-900 to-stone-900 p-5 flex flex-col items-center justify-between text-center relative">
                            <div className="text-[10px] uppercase font-bold text-lime-400 tracking-wider">
                              {categoryLabel}
                            </div>
                            <div className="my-auto flex flex-col items-center gap-1.5">
                              {isVideo ? <Film className="w-7 h-7 text-amber-400" /> : <VRAILogo size={36} />}
                              <p className="text-white text-xs font-bold leading-tight line-clamp-2 px-2">
                                {item.title}
                              </p>
                            </div>
                            <span className="text-[10px] text-stone-400 font-medium">
                              {isVideo ? 'Click to preview video' : 'Click to view / upload'}
                            </span>
                          </div>
                        )}

                        <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                            {categoryLabel}
                          </span>
                          {isVideo && (
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-600 text-white">
                              Video
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-3.5 space-y-1">
                        <h4 className="font-bold text-slate-900 text-xs line-clamp-1 group-hover:text-emerald-800 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                          {item.caption}
                        </p>
                        <div className="pt-2 flex items-center justify-between text-[10px] text-emerald-800 font-bold border-t border-stone-100">
                          <span>Manage &amp; Replace in Gallery</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          );
        })()}



        {/* Social Connect Banner */}
        <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white rounded-2xl p-6 sm:p-8 border border-stone-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-lime-400">
              <Sparkles className="w-4 h-4 text-lime-400" />
              <span>Official Church Channels &amp; Broadcasts</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-heading text-white">
              Watch Services &amp; School Highlights on TikTok and Facebook
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Connect with Victorious Royal Assembly International live from Juba, South Sudan. Contact lines: <strong className="text-white font-mono">+211 925 332 626</strong> / <strong className="text-white font-mono">+211 929 522 922</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook Page</span>
            </a>

            <a
              href={socialLinks.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-black hover:bg-stone-900 border border-stone-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
              <span>TikTok (@victorious.royal4)</span>
            </a>
          </div>
        </div>
      </section>

      {/* SECTION J: CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden border border-emerald-900 shadow-xl">
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-lime-400">
              Take the Next Step
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
              {callToAction.headline}
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed">
              {callToAction.supportingText}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-emerald-950 bg-white hover:bg-stone-100 rounded-md transition-colors shadow-md"
              >
                {callToAction.contactButtonText}
              </button>
              <button
                onClick={() => onNavigate('partner')}
                className="px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white bg-emerald-800 hover:bg-emerald-700 border border-emerald-600 rounded-md transition-colors"
              >
                {callToAction.partnerButtonText}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeView;
