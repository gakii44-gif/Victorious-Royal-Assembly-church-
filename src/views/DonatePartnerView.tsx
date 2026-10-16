import React, { useState } from 'react';
import { NavView } from '../components/Navbar';
import { organizationData } from '../data/organizationData';
import { 
  HeartHandshake, 
  Building2, 
  Wrench, 
  ShieldCheck, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  CheckCircle2, 
  HelpCircle,
  Mail,
  Phone,
  FileCheck2,
  Compass
} from 'lucide-react';

interface DonatePartnerViewProps {
  onNavigate: (view: NavView) => void;
  onOpenAssetGuide: () => void;
  onOpenDonateModal: (designation?: 'heritage' | 'vocational' | 'both' | 'general') => void;
}

export const DonatePartnerView: React.FC<DonatePartnerViewProps> = ({
  onNavigate,
  onOpenAssetGuide,
  onOpenDonateModal,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedAllocation, setSelectedAllocation] = useState<'both' | 'heritage' | 'vocational' | 'general'>('both');
  const [frequency, setFrequency] = useState<'monthly' | 'one-time'>('monthly');
  const [amount, setAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isPledged, setIsPledged] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorOrg, setDonorOrg] = useState('');
  const [donorCountry, setDonorCountry] = useState('');
  const [pledgeCode, setPledgeCode] = useState('');

  const { donorAccountDetails } = organizationData;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `VRAI-JUBA-${Math.floor(100000 + Math.random() * 900000)}`;
    setPledgeCode(code);
    setIsPledged(true);
  };

  const presetAmounts = frequency === 'monthly' ? [25, 50, 100, 250, 500] : [75, 150, 350, 750, 2000];

  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="bg-stone-900 text-white py-16 px-4 sm:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-emerald-400 font-semibold">
            <span>International Donor &amp; NGO Portal</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>Juba, South Sudan</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
            Donate &amp; Partner with Our Schools
          </h1>

          <p className="text-base sm:text-lg text-stone-300 max-w-3xl leading-relaxed">
            Support <strong>Victorious Heritage Model Academy</strong> (primary school), <strong>Victorious Vocational School</strong> (youth technical skills), or invest equally across both frontline institutions.
          </p>

          <div className="p-4 bg-stone-800/80 rounded-lg border border-stone-700/80 max-w-3xl text-xs text-stone-300 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Strict Designated Fund Accountability:</strong>
              <p className="mt-0.5 text-stone-400">
                100% of your designated contribution goes directly to teacher stipends, student desks, textbooks, workshop machines, and pupil meals in Juba. We do not deduct international administrative cuts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* THREE CLEAR SUPPORT TRACKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
            Designated Allocation Options
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            How You Can Direct Your Support
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Choose to fund primary childhood literacy, practical youth livelihoods, or divide your gift equally between both schools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Option 1: Heritage Academy */}
          <div 
            onClick={() => setSelectedAllocation('heritage')}
            className={`p-6 rounded-xl border cursor-pointer transition-all ${
              selectedAllocation === 'heritage'
                ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-600'
                : 'border-stone-200 bg-white hover:border-stone-300'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Option 1</span>
              <span className="text-[11px] font-mono text-stone-500">Primary Focus</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Victorious Heritage Model Academy
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              Direct support for Nursery to Primary 8 children. Funds classroom building, wooden study desks, textbooks, teacher stipends, and morning porridge meals.
            </p>
            <ul className="space-y-1.5 text-xs text-stone-600 border-t border-stone-200/60 pt-3">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>$25/mo: Full Pupil Annual Sponsorship</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>$75: Dual Wooden Study Desk</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>$1,500: Classroom Building Block Unit</span>
              </li>
            </ul>
          </div>

          {/* Option 2: Vocational School */}
          <div 
            onClick={() => setSelectedAllocation('vocational')}
            className={`p-6 rounded-xl border cursor-pointer transition-all ${
              selectedAllocation === 'vocational'
                ? 'border-amber-600 bg-amber-50/50 shadow-md ring-2 ring-amber-600'
                : 'border-stone-200 bg-white hover:border-stone-300'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
              <Wrench className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Option 2</span>
              <span className="text-[11px] font-mono text-stone-500">Technical Focus</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Victorious Vocational School
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              Direct support for youth trades. Equips tailoring workshops, solar electrician testing kits, carpentry benches, and graduate business starter toolboxes.
            </p>
            <ul className="space-y-1.5 text-xs text-stone-600 border-t border-stone-200/60 pt-3">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span>$40/mo: Vocational Trainee Scholarship</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span>$220: Graduate Starter Toolset</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span>$350: Workshop Sewing / Power Machine</span>
              </li>
            </ul>
          </div>

          {/* Option 3: Dual School Fund (Recommended) */}
          <div 
            onClick={() => setSelectedAllocation('both')}
            className={`p-6 rounded-xl border cursor-pointer transition-all relative ${
              selectedAllocation === 'both'
                ? 'border-emerald-700 bg-stone-900 text-white shadow-lg ring-2 ring-emerald-500'
                : 'border-stone-200 bg-white hover:border-stone-300'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-800 text-white flex items-center justify-center mb-4">
              <HeartHandshake className="w-5 h-5 text-emerald-300" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${selectedAllocation === 'both' ? 'text-emerald-400' : 'text-emerald-800'}`}>
                Option 3 (Equal Priority)
              </span>
              <span className="text-[10px] font-semibold bg-emerald-600 text-white px-2 py-0.5 rounded">
                Recommended
              </span>
            </div>
            <h3 className={`text-lg font-bold mb-2 ${selectedAllocation === 'both' ? 'text-white' : 'text-slate-900'}`}>
              50/50 Dual School Fund
            </h3>
            <p className={`text-xs leading-relaxed mb-4 ${selectedAllocation === 'both' ? 'text-stone-300' : 'text-stone-600'}`}>
              Splits your gift equally (50% to Heritage Model Academy / 50% to Victorious Vocational School). Maximizes comprehensive community transformation from childhood to career.
            </p>
            <ul className={`space-y-1.5 text-xs border-t pt-3 ${selectedAllocation === 'both' ? 'border-stone-800 text-stone-300' : 'border-stone-200/60 text-stone-600'}`}>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Balanced capital expansion for both campuses</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Primary literacy + youth trade empowerment</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Unified bi-annual donor progress report</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* OFFICIAL BANK WIRE TRANSFER DETAILS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                Direct Institutional Routing
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                International Bank Wire Transfer Details
              </h2>
              <p className="text-xs text-stone-600 mt-0.5">
                For transfers from the US, UK, Europe, Canada, Kenya, Uganda, and international partner banks.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-stone-500 bg-stone-100 px-2 py-1 rounded">
                Currency: USD &amp; SSP
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Beneficiary */}
            <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-500 block font-sans">Beneficiary Account Name</span>
                <span className="text-slate-900 font-bold text-sm">
                  {donorAccountDetails.accountNamePlaceholder}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(donorAccountDetails.accountNamePlaceholder, 'beneficiary')}
                className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-stone-200 rounded transition-colors"
                title="Copy Name"
              >
                {copiedKey === 'beneficiary' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Bank Name */}
            <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-500 block font-sans">Bank Name &amp; Branch</span>
                <span className="text-slate-900 font-semibold text-xs">
                  {donorAccountDetails.bankNamePlaceholder}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(donorAccountDetails.bankNamePlaceholder, 'bank')}
                className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-stone-200 rounded transition-colors"
                title="Copy Bank"
              >
                {copiedKey === 'bank' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* USD Account */}
            <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-500 block font-sans">USD Account Number</span>
                <span className="text-slate-900 font-bold text-sm">
                  {donorAccountDetails.usdAccountNoPlaceholder}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(donorAccountDetails.usdAccountNoPlaceholder, 'usd')}
                className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-stone-200 rounded transition-colors"
                title="Copy USD Account"
              >
                {copiedKey === 'usd' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* SWIFT / BIC */}
            <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-500 block font-sans">SWIFT / BIC Code</span>
                <span className="text-slate-900 font-bold text-sm">
                  {donorAccountDetails.swiftBicPlaceholder}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(donorAccountDetails.swiftBicPlaceholder, 'swift')}
                className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-stone-200 rounded transition-colors"
                title="Copy SWIFT"
              >
                {copiedKey === 'swift' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-stone-500 border-t border-stone-100">
            <span>
              Transfer Reference Suggestion: <strong className="font-mono text-slate-800">VRAI - [HERITAGE / VOCATIONAL / BOTH] - [YOUR NAME]</strong>
            </span>
            <button
              onClick={() => window.print()}
              className="text-stone-700 hover:text-slate-900 flex items-center gap-1.5 underline underline-offset-4 self-start sm:self-auto"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Wire Details Slip</span>
            </button>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DONOR PLEDGE & LIAISON NOTIFICATION FORM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Cols: The Form */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                Official Donor Intent
              </span>
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                Log a Support Pledge &amp; Receive Direct Receipt Confirmation
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Notify our school finance board in Juba so we can immediately match incoming bank wires to your designated school and prepare your photographic progress report.
              </p>
            </div>

            {!isPledged ? (
              <form onSubmit={handlePledgeSubmit} className="space-y-4 text-xs">
                {/* Frequency & Amount */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-900">Select Amount (USD):</label>
                    <div className="flex items-center bg-stone-100 p-0.5 rounded text-[11px]">
                      <button
                        type="button"
                        onClick={() => setFrequency('monthly')}
                        className={`px-2.5 py-1 rounded transition-colors ${frequency === 'monthly' ? 'bg-white font-bold shadow-xs text-slate-900' : 'text-stone-600'}`}
                      >
                        Monthly
                      </button>
                      <button
                        type="button"
                        onClick={() => setFrequency('one-time')}
                        className={`px-2.5 py-1 rounded transition-colors ${frequency === 'one-time' ? 'bg-white font-bold shadow-xs text-slate-900' : 'text-stone-600'}`}
                      >
                        One-Time
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
                        className={`py-2 text-center rounded border font-semibold ${
                          amount === val && !customAmount
                            ? 'border-emerald-800 bg-emerald-800 text-white'
                            : 'border-stone-200 bg-white hover:border-stone-300 text-slate-800'
                        }`}
                      >
                        ${val}
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    placeholder="Or enter custom USD amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setAmount(0);
                    }}
                    className="w-full px-3 py-2 border border-stone-200 rounded focus:border-emerald-700 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[11px] text-stone-600 block mb-1">Donor Full Name / Ministry</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Calvary Chapel / Dr. Sarah Jenkins"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-200 rounded focus:border-emerald-700 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-stone-600 block mb-1">Email (for termly reports &amp; letters)</label>
                    <input
                      type="email"
                      required
                      placeholder="contact@donor.org"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-200 rounded focus:border-emerald-700 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-stone-600 block mb-1">Country / City</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Atlanta, USA / London, UK"
                      value={donorCountry}
                      onChange={(e) => setDonorCountry(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-200 rounded focus:border-emerald-700 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-stone-600 block mb-1">Organization / Foundation (Optional)</label>
                    <input
                      type="text"
                      placeholder="Church, Trust, or NGO name"
                      value={donorOrg}
                      onChange={(e) => setDonorOrg(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-200 rounded focus:border-emerald-700 focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-white bg-emerald-800 hover:bg-emerald-900 rounded transition-colors shadow-xs"
                >
                  Confirm Support Pledge &amp; Generate Transfer Reference
                </button>
              </form>
            ) : (
              <div className="p-6 bg-emerald-50 rounded-lg border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">
                  Pledge Registered Successfully
                </h4>
                <p className="text-xs text-stone-600 max-w-md mx-auto">
                  Your reference code is <strong className="font-mono text-emerald-900">{pledgeCode}</strong>. When you transfer funds via bank wire or mobile remitter, please quote this reference.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 text-xs font-medium bg-white border border-stone-200 rounded hover:bg-stone-50 flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print Reference Slip
                  </button>
                  <button
                    onClick={() => setIsPledged(false)}
                    className="px-4 py-2 text-xs font-semibold bg-emerald-800 text-white rounded hover:bg-emerald-900"
                  >
                    Log Another Gift
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right 5 Cols: NGO & Foundation Collaboration */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-stone-900 text-stone-200 rounded-xl p-6 space-y-4 border border-stone-800">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Institutional Partnerships
              </span>
              <h3 className="text-lg font-bold text-white font-heading">
                For NGOs, Foundations &amp; Churches
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Victorious Royal Assembly International actively collaborates with international partners on formal MOUs, joint community programs, and donor-advised grants.
              </p>

              <div className="space-y-3 pt-2 text-xs text-stone-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Church-to-Church Twinning:</strong> Pair your Sunday school or mission committee with Heritage Model Academy.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>NGO Technical Consumables:</strong> Supply solar demo rigs, sewing machines, or carpentry timber directly.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Foundation Capital Grants:</strong> Fund dedicated classroom blocks or workshop halls named in honor of your foundation.
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-800 text-xs">
                <p className="text-stone-400 mb-2">Speak directly with our International Liaison in Juba:</p>
                <div className="flex items-center gap-2 text-emerald-400 font-mono">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span className="select-all">{organizationData.contact.donorLiaisonEmailPlaceholder}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS FOR DONORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="border-b border-stone-200 pb-3">
          <h3 className="font-bold text-slate-900 text-xl font-heading">
            Frequently Asked Questions for International Donors
          </h3>
          <p className="text-xs text-stone-500">
            Transparent answers regarding bank wire security, reporting cadence, and currency conversions in South Sudan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-700">
          <div className="p-5 bg-white rounded-lg border border-stone-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">How do wire transfers reach Juba safely?</h4>
            <p className="leading-relaxed text-stone-600">
              International wires are processed via corresponding banks (typically in New York, London, or Nairobi) directly into our designated institutional account in Juba with standard SWIFT authentication.
            </p>
          </div>

          <div className="p-5 bg-white rounded-lg border border-stone-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">Will I receive photographic progress reports?</h4>
            <p className="leading-relaxed text-stone-600">
              Yes. All donors who register their email receive bi-annual student progress summaries and high-resolution photographs of sponsored desks, classroom construction, or workshop equipment in active use.
            </p>
          </div>

          <div className="p-5 bg-white rounded-lg border border-stone-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">Can I sponsor both schools together?</h4>
            <p className="leading-relaxed text-stone-600">
              Yes. Selecting the <strong>50/50 Dual School Fund</strong> ensures that 50% of your funds go to the primary school (Heritage Academy) and 50% go to youth technical trades (Vocational School).
            </p>
          </div>

          <div className="p-5 bg-white rounded-lg border border-stone-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">Can we arrange an in-person visit to the school compound?</h4>
            <p className="leading-relaxed text-stone-600">
              International mission teams and NGO representatives are welcome to visit our campus in Juba. Please contact our liaison in advance to coordinate airport reception and classroom walkthroughs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DonatePartnerView;
