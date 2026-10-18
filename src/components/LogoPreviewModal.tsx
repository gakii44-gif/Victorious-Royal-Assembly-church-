import React, { useState, useRef } from 'react';
import { 
  X, 
  Download, 
  Check, 
  ExternalLink, 
  Shield, 
  BookOpen, 
  Church, 
  Sparkles, 
  Info,
  Maximize2,
  Copy,
  Upload,
  RefreshCw,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { usePhotos } from '../context/PhotoContext';

interface LogoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'church' | 'school' | 'both';
}

export const LogoPreviewModal: React.FC<LogoPreviewModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'both',
}) => {
  const [activeTab, setActiveTab] = useState<'both' | 'church' | 'school'>(initialTab);
  const [bgTheme, setBgTheme] = useState<'white' | 'dark' | 'emerald'>('white');
  const [copiedChurch, setCopiedChurch] = useState(false);
  const [copiedSchool, setCopiedSchool] = useState(false);
  const [isUploadingChurch, setIsUploadingChurch] = useState(false);
  const [isUploadingSchool, setIsUploadingSchool] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  const churchFileInputRef = useRef<HTMLInputElement>(null);
  const schoolFileInputRef = useRef<HTMLInputElement>(null);

  const {
    churchLogoUrl,
    schoolLogoUrl,
    uploadChurchLogo,
    uploadSchoolLogo,
    resetChurchLogo,
    resetSchoolLogo,
    isChurchLogoCustom,
    isSchoolLogoCustom,
  } = usePhotos();

  if (!isOpen) return null;

  const handleCopyPath = (path: string, type: 'church' | 'school') => {
    navigator.clipboard.writeText(window.location.origin + path);
    if (type === 'church') {
      setCopiedChurch(true);
      setTimeout(() => setCopiedChurch(false), 2000);
    } else {
      setCopiedSchool(true);
      setTimeout(() => setCopiedSchool(false), 2000);
    }
  };

  const handleChurchFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingChurch(true);
      await uploadChurchLogo(file);
      setUploadSuccessMessage('Authentic Church Logo successfully uploaded and applied across the entire site!');
      setTimeout(() => setUploadSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Error uploading church logo:', err);
    } finally {
      setIsUploadingChurch(false);
      if (churchFileInputRef.current) churchFileInputRef.current.value = '';
    }
  };

  const handleSchoolFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingSchool(true);
      await uploadSchoolLogo(file);
      setUploadSuccessMessage('Authentic School Crest successfully uploaded and applied across the entire site!');
      setTimeout(() => setUploadSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Error uploading school logo:', err);
    } finally {
      setIsUploadingSchool(false);
      if (schoolFileInputRef.current) schoolFileInputRef.current.value = '';
    }
  };

  const getContainerBg = () => {
    switch (bgTheme) {
      case 'dark':
        return 'bg-stone-900 border-stone-700';
      case 'emerald':
        return 'bg-emerald-950 border-emerald-800';
      default:
        return 'bg-white border-stone-200';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-stone-200 text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden File Inputs */}
        <input 
          ref={churchFileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          className="hidden"
          onChange={handleChurchFileUpload}
        />
        <input 
          ref={schoolFileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          className="hidden"
          onChange={handleSchoolFileUpload}
        />

        {/* Modal Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-emerald-300 flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-heading">
                Authentic Ministry &amp; School Insignia
              </h2>
              <p className="text-xs text-stone-300">
                Official Heraldry &amp; Live Image Management · Juba, South Sudan
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Ribbon when upload occurs */}
        {uploadSuccessMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center gap-2 text-xs font-bold text-emerald-900 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{uploadSuccessMessage}</span>
          </div>
        )}

        {/* Tab Controls & Theme Switcher */}
        <div className="bg-stone-100 px-6 py-2.5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 bg-stone-200/80 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('both')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'both'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Side-by-Side (Both)
            </button>
            <button
              onClick={() => setActiveTab('church')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'church'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Church className="w-3.5 h-3.5 text-emerald-800" />
              <span>Church Seal</span>
            </button>
            <button
              onClick={() => setActiveTab('school')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'school'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              <span>School Crest</span>
            </button>
          </div>

          {/* Test Against Backgrounds */}
          <div className="flex items-center gap-2 text-xs text-stone-600">
            <span className="font-semibold text-[11px] text-stone-500 hidden sm:inline">Preview On:</span>
            <div className="flex items-center gap-1 bg-stone-200/80 p-1 rounded-lg">
              <button
                onClick={() => setBgTheme('white')}
                className={`w-6 h-6 rounded-md border text-[10px] font-bold transition-all ${
                  bgTheme === 'white' ? 'bg-white border-stone-400 ring-2 ring-emerald-600' : 'bg-white border-stone-300'
                }`}
                title="White Background"
              >
                W
              </button>
              <button
                onClick={() => setBgTheme('dark')}
                className={`w-6 h-6 rounded-md border text-[10px] font-bold text-white transition-all ${
                  bgTheme === 'dark' ? 'bg-stone-900 border-stone-700 ring-2 ring-emerald-600' : 'bg-stone-900 border-stone-800'
                }`}
                title="Dark Slate Background"
              >
                D
              </button>
              <button
                onClick={() => setBgTheme('emerald')}
                className={`w-6 h-6 rounded-md border text-[10px] font-bold text-emerald-200 transition-all ${
                  bgTheme === 'emerald' ? 'bg-emerald-950 border-emerald-700 ring-2 ring-emerald-600' : 'bg-emerald-950 border-emerald-900'
                }`}
                title="Deep Emerald Background"
              >
                E
              </button>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          
          {/* UPLOAD & REPLACE BANNER */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                  Authentic Logo File Synchronization
                </span>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded">
                  No Editing / Exact File
                </span>
              </div>
              <p className="text-xs text-stone-600 max-w-xl">
                Upload your exact authentic JPEG, PNG, or SVG files directly from your computer or phone. Your uploaded file will instantly replace the logo across all pages, navigation ribbons, hero headers, and footers.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => churchFileInputRef.current?.click()}
                disabled={isUploadingChurch}
                className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Church File</span>
              </button>
              <button
                onClick={() => schoolFileInputRef.current?.click()}
                disabled={isUploadingSchool}
                className="px-3.5 py-2 bg-amber-800 hover:bg-amber-900 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload School File</span>
              </button>
            </div>
          </div>

          {/* Side by side / Church / School Views */}
          <div className={`grid gap-6 ${activeTab === 'both' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>

            {/* 1. CHURCH SEAL */}
            {(activeTab === 'both' || activeTab === 'church') && (
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                        The Spiritual Anchor
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {isChurchLogoCustom && (
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                          Custom Upload Active
                        </span>
                      )}
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Church Seal
                      </span>
                    </div>
                  </div>

                  {/* Logo Display Card */}
                  <div className={`p-6 rounded-xl border shadow-xs flex items-center justify-center min-h-[260px] transition-colors ${getContainerBg()}`}>
                    <img
                      src={churchLogoUrl}
                      alt="Victorious Royal Assembly International Church Official Seal"
                      className="w-56 h-56 sm:w-64 sm:h-64 object-contain drop-shadow-md transition-transform hover:scale-105 duration-300"
                    />
                  </div>

                  {/* Details */}
                  <div className="mt-4 space-y-2">
                    <h3 className="font-bold text-slate-900 text-base leading-tight">
                      Victorious Royal Assembly International
                    </h3>
                    <p className="text-xs text-emerald-800 font-semibold italic">
                      A.k.a Word of Faith Healing &amp; Deliverance Ministry Int'l
                    </p>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      The official seal of the mother church and apostolic covering in Juba, South Sudan.
                    </p>
                  </div>

                  {/* Visual Components Breakdown */}
                  <div className="mt-4 pt-3 border-t border-stone-200 space-y-2">
                    <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                      Authentic Heraldic Elements:
                    </p>
                    <ul className="text-xs text-stone-600 space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-700 font-bold">1.</span>
                        <span><strong>Green Arc Ring:</strong> <em>"VICTORIOUS ROYAL ASSEMBLY INTERNATIONAL"</em> in bold block letters.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-700 font-bold">2.</span>
                        <span><strong>Holy Bible &amp; Minister's Hands:</strong> Hands studying scripture with blue sleeves, symbolizing faith and teaching.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-700 font-bold">3.</span>
                        <span><strong>Descending White Dove:</strong> Outstretched wings representing the Holy Spirit's presence and deliverance.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-700 font-bold">4.</span>
                        <span><strong>V R A I Plaque:</strong> Dark green foundation block under the scripture.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-700 font-bold">5.</span>
                        <span><strong>Red Flared Base:</strong> <em>"A.k.a Word of faith Healing &amp; Deliverance Ministry Int'l"</em> along curved base.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => churchFileInputRef.current?.click()}
                      className="text-xs font-bold text-emerald-900 hover:text-white bg-emerald-100 hover:bg-emerald-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Replace Church File</span>
                    </button>
                    {isChurchLogoCustom && (
                      <button
                        onClick={resetChurchLogo}
                        className="text-xs font-semibold text-rose-700 hover:text-rose-900 hover:bg-rose-50 px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                        title="Restore authentic vector original"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Restore Default</span>
                      </button>
                    )}
                  </div>

                  <a
                    href={churchLogoUrl}
                    download="vrai-church-authentic-seal.svg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            )}

            {/* 2. SCHOOL CREST */}
            {(activeTab === 'both' || activeTab === 'school') && (
              <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                        The Educational Institution
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {isSchoolLogoCustom && (
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                          Custom Upload Active
                        </span>
                      )}
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                        School Crest
                      </span>
                    </div>
                  </div>

                  {/* Logo Display Card */}
                  <div className={`p-6 rounded-xl border shadow-xs flex items-center justify-center min-h-[260px] transition-colors ${getContainerBg()}`}>
                    <img
                      src={schoolLogoUrl}
                      alt="Victorious Heritage Model Nursery & Primary School Official Crest"
                      className="w-56 h-56 sm:w-64 sm:h-64 object-contain drop-shadow-md transition-transform hover:scale-105 duration-300"
                    />
                  </div>

                  {/* Details */}
                  <div className="mt-4 space-y-2">
                    <h3 className="font-bold text-slate-900 text-base leading-tight">
                      Victorious Heritage Model Nursery &amp; Primary School
                    </h3>
                    <p className="text-xs text-amber-800 font-semibold">
                      Motto: <span className="font-bold italic">"Knowledge is Victory"</span> · <span className="font-bold italic">"I Am Victorious"</span>
                    </p>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      The official crest of our foundational primary academy and nursery school in Juba, South Sudan.
                    </p>
                  </div>

                  {/* Visual Components Breakdown */}
                  <div className="mt-4 pt-3 border-t border-stone-200 space-y-2">
                    <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                      Authentic Crest Elements:
                    </p>
                    <ul className="text-xs text-stone-600 space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-700 font-bold">1.</span>
                        <span><strong>8-Point Faceted Star:</strong> Golden star points radiating symmetrically behind the circular crest.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-700 font-bold">2.</span>
                        <span><strong>Dark Green Circular Ring:</strong> <em>"Victorious Heritage Model Nursery &amp; Primary School"</em> &amp; <em>"* Juba, South Sudan *"</em>.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-700 font-bold">3.</span>
                        <span><strong>Globe &amp; Children Circle:</strong> Multi-cultural children in colorful clothes holding hands around the world.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-700 font-bold">4.</span>
                        <span><strong>Red Christian Cross:</strong> Latin cross standing upon the earth, representing Christ-centered education.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-700 font-bold">5.</span>
                        <span><strong>Open Book &amp; Green Banner:</strong> Open scripture book with <em>"I AM VICTORIOUS"</em> scroll underneath.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-700 font-bold">6.</span>
                        <span><strong>Large Ceremonial Ribbon:</strong> <em>"KNOWLEDGE IS VICTORY"</em> on green ribbon with notched downward tails.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => schoolFileInputRef.current?.click()}
                      className="text-xs font-bold text-amber-950 hover:text-white bg-amber-100 hover:bg-amber-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Replace School File</span>
                    </button>
                    {isSchoolLogoCustom && (
                      <button
                        onClick={resetSchoolLogo}
                        className="text-xs font-semibold text-rose-700 hover:text-rose-900 hover:bg-rose-50 px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                        title="Restore authentic vector original"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Restore Default</span>
                      </button>
                    )}
                  </div>

                  <a
                    href={schoolLogoUrl}
                    download="victorious-heritage-school-authentic-crest.svg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-300" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Usage & Legal Attribution Notice */}
          <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 flex items-start gap-3 text-xs text-stone-600">
            <Info className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">
                Institutional Heraldry &amp; Brand Copyright
              </p>
              <p className="text-[11px] leading-relaxed">
                Both emblems are the official, registered visual identity of <strong>Victorious Royal Assembly International</strong> and <strong>Victorious Heritage Model Nursery &amp; Primary School</strong> in Juba, South Sudan. The church functions as the primary anchor and governing body for all affiliated ministries and educational programs.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 shrink-0">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Authentic Official Seals Active</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
