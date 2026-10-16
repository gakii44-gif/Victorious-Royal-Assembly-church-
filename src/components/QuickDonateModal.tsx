import React, { useState } from 'react';
import { X, CheckCircle2, Copy, Check, HeartHandshake, Building2, Wrench, ShieldCheck, Download, Printer } from 'lucide-react';
import { organizationData } from '../data/organizationData';

interface QuickDonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDesignation?: 'heritage' | 'vocational' | 'both' | 'general';
}

export const QuickDonateModal: React.FC<QuickDonateModalProps> = ({
  isOpen,
  onClose,
  defaultDesignation = 'both',
}) => {
  const [designation, setDesignation] = useState<'heritage' | 'vocational' | 'both' | 'general'>(defaultDesignation);
  const [frequency, setFrequency] = useState<'monthly' | 'one-time'>('monthly');
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorType, setDonorType] = useState<'individual' | 'church' | 'ngo' | 'foundation'>('individual');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorCountry, setDonorCountry] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [pledgeRef, setPledgeRef] = useState('');

  if (!isOpen) return null;

  const presetAmounts = frequency === 'monthly' ? [25, 50, 100, 250, 500] : [50, 100, 250, 500, 1500];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSubmitPledge = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount ? parseFloat(customAmount) : amount;
    const ref = `VRAI-${Math.floor(100000 + Math.random() * 900000)}`;
    setPledgeRef(ref);
    setIsSubmitted(true);
  };

  const getTargetTitle = () => {
    switch (designation) {
      case 'heritage':
        return 'Victorious Heritage Model Academy (Primary School)';
      case 'vocational':
        return 'Victorious Vocational School (Vocational Training)';
      case 'both':
        return 'Equal Dual-Impact (50% Heritage Academy / 50% Vocational)';
      default:
        return 'General Ministry & Juba Community Missions';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Support &amp; Partner with Our Schools
              </h3>
              <p className="text-xs text-stone-500">
                Direct wire transfer &amp; partnership pledge for Juba, South Sudan
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-stone-700">
          {!isSubmitted ? (
            <form onSubmit={handleSubmitPledge} className="space-y-6">
              {/* Step 1: Designation Selection (Heritage vs Vocational vs Both) */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
                  1. Choose Your Priority Allocation:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDesignation('heritage')}
                    className={`p-3 text-left rounded-lg border text-xs transition-all ${
                      designation === 'heritage'
                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-semibold ring-1 ring-emerald-600'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-emerald-800 mb-1 font-bold">
                      <Building2 className="w-4 h-4" />
                      <span>Heritage Academy</span>
                    </div>
                    <span className="text-[11px] text-stone-600 block">
                      Primary education, literacy, child meals, textbooks
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDesignation('vocational')}
                    className={`p-3 text-left rounded-lg border text-xs transition-all ${
                      designation === 'vocational'
                        ? 'border-amber-600 bg-amber-50/80 text-amber-950 font-semibold ring-1 ring-amber-600'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-amber-800 mb-1 font-bold">
                      <Wrench className="w-4 h-4" />
                      <span>Vocational School</span>
                    </div>
                    <span className="text-[11px] text-stone-600 block">
                      Youth trades, tailoring, solar, carpentry, tools
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDesignation('both')}
                    className={`p-3 text-left rounded-lg border text-xs transition-all ${
                      designation === 'both'
                        ? 'border-emerald-700 bg-stone-900 text-white font-semibold ring-1 ring-emerald-500'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 font-bold text-emerald-400">
                      <HeartHandshake className="w-4 h-4" />
                      <span>Both Schools (50/50)</span>
                    </div>
                    <span className={`text-[11px] block ${designation === 'both' ? 'text-stone-300' : 'text-stone-600'}`}>
                      Split equally between primary and technical youth
                    </span>
                  </button>
                </div>
              </div>

              {/* Step 2: Frequency & Amount */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    2. Support Frequency &amp; Amount:
                  </label>
                  <div className="flex items-center bg-stone-100 p-0.5 rounded-md text-xs">
                    <button
                      type="button"
                      onClick={() => setFrequency('monthly')}
                      className={`px-3 py-1 rounded transition-colors ${
                        frequency === 'monthly'
                          ? 'bg-white text-slate-900 font-semibold shadow-xs'
                          : 'text-stone-600 hover:text-slate-900'
                      }`}
                    >
                      Monthly Partner
                    </button>
                    <button
                      type="button"
                      onClick={() => setFrequency('one-time')}
                      className={`px-3 py-1 rounded transition-colors ${
                        frequency === 'one-time'
                          ? 'bg-white text-slate-900 font-semibold shadow-xs'
                          : 'text-stone-600 hover:text-slate-900'
                      }`}
                    >
                      One-Time Gift
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {presetAmounts.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setAmount(val);
                        setCustomAmount('');
                      }}
                      className={`py-2 text-center rounded-lg border text-sm font-semibold transition-all ${
                        amount === val && !customAmount
                          ? 'border-emerald-800 bg-emerald-800 text-white shadow-xs'
                          : 'border-stone-200 hover:border-stone-300 text-slate-800 bg-white'
                      }`}
                    >
                      ${val}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500 whitespace-nowrap">Or custom USD:</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-semibold">$</span>
                    <input
                      type="number"
                      placeholder="Enter other amount"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setAmount(0);
                      }}
                      className="w-full pl-7 pr-3 py-1.5 text-xs border border-stone-200 rounded-md focus:border-emerald-600 focus:outline-hidden"
                      min="1"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Donor Details */}
              <div className="space-y-3 pt-2 border-t border-stone-200">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
                  3. Donor / Partner Information:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-stone-500 block mb-1">Donor Name / Organization</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Grace Fellowship / John Smith"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-stone-200 rounded-md focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-stone-500 block mb-1">Email Address (for receipt &amp; reports)</label>
                    <input
                      type="email"
                      required
                      placeholder="contact@donor.org"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-stone-200 rounded-md focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-stone-500 block mb-1">Country / Region</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. United States, UK, Canada, Kenya"
                      value={donorCountry}
                      onChange={(e) => setDonorCountry(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-stone-200 rounded-md focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-stone-500 block mb-1">Partner Type</label>
                    <select
                      value={donorType}
                      onChange={(e) => setDonorType(e.target.value as any)}
                      className="w-full px-3 py-1.5 text-xs border border-stone-200 rounded-md focus:border-emerald-600 focus:outline-hidden bg-white"
                    >
                      <option value="individual">Individual Sponsor</option>
                      <option value="church">Partner Church / Denomination</option>
                      <option value="foundation">Charitable Foundation / Trust</option>
                      <option value="ngo">NGO / Relief Organization</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Wire & Bank Routing Details Box (Clean & Copyable) */}
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-900 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    Direct Official Bank Wire Details (Juba, South Sudan)
                  </span>
                  <span className="text-[10px] text-stone-500">USD &amp; SSP Transfers</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                  <div className="bg-white p-2 rounded border border-stone-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block font-sans">Beneficiary</span>
                      <span className="text-slate-900 font-medium">Victorious Royal Assembly Int'l</span>
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded border border-stone-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block font-sans">Bank Name</span>
                      <span className="text-slate-900">{organizationData.donorAccountDetails.bankNamePlaceholder}</span>
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded border border-stone-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block font-sans">USD Account Number</span>
                      <span className="text-slate-900">{organizationData.donorAccountDetails.usdAccountNoPlaceholder}</span>
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded border border-stone-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block font-sans">SWIFT / BIC Code</span>
                      <span className="text-slate-900">{organizationData.donorAccountDetails.swiftBicPlaceholder}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-emerald-800 hover:bg-emerald-900 rounded-md transition-all shadow-xs"
                >
                  Confirm Pledge &amp; Receive Instructions
                </button>
              </div>
            </form>
          ) : (
            /* Confirmation Screen */
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  Thank You for Standing with Juba, South Sudan!
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  Your pledge has been logged with Reference Code: <strong className="font-mono text-emerald-800">{pledgeRef}</strong>
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between border-b border-stone-200 pb-1">
                  <span className="text-stone-500">Designated Focus:</span>
                  <span className="font-semibold text-slate-900">{getTargetTitle()}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-1">
                  <span className="text-stone-500">Pledge Commitment:</span>
                  <span className="font-semibold text-slate-900">
                    ${customAmount || amount} USD ({frequency})
                  </span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-1">
                  <span className="text-stone-500">Donor / Partner:</span>
                  <span className="font-semibold text-slate-900">{donorName} ({donorCountry})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Liaison Email:</span>
                  <span className="text-emerald-800 font-mono">{organizationData.contact.donorLiaisonEmailPlaceholder}</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                Please quote reference <strong>{pledgeRef}</strong> when initiating your bank wire transfer or mobile remittance. Our school finance committee will acknowledge receipt and deliver termly photographic progress reports directly to your email.
              </p>

              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Pledge Receipt
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-md transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickDonateModal;
