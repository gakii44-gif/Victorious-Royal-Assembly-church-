import React, { useState } from 'react';
import { NavView } from '../components/Navbar';
import { PlaceholderImage } from '../components/PlaceholderImage';
import { organizationData } from '../data/organizationData';
import { usePhotos, GalleryPhotoItem } from '../context/PhotoContext';
import { ReplaceMediaModal } from '../components/ReplaceMediaModal';
import { 
  BookOpen, 
  HeartHandshake, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  Utensils, 
  Droplet,
  ArrowRight,
  School,
  Sparkles,
  Camera,
  Wrench,
  GraduationCap,
  Hammer,
  Laptop,
  Sun,
  Scissors,
  Coffee,
  Sparkle,
  Trash2,
  RefreshCw,
  Film,
  Play,
  Layers,
  Send,
  Shield,
  HelpCircle
} from 'lucide-react';

interface SchoolViewProps {
  onNavigate: (view: NavView) => void;
  onOpenAssetGuide: () => void;
  onOpenDonateModal: (designation?: 'heritage' | 'vocational' | 'both' | 'general' | 'education' | 'missions') => void;
  onOpenLogoPreview?: (tab?: 'church' | 'school' | 'both') => void;
}

export const SchoolView: React.FC<SchoolViewProps> = ({
  onNavigate,
  onOpenAssetGuide,
  onOpenDonateModal,
  onOpenLogoPreview,
}) => {
  const { school, schools } = organizationData;
  const { 
    openUploadModal, 
    openMultiUploadModal, 
    galleryPhotos, 
    removeGalleryPhoto,
    churchLogoUrl,
    schoolLogoUrl,
  } = usePhotos();

  const [activeTab, setActiveTab] = useState<'all' | 'primary' | 'technical' | 'gallery' | 'admissions'>('all');
  const [replaceMediaItem, setReplaceMediaItem] = useState<GalleryPhotoItem | null>(null);

  // Form state for Admissions & Inquiries
  const [inquiryType, setInquiryType] = useState<'primary' | 'vocational'>('primary');
  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [programChoice, setProgramChoice] = useState('Primary P1 - P4');
  const [notes, setNotes] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Filter photos and videos relevant to the schools
  const schoolMedia = galleryPhotos.filter((item) => 
    item.category === 'victorious-heritage' || 
    item.category === 'vocational' || 
    item.category === 'heritage' ||
    item.category === 'life-at-heritage'
  );

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !contactPhone) return;
    setInquirySubmitted(true);
  };

  const vocationalTrades = [
    {
      id: 'tailoring',
      name: 'Tailoring & Garment Construction',
      icon: <Scissors className="w-5 h-5 text-emerald-700" />,
      desc: 'Pattern drafting, industrial foot & electric sewing machines, school uniforms, ecclesiastical vestments, and African wax print fashion.',
      duration: '6 Months · Practical Certification',
      equipment: 'Foot treadle & electric sewing machines, overlockers, cutting tables'
    },
    {
      id: 'solar',
      name: 'Solar Energy & Electrical Installation',
      icon: <Sun className="w-5 h-5 text-amber-600" />,
      desc: 'Domestic wiring, solar panel mounting, charge controller configuration, inverter repair, and battery bank maintenance for South Sudan.',
      duration: '6 Months · Technical Trade Diploma',
      equipment: 'Multimeters, conduit benders, solar panels, inverters & safety gear'
    },
    {
      id: 'it',
      name: 'Computer Literacy & Digital Office Skills',
      icon: <Laptop className="w-5 h-5 text-sky-600" />,
      desc: 'Touch typing, Microsoft Word documentation, Excel financial bookkeeping, email correspondence, and business record-keeping.',
      duration: '3 - 6 Months · Practical IT Certificate',
      equipment: 'Desktop workstations, printing stations & offline training software'
    },
    {
      id: 'carpentry',
      name: 'Carpentry & Architectural Joinery',
      icon: <Hammer className="w-5 h-5 text-amber-800" />,
      desc: 'Building wooden dual pupil desks, school benches, residential furniture, door frames, and timber roofing joinery.',
      duration: '9 Months · Skilled Artisan Certificate',
      equipment: 'Woodworking benches, circular saws, hand planes, measuring tools'
    },
    {
      id: 'catering',
      name: 'Catering, Baking & Food Production',
      icon: <Coffee className="w-5 h-5 text-rose-600" />,
      desc: 'Commercial bakery, bread & pastry formulation, large-scale conference catering, food hygiene, and mobile food enterprise.',
      duration: '4 Months · Hospitality Certification',
      equipment: 'Commercial baking ovens, industrial mixing bowls, prep stations'
    },
    {
      id: 'cosmetology',
      name: 'Cosmetology & Hair Styling',
      icon: <Sparkle className="w-5 h-5 text-purple-600" />,
      desc: 'Professional hairdressing, braiding, dreadlock care, sanitation, customer relations, and salon micro-enterprise management.',
      duration: '4 Months · Beauty Care Certificate',
      equipment: 'Salon dryers, styling tools, braiding kits, sanitizing units'
    },
  ];

  return (
    <div className="space-y-16 pb-24 bg-stone-50/50">
      
      {/* 1. HERO INSTITUTIONAL BANNER WITH DUAL LOGOS */}
      <section className="bg-stone-900 text-white py-16 px-4 sm:px-8 border-b border-stone-800 relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-950/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-950/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-8">
          
          {/* Top Anchor Tag */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800/80 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
              <span>Anchored by Victorious Royal Assembly International</span>
            </span>
            <span className="text-stone-400 text-xs hidden sm:inline">·</span>
            <span className="text-stone-300 text-xs font-medium">Juba, Central Equatoria, South Sudan</span>
          </div>

          {/* Main Title & Insignia Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left 8 Cols: Titles & Descriptions */}
            <div className="lg:col-span-8 space-y-4">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading leading-tight">
                Our Educational Ministries
              </h1>
              <p className="text-lg sm:text-xl text-emerald-300 font-semibold max-w-2xl">
                Dual Centers of Academic Excellence &amp; Technical Empowerment Under One Spiritual Anchor
              </p>
              <p className="text-sm sm:text-base text-stone-300 max-w-3xl leading-relaxed">
                Victorious Royal Assembly International serves as the mother church and spiritual covering for both <strong>Victorious Heritage Model Nursery &amp; Primary School</strong> (nurturing literacy and character for children) and <strong>Victorious Vocational &amp; Technical Training School</strong> (equipping youths and women with marketable, life-sustaining trades).
              </p>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onOpenDonateModal('education')}
                  className="px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-950 bg-[#D4A353] hover:bg-[#C49235] active:bg-[#B58229] rounded-xl transition-all shadow-md flex items-center gap-2 hover:scale-[1.02]"
                >
                  <HeartHandshake className="w-4 h-4 text-emerald-950" />
                  <span>Sponsor a Student / Needs</span>
                </button>

                <button
                  onClick={() => openMultiUploadModal('victorious-heritage')}
                  className="px-5 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-emerald-200 hover:text-white bg-emerald-900/70 hover:bg-emerald-800 border border-emerald-700/80 rounded-xl transition-colors flex items-center gap-2"
                >
                  <Camera className="w-4 h-4 text-lime-400" />
                  <span>Upload School Media</span>
                </button>

                {onOpenLogoPreview && (
                  <button
                    onClick={() => onOpenLogoPreview('both')}
                    className="px-5 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-300 hover:text-white bg-stone-800/90 hover:bg-stone-700 border border-stone-700 rounded-xl transition-colors flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span>Preview Official Logos</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right 4 Cols: Interactive Official Seals Lockup */}
            <div className="lg:col-span-4">
              <div className="bg-stone-800/90 rounded-2xl border border-stone-700 p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-stone-700">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Official Insignia
                  </span>
                  <span className="text-[10px] bg-stone-700 text-stone-300 px-2 py-0.5 rounded-full font-mono">
                    Vector Seals
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center justify-items-center py-2">
                  {/* Church Seal */}
                  <div 
                    onClick={() => onOpenLogoPreview?.('church')}
                    className="cursor-pointer group flex flex-col items-center text-center space-y-2 p-2 rounded-xl hover:bg-stone-700/50 transition-colors"
                    title="Click to inspect Church Seal"
                  >
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/10 p-2 border border-emerald-500/30 group-hover:scale-105 group-hover:border-emerald-400 transition-all flex items-center justify-center">
                      <img 
                        src={churchLogoUrl} 
                        alt="Victorious Royal Assembly International Official Church Seal" 
                        className="w-full h-full object-contain drop-shadow"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-white leading-tight">
                      VRAI Church Seal
                    </span>
                    <span className="text-[10px] text-emerald-400">
                      The Mother Anchor
                    </span>
                  </div>

                  {/* School Crest */}
                  <div 
                    onClick={() => onOpenLogoPreview?.('school')}
                    className="cursor-pointer group flex flex-col items-center text-center space-y-2 p-2 rounded-xl hover:bg-stone-700/50 transition-colors"
                    title="Click to inspect School Crest"
                  >
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/10 p-2 border border-amber-500/30 group-hover:scale-105 group-hover:border-amber-400 transition-all flex items-center justify-center">
                      <img 
                        src={schoolLogoUrl} 
                        alt="Victorious Heritage Model Nursery & Primary School Official Crest" 
                        className="w-full h-full object-contain drop-shadow"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-white leading-tight">
                      School Crest
                    </span>
                    <span className="text-[10px] text-amber-400">
                      "Knowledge is Victory"
                    </span>
                  </div>
                </div>

                {onOpenLogoPreview && (
                  <button
                    onClick={() => onOpenLogoPreview('both')}
                    className="w-full text-center py-2 text-xs text-stone-300 hover:text-white bg-stone-700/60 hover:bg-stone-700 rounded-lg transition-colors font-medium flex items-center justify-center gap-1.5"
                  >
                    <span>Inspect Full Crests &amp; Symbolism</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. NAVIGATION PILLS / TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'all'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Dual Campus Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('primary')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'primary'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Victorious Heritage Primary &amp; Nursery</span>
          </button>

          <button
            onClick={() => setActiveTab('technical')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'technical'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Vocational &amp; Technical School</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'gallery'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>School Photo &amp; Video Media ({schoolMedia.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('admissions')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'admissions'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Admissions &amp; Inquiries</span>
          </button>
        </div>
      </section>

      {/* 3. SECTION: THE CHURCH ANCHOR EXPLAINED */}
      {(activeTab === 'all' || activeTab === 'primary' || activeTab === 'technical') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-900 text-white rounded-3xl p-8 sm:p-12 border border-emerald-800 shadow-xl space-y-8">
            
            <div className="max-w-3xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-lime-400">
                Foundational Vision &amp; Ministry Philosophy
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
                Why the Church is the Main Anchor of Both Schools
              </h2>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                At Victorious Royal Assembly International, education is not a secondary commercial enterprise — it is an essential expression of Christian compassion and generational transformation in South Sudan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-6 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700/60 flex items-center justify-center text-lime-300">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">
                  1. Spiritual Covering &amp; Character
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Both schools operate under biblical principles taught by Dr. Apostle Andrew Abubakar. Students begin every day with prayer, cultivating honesty, integrity, discipline, and reverence for God.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-6 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700/60 flex items-center justify-center text-lime-300">
                  <Utensils className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">
                  2. Holistic Care &amp; Daily Nutrition
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Hunger blocks learning. The church provides compound space, clean borehole drinking water, and morning porridge programs so vulnerable pupils do not study on empty stomachs.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-6 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700/60 flex items-center justify-center text-lime-300">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">
                  3. 30%+ Vulnerable Fee Sponsorship
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Over 30% of our primary and vocational learners come from war-displaced families or widow households who cannot afford fees. The church carries their tuition so no child is turned away.
                </p>
              </div>
            </div>

            {/* Quote Banner */}
            <div className="p-6 rounded-2xl bg-emerald-950/80 border border-emerald-700/60 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <img 
                src="/victorious-heritage-school-logo.svg" 
                alt="School crest" 
                className="w-16 h-16 object-contain shrink-0 drop-shadow" 
              />
              <div className="space-y-1">
                <p className="text-sm italic font-medium text-emerald-200">
                  "{schools.heritageAcademy.promiseQuote}"
                </p>
                <p className="text-xs text-lime-300 font-bold uppercase tracking-wider">
                  — Dr. Apostle Andrew Abubakar, General Overseer &amp; Founder
                </p>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* 4. DUAL CAMPUS BREAKDOWN (SIDE-BY-SIDE OR DETAILED SECTIONS) */}

      {/* 4A. VICTORIOUS HERITAGE MODEL NURSERY & PRIMARY SCHOOL */}
      {(activeTab === 'all' || activeTab === 'primary') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
          
          <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm space-y-8">
            
            {/* Header Lockup */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-200">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-700"></span>
                  <span>School Wing 1 · Foundational Education</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading">
                  Victorious Heritage Model Nursery &amp; Primary School
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
                  Motto: <strong className="text-emerald-800">"Knowledge is Victory"</strong> &amp; <strong className="text-emerald-800">"I Am Victorious"</strong> · Serving 120 pupils in Juba
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <button
                  onClick={() => onOpenDonateModal('heritage')}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                >
                  Sponsor a Primary Child
                </button>
                <button
                  onClick={() => openMultiUploadModal('victorious-heritage')}
                  className="p-2.5 text-stone-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl border border-stone-200 transition-colors"
                  title="Upload photos for Victorious Heritage"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* School Campus Photo */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-semibold text-slate-800">Primary Campus &amp; Pupil Assembly</span>
                <button
                  onClick={() => openUploadModal('school-hero', 'Victorious Heritage Primary Campus')}
                  className="text-emerald-800 font-bold hover:underline flex items-center gap-1"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Update Campus Photo</span>
                </button>
              </div>
              <PlaceholderImage
                slotKey="school-hero"
                src={schools.heritageAcademy.heroImagePlaceholder}
                alt="Victorious Heritage Primary Campus in Juba"
                label="Victorious Heritage Primary Assembly Ground"
                recommendedPath="/public/assets/schools/heritage-academy/hero-heritage.jpg"
                aspectRatio="21:9"
                category="school"
                onOpenAssetGuide={onOpenAssetGuide}
              />
            </div>

            {/* Overview & Program Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left 7 Cols: Overview & Pillars */}
              <div className="lg:col-span-7 space-y-6">
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  What the Primary School Does:
                </h3>
                <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {schools.heritageAcademy.overview.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>

                <div className="bg-emerald-50/70 rounded-2xl p-6 border border-emerald-200/80 space-y-3">
                  <h4 className="font-bold text-emerald-950 text-sm">
                    Core Primary &amp; Nursery Subjects:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-900">
                    {schools.heritageAcademy.curriculum.map((sub, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 5 Cols: Quick Stats & Urgent Needs */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm border-b border-stone-200 pb-2">
                    Key School Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 bg-white rounded-xl border border-stone-200">
                      <p className="text-xl font-extrabold text-emerald-900">120</p>
                      <p className="text-[11px] text-stone-500 font-medium">Pupils Enrolled</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-stone-200">
                      <p className="text-xl font-extrabold text-emerald-900">30%+</p>
                      <p className="text-[11px] text-stone-500 font-medium">Fully Subsidized</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-stone-200">
                      <p className="text-xl font-extrabold text-emerald-900">N1 - P8</p>
                      <p className="text-[11px] text-stone-500 font-medium">Grades Offered</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-stone-200">
                      <p className="text-xl font-extrabold text-emerald-900">100%</p>
                      <p className="text-[11px] text-stone-500 font-medium">Christian Care</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Urgent Primary Needs:
                    </h4>
                    <div className="space-y-2 text-xs">
                      {schools.heritageAcademy.immediateNeeds.slice(0, 3).map((need) => (
                        <div key={need.id} className="p-2.5 bg-white rounded-lg border border-stone-200 flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">{need.title}</p>
                            <p className="text-[10px] text-stone-500">{need.urgency} Priority</p>
                          </div>
                          <span className="font-bold text-emerald-800 text-xs shrink-0">
                            {need.costEstimate}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* 4B. VICTORIOUS VOCATIONAL & TECHNICAL TRAINING SCHOOL */}
      {(activeTab === 'all' || activeTab === 'technical') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
          
          <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm space-y-8">
            
            {/* Header Lockup */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-200">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                  <span>School Wing 2 · Technical &amp; Trade Education</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading">
                  Victorious Vocational &amp; Technical Training School
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
                  Motto: <strong className="text-amber-800">"Skills for Self-Reliance, Economic Dignity &amp; Community Uplift"</strong> · Youth &amp; Adult Enterprise
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <button
                  onClick={() => onOpenDonateModal('vocational')}
                  className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                >
                  Fund a Student Toolkit ($150)
                </button>
                <button
                  onClick={() => openMultiUploadModal('vocational')}
                  className="p-2.5 text-stone-600 hover:text-amber-800 hover:bg-amber-50 rounded-xl border border-stone-200 transition-colors"
                  title="Upload photos for Vocational School"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4 max-w-4xl text-stone-700 text-xs sm:text-sm leading-relaxed">
              <p>
                South Sudan relies heavily on imported goods and foreign technical craftsmen. Victorious Vocational School trains local South Sudanese youths, conflict-affected women, school leavers, and widows in high-demand technical trades so they can launch sustainable local businesses in Juba.
              </p>
              <p>
                Our curriculum integrates intensive practical hands-on workshop training with business math, customer service, Christian ethics, and entrepreneurial micro-grant mentorship.
              </p>
            </div>

            {/* 6 Technical Workshop Trades Offered */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                  The 6 Core Technical Trades &amp; Workshops:
                </h3>
                <span className="text-xs text-stone-500 font-medium hidden sm:inline">
                  Hands-on learning with professional equipment
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vocationalTrades.map((trade) => (
                  <div 
                    key={trade.id} 
                    className="p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                        {trade.icon}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {trade.name}
                      </h4>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {trade.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-200/80 space-y-1 text-[11px]">
                      <div className="flex items-center justify-between text-stone-500">
                        <span>Duration:</span>
                        <span className="font-semibold text-slate-800">{trade.duration}</span>
                      </div>
                      <div className="text-stone-500">
                        <span className="font-medium text-stone-600">Equipment:</span> {trade.equipment}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* The Graduate Toolkit Program */}
            <div className="bg-amber-50 rounded-2xl p-6 sm:p-8 border border-amber-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full inline-block">
                  Economic Dignity Initiative
                </span>
                <h4 className="text-base sm:text-lg font-bold text-amber-950 font-heading">
                  The Graduate Toolkit Sponsorship Fund
                </h4>
                <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
                  Training without tools leaves graduates vulnerable to unemployment. For $150, donors provide a graduating student with a personal, commercial-grade toolset (such as a sewing machine, carpentry kit, or electrical multimeter kit) to start their enterprise immediately.
                </p>
              </div>

              <button
                onClick={() => onOpenDonateModal('vocational')}
                className="px-6 py-3 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-xs shrink-0 whitespace-nowrap"
              >
                Sponsor a Toolkit ($150)
              </button>
            </div>

          </div>
        </section>
      )}

      {/* 5. SCHOOL PHOTO & VIDEO MEDIA SECTION (WITH REPLACE & DELETE) */}
      {(activeTab === 'all' || activeTab === 'gallery') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                  School Life Photo &amp; Video Showcase
                </h2>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Verified images and video clips of pupils, classrooms, teachers, and technical workshops in Juba
              </p>
            </div>

            <button
              onClick={() => openMultiUploadModal('victorious-heritage')}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shadow-xs"
            >
              <Camera className="w-3.5 h-3.5 text-lime-300" />
              <span>Upload Photos / Videos</span>
            </button>
          </div>

          {/* Grid of School Media */}
          {schoolMedia.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 space-y-3">
              <Camera className="w-12 h-12 text-stone-400 mx-auto" />
              <p className="text-sm font-bold text-slate-800">No School Photos Uploaded Yet</p>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Be the first to upload authentic photos or video clips of Victorious Heritage Primary School or Vocational School.
              </p>
              <button
                onClick={() => openMultiUploadModal('victorious-heritage')}
                className="mt-2 px-5 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-bold"
              >
                Upload First Photo Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {schoolMedia.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  {/* Media Visual */}
                  <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                    {(item.mediaType === 'video' || !!item.videoUrl) && item.videoUrl ? (
                      <video
                        src={item.videoUrl}
                        poster={item.url}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                        loading="lazy"
                      />
                    )}

                    {/* Badge */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 text-white backdrop-blur-xs">
                        {item.category === 'vocational' ? 'Vocational Trade' : 'Primary & Nursery'}
                      </span>
                      {(item.mediaType === 'video' || !!item.videoUrl) && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 flex items-center gap-1">
                          <Film className="w-3 h-3" />
                          <span>Video</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">
                        {item.title}
                      </h4>
                      {item.caption && (
                        <p className="text-xs text-stone-600 line-clamp-2 mt-1">
                          {item.caption}
                        </p>
                      )}
                    </div>

                    {/* Actions: Replace & Delete Options */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 mt-2">
                      <button
                        onClick={() => setReplaceMediaItem(item)}
                        className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 hover:underline"
                        title="Replace this image or edit details"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Replace / Edit</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
                            removeGalleryPhoto(item.id);
                          }
                        }}
                        className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 hover:bg-rose-50 px-2 py-1 rounded transition-colors"
                        title="Delete photo permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 6. ADMISSIONS & COMMUNITY INQUIRIES FORM */}
      {(activeTab === 'all' || activeTab === 'admissions') && (
        <section className="max-w-4xl mx-auto px-4 sm:px-8 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm space-y-6">
            
            <div className="space-y-2 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                Enrollment &amp; Admissions
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                Apply for Admission or Inquire About Programs
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
                Whether enrolling your child in our primary nursery school or registering for a vocational technical trade in Juba, our administration welcomes you.
              </p>
            </div>

            {inquirySubmitted ? (
              <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  Application Inquiry Received!
                </h3>
                <p className="text-xs text-emerald-900 max-w-md mx-auto">
                  Thank you, <strong>{parentName || studentName}</strong>. Our school administrative office at Victorious Royal Assembly International compound in Juba has received your inquiry for <strong>{programChoice}</strong>. We will contact you at <strong>{contactPhone}</strong> shortly.
                </p>
                <button
                  onClick={() => setInquirySubmitted(false)}
                  className="mt-3 px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                
                {/* School Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Choose School Wing:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setInquiryType('primary');
                        setProgramChoice('Primary P1 - P4');
                      }}
                      className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                        inquiryType === 'primary'
                          ? 'border-emerald-700 bg-emerald-50/80 text-emerald-950 font-bold ring-1 ring-emerald-600'
                          : 'border-stone-200 bg-stone-50 text-stone-700'
                      }`}
                    >
                      <BookOpen className="w-4 h-4 text-emerald-700" />
                      <div>
                        <p className="text-xs font-bold">Victorious Heritage Primary</p>
                        <p className="text-[10px] text-stone-500">Nursery, Kindergarten, P1-P8</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setInquiryType('vocational');
                        setProgramChoice('Tailoring & Garment Making');
                      }}
                      className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                        inquiryType === 'vocational'
                          ? 'border-amber-700 bg-amber-50/80 text-amber-950 font-bold ring-1 ring-amber-600'
                          : 'border-stone-200 bg-stone-50 text-stone-700'
                      }`}
                    >
                      <Wrench className="w-4 h-4 text-amber-700" />
                      <div>
                        <p className="text-xs font-bold">Vocational Technical School</p>
                        <p className="text-[10px] text-stone-500">Tailoring, Solar, IT, Carpentry</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Student / Learner Full Name: *
                    </label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g., Emmanuel Deng"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-slate-900 focus:outline-emerald-700 focus:border-emerald-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Parent / Guardian / Contact Person:
                    </label>
                    <input
                      type="text"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="e.g., Mary Akuol"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-slate-900 focus:outline-emerald-700 focus:border-emerald-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Phone Number (WhatsApp or Calling): *
                    </label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+211 925 ... or local number"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-slate-900 focus:outline-emerald-700 focus:border-emerald-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Program or Grade of Interest:
                    </label>
                    <select
                      value={programChoice}
                      onChange={(e) => setProgramChoice(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-slate-900 focus:outline-emerald-700 focus:border-emerald-700 bg-white"
                    >
                      {inquiryType === 'primary' ? (
                        <>
                          <option>Nursery &amp; Kindergarten (Ages 3-5)</option>
                          <option>Lower Primary (P1 - P3)</option>
                          <option>Upper Primary (P4 - P6)</option>
                          <option>Primary Candidate Class (P7 - P8)</option>
                          <option>Adult Basic Literacy &amp; English</option>
                        </>
                      ) : (
                        <>
                          <option>Tailoring &amp; Garment Making</option>
                          <option>Solar Energy &amp; Electrical Installation</option>
                          <option>Computer Literacy &amp; Digital Office Skills</option>
                          <option>Carpentry &amp; Furniture Making</option>
                          <option>Catering &amp; Commercial Baking</option>
                          <option>Cosmetology &amp; Hair Styling</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Additional Notes or Sponsorship Inquiries:
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tell us about the student's background, fee support needs, or any questions for our admissions team..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-slate-900 focus:outline-emerald-700 focus:border-emerald-700"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Admission / Enrollment Inquiry</span>
                </button>
              </form>
            )}

          </div>
        </section>
      )}

      {/* Replace Media Modal Instance for this Page */}
      <ReplaceMediaModal
        isOpen={!!replaceMediaItem}
        item={replaceMediaItem}
        onClose={() => setReplaceMediaItem(null)}
      />

    </div>
  );
};

export default SchoolView;
