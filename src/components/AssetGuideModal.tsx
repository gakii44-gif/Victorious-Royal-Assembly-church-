import React, { useState } from 'react';
import { X, FolderTree, Image as ImageIcon, FileCode, CheckCircle2, Copy, Check, Upload, Info } from 'lucide-react';

interface AssetGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadPreview?: (slotKey: string, fileDataUrl: string) => void;
}

export const AssetGuideModal: React.FC<AssetGuideModalProps> = ({
  isOpen,
  onClose,
  onUploadPreview,
}) => {
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'logo' | 'structure' | 'replacement' | 'data-config' | 'slots'>('logo');

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPath(text);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const imageSlots = [
    {
      label: 'Victorious Heritage Model Academy Hero',
      path: '/public/assets/schools/heritage-academy/hero-heritage.jpg',
      aspect: '16:9 (1920x1080px)',
      description: 'Main school compound, front entrance, or assembly photo.',
    },
    {
      label: 'Heritage Academy - Classrooms Expansion',
      path: '/public/assets/schools/heritage-academy/classroom-expansion.jpg',
      aspect: '4:3 (1200x900px)',
      description: 'Current classroom blocks or construction site in Juba.',
    },
    {
      label: 'Heritage Academy - Textbooks & Desk Sets',
      path: '/public/assets/schools/heritage-academy/textbooks-desks.jpg',
      aspect: '4:3 (1200x900px)',
      description: 'Pupils sitting at desks reading or taking notes.',
    },
    {
      label: 'Heritage Academy - Nutrition & Meals',
      path: '/public/assets/schools/heritage-academy/school-nutrition.jpg',
      aspect: '4:3 (1200x900px)',
      description: 'Pupils receiving porridge or clean drinking water.',
    },
    {
      label: 'Victorious Vocational School Hero',
      path: '/public/assets/schools/vocational/hero-vocational.jpg',
      aspect: '16:9 (1920x1080px)',
      description: 'Vocational training workshop, signpost, or group of practical trainees.',
    },
    {
      label: 'Vocational - Tailoring & Fashion Workshop',
      path: '/public/assets/schools/vocational/tailoring-workshop.jpg',
      aspect: '4:3 (1200x900px)',
      description: 'Students working on sewing machines, cutting patterns, or garments.',
    },
    {
      label: 'Vocational - Solar & Electrical Practical',
      path: '/public/assets/schools/vocational/solar-tools.jpg',
      aspect: '4:3 (1200x900px)',
      description: 'Trainees testing solar panels, multimeters, or wiring.',
    },
    {
      label: 'Vocational - Carpentry & Joinery',
      path: '/public/assets/schools/vocational/carpentry-workshop.jpg',
      aspect: '4:3 (1200x900px)',
      description: 'Trainees working with timber, saws, and woodworking tools.',
    },
    {
      label: 'General Overseer / Senior Pastor Portrait',
      path: '/public/assets/church/leadership/general-overseer.jpg',
      aspect: '1:1 or 4:5 (800x800px)',
      description: 'High-resolution portrait of the Senior Pastor in pastoral attire.',
    },
    {
      label: 'Academic Convocation & Graduation Ceremony',
      path: '/public/assets/church/outreach/convocation-ceremony.jpg',
      aspect: '16:9 or 4:3 (1600x1000px)',
      description: 'Graduation convocation with faculty and leaders in doctoral gowns.',
    },
    {
      label: 'Women Fellowship in Traditional Wax Print',
      path: '/public/assets/church/outreach/womens-fellowship.jpg',
      aspect: '16:9 or 4:3 (1600x1000px)',
      description: 'Church women choir and leaders in matching church fabric garments.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Asset Management &amp; Content Replacement Guide
              </h3>
              <p className="text-xs text-stone-500">
                How to replace placeholders with real photographs and verified information
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-md transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-stone-200 bg-white text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('logo')}
            className={`py-2 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'logo'
                ? 'border-emerald-700 text-emerald-800 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            ★ Official Church Logo (Updated)
          </button>
          <button
            onClick={() => setActiveTab('structure')}
            className={`py-2 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'structure'
                ? 'border-emerald-700 text-emerald-800 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            1. Recommended Folder Tree
          </button>
          <button
            onClick={() => setActiveTab('replacement')}
            className={`py-2 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'replacement'
                ? 'border-emerald-700 text-emerald-800 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            2. Photo Replacement Steps
          </button>
          <button
            onClick={() => setActiveTab('data-config')}
            className={`py-2 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'data-config'
                ? 'border-emerald-700 text-emerald-800 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            3. Updating Text &amp; Budgets
          </button>
          <button
            onClick={() => setActiveTab('slots')}
            className={`py-2 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'slots'
                ? 'border-emerald-700 text-emerald-800 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            4. Image Slot Registry ({imageSlots.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-stone-700">
          {activeTab === 'logo' && (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Official VRAI Emblem Active Across Website</p>
                  <p>
                    The website has been updated with the authentic, high-resolution insignia: vivid lime green field, bold black arc header <strong>VICTORIOUS ROYAL ASSEMBLY INTERNATIONAL</strong>, white descending Dove of Peace, African cupped hand over the Open Holy Scriptures, <strong>V R A I</strong> dark green badge, and the crimson red curved ribbon <strong>A.k.a Word of faith Healing &amp; Deliverance Ministry Int'l</strong>.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 p-6 bg-stone-100 rounded-xl border border-stone-200">
                <div className="w-48 h-48 sm:w-56 sm:h-56 shrink-0 bg-white p-2 rounded-2xl shadow-md border border-stone-200 flex items-center justify-center">
                  <img
                    src="/vrai-logo.svg"
                    alt="Victorious Royal Assembly International Official Logo"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-3 max-w-sm text-xs">
                  <h4 className="font-bold text-slate-900 text-sm">Vector Asset File Information</h4>
                  <p className="text-stone-600">
                    Format: Scalable Vector Graphics (SVG). Resolution-independent, pristine clarity on mobile phones, tablets, Retina screens, and large 4K displays.
                  </p>
                  <div className="space-y-1 font-mono text-[11px] text-stone-600">
                    <p>Path: <code className="text-emerald-800 font-bold bg-white px-1.5 py-0.5 rounded border border-stone-200">/public/vrai-logo.svg</code></p>
                    <p>Public Mirror: <code className="text-emerald-800 bg-white px-1.5 py-0.5 rounded border border-stone-200">/assets/logo/vrai-logo.svg</code></p>
                  </div>
                  <div className="pt-2 flex items-center gap-2">
                    <a
                      href="/vrai-logo.svg"
                      download="vrai-official-logo.svg"
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-md text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Download Vector SVG
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'structure' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
                <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Clean Public Asset Directory Standard</p>
                  <p>
                    All static assets (photographs, official logos, curriculum guides) are placed in the <code className="bg-emerald-100 px-1 py-0.5 rounded text-emerald-900 font-mono">/public/assets/</code> directory. Files placed here are served directly at <code className="bg-emerald-100 px-1 py-0.5 rounded text-emerald-900 font-mono">/assets/...</code> with zero build overhead.
                  </p>
                </div>
              </div>

              <div className="border border-stone-200 rounded-lg p-4 bg-stone-900 text-stone-100 font-mono text-xs overflow-x-auto">
                <pre>{`/public/
├── vrai-logo.svg                      <- Scalable Church Seal (Active)
└── assets/
    ├── logo/
    │   ├── vrai-logo.svg              <- Primary Vector Emblem
    │   └── vrai-logo-transparent.png  <- High-res Transparent PNG
    │
    ├── schools/
    │   ├── heritage-academy/          <- Victorious Heritage Model Academy (Primary)
    │   │   ├── hero-heritage.jpg      <- Main campus & assembly banner
    │   │   ├── morning-assembly.jpg   <- Devotion & pupils in uniform
    │   │   ├── classroom-expansion.jpg<- Construction/expansion target
    │   │   ├── textbooks-desks.jpg    <- Classroom reading & study desks
    │   │   └── school-nutrition.jpg   <- Daily pupil meal program
    │   │
    │   └── vocational/                <- Victorious Vocational School (Vocational)
    │       ├── hero-vocational.jpg    <- Training workshop hero photo
    │       ├── tailoring-workshop.jpg <- Sewing & pattern-drafting trainees
    │       ├── solar-tools.jpg        <- Solar electrician training kits
    │       ├── carpentry-workshop.jpg <- Woodworking & furniture benches
    │       └── graduate-starter-kits.jpg <- Graduating students with tools
    │
    └── church/
        ├── leadership/                <- Pastoral Council & Overseer portraits
        │   ├── general-overseer.jpg
        │   ├── education-director.jpg
        │   └── finance-officer.jpg
        ├── services/                  <- Worship services & congregation
        │   ├── sunday-worship.jpg
        │   └── anointing-service.jpg
        └── outreach/                  <- Community relief & convocations
            ├── convocation-ceremony.jpg<- Academic & doctoral regalia
            ├── womens-fellowship.jpg  <- Women ministry in church fabric
            └── medical-camp.jpg       <- Community clinic & health support`}</pre>
              </div>
            </div>
          )}

          {activeTab === 'replacement' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-base">
                How to Replace Placeholders with Real Approved Photos
              </h4>
              <ol className="list-decimal list-inside space-y-3 text-xs leading-relaxed">
                <li className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <strong className="text-slate-900">Step 1: Choose or Rename Your Approved Photos</strong>
                  <p className="mt-1 text-stone-600">
                    Rename your high-resolution church or school photo to match the exact filename in the table below (for example, <code className="bg-stone-200 px-1 py-0.5 rounded font-mono">hero-heritage.jpg</code> for the primary school).
                  </p>
                </li>
                <li className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <strong className="text-slate-900">Step 2: Place the File in the Corresponding Directory</strong>
                  <p className="mt-1 text-stone-600">
                    Drop the image into the corresponding folder inside <code className="bg-stone-200 px-1 py-0.5 rounded font-mono">/public/assets/...</code>.
                  </p>
                </li>
                <li className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <strong className="text-slate-900">Step 3: Recommended Photo Formats &amp; Dimensions</strong>
                  <p className="mt-1 text-stone-600">
                    Format: JPEG or WebP (compression quality 85%).
                    <br />
                    • Landscape banners: 1920 × 1080px (16:9 ratio).
                    <br />
                    • Classroom and workshop cards: 1200 × 900px (4:3 ratio).
                    <br />
                    • Leadership portraits: 800 × 800px (1:1 ratio).
                  </p>
                </li>
                <li className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <strong className="text-slate-900">Step 4: Automatic UI Display</strong>
                  <p className="mt-1 text-stone-600">
                    The <code className="bg-stone-200 px-1 py-0.5 rounded font-mono">&lt;PlaceholderImage /&gt;</code> component automatically checks whether the image file exists. Once added, the neutral blueprint placeholder seamlessly transitions into the real photograph!
                  </p>
                </li>
              </ol>
            </div>
          )}

          {activeTab === 'data-config' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-base">
                Centralized Configuration File: <code className="text-emerald-800 text-sm">src/data/organizationData.ts</code>
              </h4>
              <p className="text-xs text-stone-600">
                To guarantee 100% honesty with international donors, all school enrollments, fundraising targets, teacher counts, bank account numbers, and leadership names are maintained in one single, organized file:
              </p>

              <div className="border border-stone-200 rounded-lg p-3 bg-stone-50 text-xs font-mono space-y-2">
                <p className="text-emerald-800 font-bold">// Example: Updating School Enrollment &amp; Targets</p>
                <div className="bg-white p-3 rounded border border-stone-200 text-slate-800">
                  <pre>{`// In src/data/organizationData.ts:
stats: {
  enrollmentPlaceholder: "348 Enrolled Students (Term 1 2026)",
  teachingStaffPlaceholder: "14 Certified Instructors",
  classroomsCountPlaceholder: "8 Active Classrooms",
  targetFundraisingPlaceholder: "$45,000 USD",
  securedFundingPlaceholder: "$18,200 USD Secured",
}`}</pre>
                </div>
              </div>

              <div className="border border-stone-200 rounded-lg p-3 bg-stone-50 text-xs font-mono space-y-2">
                <p className="text-emerald-800 font-bold">// Example: Updating Official Bank / Wire Details</p>
                <div className="bg-white p-3 rounded border border-stone-200 text-slate-800">
                  <pre>{`donorAccountDetails: {
  bankNamePlaceholder: "Ecobank South Sudan Ltd, Juba Branch",
  accountNamePlaceholder: "Victorious Royal Assembly International",
  usdAccountNoPlaceholder: "123-4567890-USD",
  swiftBicPlaceholder: "ECOBSDJUXXX",
}`}</pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'slots' && (
            <div className="space-y-3">
              <p className="text-xs text-stone-600">
                Below is the registry of all photo slots currently waiting for real photographs. You can copy any path to organize your files:
              </p>

              <div className="border border-stone-200 rounded-lg divide-y divide-stone-200 overflow-hidden">
                {imageSlots.map((slot) => (
                  <div key={slot.path} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-stone-50 transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-xs">{slot.label}</span>
                        <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-mono">
                          {slot.aspect}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500">{slot.description}</p>
                      <code className="text-[10px] font-mono text-emerald-800">{slot.path}</code>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(slot.path)}
                      className="self-start sm:self-center px-3 py-1.5 text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      {copiedPath === slot.path ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Path</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            Victorious Royal Assembly International · Web Asset System
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
          >
            Done Reading
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetGuideModal;
