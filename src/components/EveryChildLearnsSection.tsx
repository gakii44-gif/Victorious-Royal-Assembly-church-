import React from 'react';
import { NavView } from './Navbar';
import { usePhotos } from '../context/PhotoContext';
import { 
  HeartHandshake, 
  Camera, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Users, 
  Utensils, 
  Award,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { VRAILogo } from './VRAILogo';

interface EveryChildLearnsSectionProps {
  onNavigate: (view: NavView) => void;
  onOpenDonateModal: (designation?: 'heritage' | 'vocational' | 'both' | 'general' | 'education' | 'missions') => void;
  onOpenAssetGuide?: () => void;
  className?: string;
}

export const EveryChildLearnsSection: React.FC<EveryChildLearnsSectionProps> = ({
  onNavigate,
  onOpenDonateModal,
  onOpenAssetGuide,
  className = '',
}) => {
  const { getPhoto, openUploadModal } = usePhotos();
  const photoSlotKey = 'heritage-graduation-stage';
  const graduationPhoto = getPhoto(photoSlotKey);

  return (
    <section className={`max-w-7xl mx-auto px-4 sm:px-8 py-8 ${className}`}>
      <div className="bg-[#FAF8F5] rounded-3xl border border-[#EBE5DC] p-6 sm:p-10 lg:p-12 shadow-xs transition-all">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: The Narrative & Heart of Victorious Heritage */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-900">
                  Victorious Heritage Model Nursery &amp; Primary School &amp; Adult Education Centre
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#11281E] font-heading tracking-tight leading-[1.15]">
                Every child deserves an opportunity to learn.
              </h2>
            </div>

            <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-normal">
              Victorious Heritage Model Nursery &amp; Primary School &amp; Adult Education Centre is home to <strong>120 pupils</strong>. Over <strong>30% of our learners — roughly 36 children</strong> — come from families who simply cannot afford school fees, uniforms, meals, or learning materials, and are fully carried by our church ministry and international partners. Even among the families who do manage to pay, most only get there after a serious, often painful struggle. Yet every learner walks through our gates every morning, because we believe poverty should never determine a child's future.
            </p>

            {/* Quote Block with Golden Amber Accent Bar */}
            <div className="border-l-4 border-[#C9933B] bg-white/80 rounded-r-xl p-5 sm:p-6 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-[#C9933B]/20 text-[#7A5312] border border-[#C9933B]/40">
                  Proverbs 22:6
                </span>
                <span className="text-[11px] font-bold text-slate-800">
                  Dr. Apostle Andrew Abubakar
                </span>
              </div>
              <blockquote className="text-sm sm:text-base text-stone-800 font-serif italic leading-relaxed">
                &ldquo;We believe that no child or adult should be denied the opportunity to learn. Through God's grace, we provide quality education and support vulnerable learners, with over 30% of our pupils fully funded through our ministry and partners.&rdquo;
              </blockquote>
              <p className="text-[11px] text-stone-500 italic pt-1 border-t border-stone-200/60">
                &ldquo;Knowledge is Victory&rdquo; — A promise made to every child and adult who walks through our gates.
              </p>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Through the vision and sacrifice of <strong>Dr. Apostle Andrew Abubakar</strong> and <strong>Victorious Royal Assembly International Church</strong>, we continue to educate, feed, and care for vulnerable children across Juba, South Sudan — one classroom, one uniform, one meal at a time.
            </p>

            {/* Impact Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
              <div className="p-3 bg-white rounded-xl border border-stone-200/80 text-center space-y-0.5 shadow-2xs">
                <span className="text-xs sm:text-sm font-extrabold text-emerald-900 font-mono block">120</span>
                <span className="text-[10px] sm:text-[11px] text-stone-500 font-medium leading-tight block">Enrolled Pupils</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-amber-200 text-center space-y-0.5 shadow-2xs">
                <span className="text-xs sm:text-sm font-extrabold text-amber-800 font-mono block">36</span>
                <span className="text-[10px] sm:text-[11px] text-amber-900/80 font-medium leading-tight block">Fully Carried</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-stone-200/80 text-center space-y-0.5 shadow-2xs">
                <span className="text-xs sm:text-sm font-extrabold text-emerald-900 font-mono block">100%</span>
                <span className="text-[10px] sm:text-[11px] text-stone-500 font-medium leading-tight block">Daily Meals</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onOpenDonateModal('heritage')}
                className="px-6 py-3 bg-[#C9933B] hover:bg-[#B8822A] active:bg-[#A37222] text-slate-900 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm inline-flex items-center gap-2 hover:scale-[1.02]"
              >
                <span>💚 Sponsor a Child ($35/mo)</span>
              </button>

              <button
                onClick={() => onNavigate('heritage-academy')}
                className="px-5 py-3 bg-emerald-900 hover:bg-emerald-950 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors shadow-xs inline-flex items-center gap-2"
              >
                <span>Our School Story</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('gallery')}
                className="px-4 py-3 text-stone-700 hover:text-emerald-900 font-semibold text-xs sm:text-sm transition-colors inline-flex items-center gap-1.5 underline underline-offset-4"
              >
                <span>Life at Heritage Gallery &rarr;</span>
              </button>
            </div>
          </div>

          {/* Right Column: Graduation Photo Card with Children in Emerald Gowns */}
          <div className="lg:col-span-5">
            <div className="relative group rounded-2xl overflow-hidden border-2 border-white shadow-xl bg-stone-900 aspect-4/3 sm:aspect-5/4">
              {graduationPhoto && graduationPhoto.url && graduationPhoto.url.trim() !== '' ? (
                <img
                  src={graduationPhoto.url}
                  alt="Victorious Heritage Pupils Graduation Ceremony in Emerald Green & Gold Academic Robes"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
              ) : (
                /* Richly rendered graduation stage representation matching the exact flyer */
                <div className="w-full h-full bg-gradient-to-b from-[#18392B] via-[#0E241B] to-[#0A1812] relative flex flex-col justify-between p-6 sm:p-8 text-white select-none">
                  {/* Subtle Background Pattern */}
                  <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(circle at 50% 50%, #C9933B 1px, transparent 1px)`,
                      backgroundSize: '20px 20px',
                    }}
                  />

                  {/* Top Header Badge */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C9933B] text-slate-900 shadow-sm">
                      Graduation &amp; Academic Milestones
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-300 font-mono">
                      Juba, South Sudan
                    </span>
                  </div>

                  {/* Center Content: Graduation Graphic & Description */}
                  <div className="relative z-10 my-auto text-center space-y-3 py-4">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#C9933B] to-amber-300 text-slate-950 flex items-center justify-center shadow-lg">
                      <Award className="w-8 h-8 text-emerald-950" />
                    </div>

                    <div className="space-y-1 max-w-sm mx-auto">
                      <h3 className="text-lg sm:text-xl font-bold font-heading text-white">
                        Victorious Heritage Model Academy
                      </h3>
                      <p className="text-xs text-amber-200/90 font-medium">
                        Pupils Celebrating in Emerald Green &amp; Gold Academic Regalia
                      </p>
                      <p className="text-[11px] text-stone-300 leading-relaxed pt-1">
                        Holding diploma scrolls together with Dr. Apostle Andrew Abubakar and faculty.
                      </p>
                    </div>
                  </div>

                  {/* Bottom Bar: Quick Upload Trigger */}
                  <div className="relative z-10 pt-3 border-t border-emerald-900/60 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-stone-400 italic">
                      &ldquo;Knowledge is Victory&rdquo;
                    </span>
                    <button
                      onClick={() => openUploadModal(photoSlotKey, 'Victorious Heritage Graduation Ceremony Photograph')}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white rounded-lg font-semibold text-[11px] flex items-center gap-1.5 backdrop-blur-xs transition-colors border border-white/20"
                    >
                      <Camera className="w-3.5 h-3.5 text-lime-300" />
                      <span>Upload Real Photo</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Hover Overlay Button to Replace Photo */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                <button
                  onClick={() => openUploadModal(photoSlotKey, 'Victorious Heritage Graduation Ceremony Photograph')}
                  className="px-4 py-2 bg-white text-slate-900 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2 hover:bg-stone-100 transition-colors"
                >
                  <Camera className="w-4 h-4 text-emerald-800" />
                  <span>{graduationPhoto ? 'Replace Graduation Photo' : 'Upload Real Graduation Photo'}</span>
                </button>
              </div>
            </div>

            <p className="text-center text-[11px] text-stone-500 mt-2.5 font-medium">
              Victorious Heritage Model Nursery &amp; Primary School · Juba, South Sudan
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
