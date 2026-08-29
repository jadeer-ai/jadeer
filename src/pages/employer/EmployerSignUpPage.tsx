import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrandLogo } from '@/components/common';
import { validateCorporateEmail } from '@/utils/validators';
import { useCompanyProfile, type WorkModel } from '@/contexts/CompanyProfileContext';
import {
  Building2,
  MapPin,
  Globe,
  FileCheck2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Laptop,
  Home,
  Users,
  Briefcase,
  Mail,
  User,
  Check,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — EMPLOYER SIGNUP & COMPANY ONBOARDING FLOW
   Signature Brand Identity: Clean Cream (#FAF9F6), Sage Green (#6E8F75),
   and Deep Navy (#0B0F19)
   ═══════════════════════════════════════════════════════════════════════════ */

const industries = [
  'FinTech & Digital Payments',
  'Cloud Infrastructure & DevOps',
  'Artificial Intelligence & ML',
  'Software & SaaS Engineering',
  'Cybersecurity & Defense',
  'HealthTech & BioInformatics',
  'E-Commerce & Logistics',
  'Telecom & IoT Systems',
  'Energy & CleanTech',
  'Consulting & Professional Services',
];

const companySizes = [
  '1-10 employees (Startup)',
  '11-50 employees (Growth)',
  '51-200 employees (Scale-up)',
  '201-500 employees (Mid-market)',
  '500+ employees (Enterprise)',
];

const workModels: { value: WorkModel; label: string; icon: typeof Building2; desc: string }[] = [
  { value: 'hybrid', label: 'Hybrid Work', icon: Laptop, desc: 'Flexible blend of office & remote days' },
  { value: 'remote', label: 'Fully Remote', icon: Home, desc: 'Work anywhere with digital-first tooling' },
  { value: 'on-site', label: 'On-site Office', icon: Building2, desc: 'Dedicated physical office environment' },
];

export default function EmployerSignUpPage() {
  const navigate = useNavigate();
  const { signupCompany } = useCompanyProfile();

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactRole, setContactRole] = useState('Head of Talent Acquisition');
  const [industry, setIndustry] = useState(industries[0]);
  const [companySize, setCompanySize] = useState(companySizes[2]);
  const [location, setLocation] = useState('Riyadh, Saudi Arabia');
  const [workModel, setWorkModel] = useState<WorkModel>('hybrid');
  const [website, setWebsite] = useState('');
  const [crNumber, setCrNumber] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Corporate Email Validation
  const emailValidation = validateCorporateEmail(workEmail);
  const isCorporateEmailValid = workEmail.trim() !== '' && emailValidation.isValid;

  // Form Validation
  const isFormValid =
    companyName.trim().length >= 2 &&
    isCorporateEmailValid &&
    contactName.trim().length >= 2 &&
    location.trim().length >= 2 &&
    agreedToTerms;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);

    setTimeout(() => {
      signupCompany({
        companyName: companyName.trim(),
        workEmail: workEmail.trim(),
        contactName: contactName.trim(),
        contactRole: contactRole.trim() || 'Hiring Lead',
        industry,
        companySize,
        location: location.trim(),
        workModel,
        website: website.trim() || `https://${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        commercialRegistrationNumber: crNumber.trim() || '1010' + Math.floor(100000 + Math.random() * 900000),
      });

      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        navigate('/employer/dashboard');
      }, 1200);
    }, 800);
  };

  const getCompanyInitials = () => {
    const parts = companyName.trim().split(/\s+/);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return companyName.slice(0, 2).toUpperCase() || 'CO';
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-6 text-center animate-[fade-in_0.4s_ease]">
        <div className="w-20 h-20 rounded-3xl bg-[#6E8F75]/15 text-[#6E8F75] flex items-center justify-center mb-6 shadow-xl animate-[scale-up_0.4s_var(--ease-spring)]">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#6E8F75] bg-[#6E8F75]/10 border border-[#6E8F75]/20 px-3.5 py-1 rounded-full mb-3">
          Onboarding Verified
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B0F19] tracking-tight">
          Welcome to Jadeer, <span className="text-[#6E8F75]">{companyName}</span>!
        </h1>
        <p className="mt-2 text-[15px] text-[#0B0F19]/55 font-medium max-w-md">
          Your company profile is registered and verified. Redirecting you to your hiring workspace…
        </p>
        <div className="mt-8 flex items-center gap-2 text-xs font-bold text-[#0B0F19]/40">
          <span className="w-2 h-2 rounded-full bg-[#6E8F75] animate-ping" />
          Loading Employer Workspace…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#0B0F19] relative overflow-hidden flex flex-col justify-between selection:bg-[#6E8F75]/20 selection:text-[#0B0F19]">
      {/* ── Background Technical Grid ─────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-45"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(11, 15, 25, 0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(11, 15, 25, 0.035) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 20%, #000 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 20%, #000 30%, transparent 80%)',
        }}
      />

      {/* Diffused Glow */}
      <div
        className="absolute top-0 right-1/4 w-[600px] h-[400px] rounded-full pointer-events-none blur-3xl opacity-35"
        style={{
          background: 'radial-gradient(circle at center, rgba(110,143,117,0.22) 0%, rgba(11,15,25,0.04) 50%, transparent 75%)',
        }}
      />

      {/* ── Top Header Bar ────────────────────────────────────────────── */}
      <header className="relative z-20 border-b border-[#0B0F19]/[0.05] bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-18 flex items-center justify-between">
          <BrandLogo size="md" href="/" />

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#6E8F75] bg-[#6E8F75]/10 border border-[#6E8F75]/20 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              Employer Partner Onboarding
            </span>
            <Link
              to="/employer"
              className="text-xs sm:text-sm font-semibold text-[#0B0F19]/60 hover:text-[#0B0F19] transition-colors"
            >
              About Employer Portal
            </Link>
            <Link
              to="/employer/signin"
              className="text-xs sm:text-sm font-semibold text-[#0B0F19]/60 hover:text-[#0B0F19] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Onboarding Form & Live Preview Layout ───────────────── */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 sm:px-10 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

          {/* ── Left Column: Comprehensive Registration Form (7 cols) ─── */}
          <div className="lg:col-span-7 space-y-8 animate-[fade-in_0.3s_ease]">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#6E8F75]/10 border border-[#6E8F75]/20 text-[#6E8F75] text-xs font-bold mb-3">
                <Building2 className="w-3.5 h-3.5" />
                Company Account Registration
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0B0F19] tracking-tight">
                Hire Verified Engineering <span className="text-[#6E8F75]">Talent</span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-[#0B0F19]/55 leading-relaxed font-medium">
                Set up your organization profile on Jadeer. Gain immediate access to pre-evaluated graduates, verified technical skill graphs, and synchronized interview workflows.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ── Section 1: Company & Contact Identity ──────────────── */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B0F19]/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-5">
                <div className="flex items-center gap-2.5 pb-2 border-b border-[#0B0F19]/[0.04]">
                  <div className="w-8 h-8 rounded-xl bg-[#6E8F75]/10 text-[#6E8F75] flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#0B0F19]">Company & Primary Contact</h2>
                    <p className="text-[11px] text-[#0B0F19]/45">Official organization identity details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Company Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#0B0F19]/70 mb-1.5">
                      Company Legal Name <span className="text-danger-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B0F19]/30" />
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. STC Pay, Elm Technologies, Aramco Digital"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#0B0F19]/[0.08] bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6E8F75]/30 focus:border-[#6E8F75] transition-all placeholder:text-[#0B0F19]/25"
                      />
                    </div>
                  </div>

                  {/* Work Email */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-[#0B0F19]/70">
                        Official Corporate Email <span className="text-danger-500">*</span>
                      </label>
                      {workEmail && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            emailValidation.isValid
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                              : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                          }`}
                        >
                          {emailValidation.isValid ? `Verified Domain (@${emailValidation.domain})` : 'Corporate Email Required'}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B0F19]/30" />
                      <input
                        type="email"
                        value={workEmail}
                        onChange={(e) => setWorkEmail(e.target.value)}
                        placeholder="talent@yourcompany.com"
                        required
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white text-sm font-medium focus:outline-none transition-all placeholder:text-[#0B0F19]/25 ${
                          workEmail && !emailValidation.isValid
                            ? 'border-rose-300 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500'
                            : 'border-[#0B0F19]/[0.08] focus:ring-2 focus:ring-[#6E8F75]/30 focus:border-[#6E8F75]'
                        }`}
                      />
                    </div>
                    {workEmail && !emailValidation.isValid && (
                      <p className="text-[11px] text-rose-600 mt-1.5 font-medium leading-tight">
                        {emailValidation.error}
                      </p>
                    )}
                    <p className="text-[10.5px] text-[#0B0F19]/40 mt-1">
                      Must be an institutional or company domain. Personal webmail (Gmail, Yahoo, etc.) is rejected.
                    </p>
                  </div>

                  {/* Contact Person */}
                  <div>
                    <label className="block text-xs font-bold text-[#0B0F19]/70 mb-1.5">
                      Hiring Manager / Contact Name <span className="text-danger-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B0F19]/30" />
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Sarah Fahad"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#0B0F19]/[0.08] bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6E8F75]/30 focus:border-[#6E8F75] transition-all placeholder:text-[#0B0F19]/25"
                      />
                    </div>
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="block text-xs font-bold text-[#0B0F19]/70 mb-1.5">
                      Industry Domain
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#0B0F19]/[0.08] bg-white text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6E8F75]/30 focus:border-[#6E8F75] transition-all"
                    >
                      {industries.map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>

                  {/* Company Size */}
                  <div>
                    <label className="block text-xs font-bold text-[#0B0F19]/70 mb-1.5">
                      Company Headcount
                    </label>
                    <select
                      value={companySize}
                      onChange={(e) => setCompanySize(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#0B0F19]/[0.08] bg-white text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6E8F75]/30 focus:border-[#6E8F75] transition-all"
                    >
                      {companySizes.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* ── Section 2: Operations & Working Model ─────────────── */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B0F19]/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-5">
                <div className="flex items-center gap-2.5 pb-2 border-b border-[#0B0F19]/[0.04]">
                  <div className="w-8 h-8 rounded-xl bg-[#6E8F75]/10 text-[#6E8F75] flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#0B0F19]">Location & Working Model</h2>
                    <p className="text-[11px] text-[#0B0F19]/45">Specify office headquarters and remote policies</p>
                  </div>
                </div>

                {/* Working Model Selector */}
                <div>
                  <label className="block text-xs font-bold text-[#0B0F19]/70 mb-2">
                    Primary Engineering Working Model <span className="text-danger-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {workModels.map(({ value, label, icon: Icon, desc }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setWorkModel(value)}
                        className={`
                          p-4 rounded-2xl border text-left transition-all duration-200 relative
                          ${workModel === value
                            ? 'border-[#6E8F75] bg-[#6E8F75]/10 shadow-[0_4px_16px_rgba(110,143,117,0.15)]'
                            : 'border-[#0B0F19]/[0.08] bg-white hover:border-[#0B0F19]/[0.15]'}
                        `}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${workModel === value ? 'bg-[#6E8F75] text-white' : 'bg-[#0B0F19]/[0.04] text-[#0B0F19]/60'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          {workModel === value && (
                            <span className="w-4 h-4 rounded-full bg-[#6E8F75] text-white flex items-center justify-center text-[10px]">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm font-extrabold text-[#0B0F19]">{label}</p>
                        <p className="text-[11px] text-[#0B0F19]/45 mt-0.5 leading-tight">{desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Headquarters Location */}
                  <div>
                    <label className="block text-xs font-bold text-[#0B0F19]/70 mb-1.5">
                      Headquarters / Office City <span className="text-danger-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B0F19]/30" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Riyadh, Saudi Arabia"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#0B0F19]/[0.08] bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6E8F75]/30 focus:border-[#6E8F75] transition-all placeholder:text-[#0B0F19]/25"
                      />
                    </div>
                  </div>

                  {/* Company Website */}
                  <div>
                    <label className="block text-xs font-bold text-[#0B0F19]/70 mb-1.5">
                      Company Website
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B0F19]/30" />
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://company.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#0B0F19]/[0.08] bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6E8F75]/30 focus:border-[#6E8F75] transition-all placeholder:text-[#0B0F19]/25"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Section 3: Commercial Registration & Compliance ───── */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B0F19]/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-[#0B0F19]/[0.04]">
                  <div className="w-8 h-8 rounded-xl bg-[#6E8F75]/10 text-[#6E8F75] flex items-center justify-center">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#0B0F19]">Commercial Registration & Verification</h2>
                    <p className="text-[11px] text-[#0B0F19]/45">Provides verified trust mark on your candidate job postings</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B0F19]/70 mb-1.5">
                    Commercial Registration (CR) / Tax ID Number
                  </label>
                  <div className="relative">
                    <FileCheck2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B0F19]/30" />
                    <input
                      type="text"
                      value={crNumber}
                      onChange={(e) => setCrNumber(e.target.value)}
                      placeholder="e.g. 1010894231 (10-digit Saudi CR)"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#0B0F19]/[0.08] bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6E8F75]/30 focus:border-[#6E8F75] transition-all placeholder:text-[#0B0F19]/25"
                    />
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#0B0F19]/45 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#6E8F75] shrink-0" />
                    <span>Companies with verified CR status receive a Verified Employer badge across all candidate job listings.</span>
                  </div>
                </div>

                {/* Terms Consent */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 text-xs text-[#0B0F19]/65 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-[#6E8F75] focus:ring-[#6E8F75] accent-[#6E8F75] cursor-pointer"
                    />
                    <span>
                      I certify that I am an authorized representative of this organization and agree to Jadeer's{' '}
                      <strong className="text-[#0B0F19]">Employer Terms of Service</strong> and{' '}
                      <strong className="text-[#0B0F19]">Talent Privacy Policy</strong>.
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="
                  w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl
                  bg-[#6E8F75] text-white text-sm font-extrabold
                  shadow-[0_8px_24px_rgba(110,143,117,0.3)]
                  hover:bg-[#5d7d64] hover:shadow-[0_12px_32px_rgba(110,143,117,0.4)] hover:-translate-y-0.5
                  active:translate-y-0 active:scale-[0.99]
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
                  transition-all duration-200
                "
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying & Creating Employer Account…
                  </>
                ) : (
                  <>
                    <span>Complete Onboarding & Enter Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ── Right Column: Live Verified Company Card Preview (5 cols) ── */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="bg-[#0B0F19] rounded-3xl p-6 sm:p-8 text-white border border-white/[0.08] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] relative overflow-hidden">
              {/* Diffused internal glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#6E8F75]/20 rounded-full blur-2xl pointer-events-none" />

              <div className="relative space-y-6">
                {/* Header tag */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E8F75] bg-[#6E8F75]/15 border border-[#6E8F75]/30 px-3 py-1 rounded-full">
                    Live Candidate View Preview
                  </span>
                  <span className="text-xs text-white/40 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#6E8F75]" /> Jadeer Verified
                  </span>
                </div>

                {/* Company Badge Presentation */}
                <div className="flex items-start gap-4 pt-2">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6E8F75] to-[#587a60] text-white flex items-center justify-center text-lg font-black shrink-0 shadow-lg shadow-[#6E8F75]/30">
                    {getCompanyInitials()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-extrabold text-white truncate">
                        {companyName || 'Your Company Name'}
                      </h3>
                      <ShieldCheck className="w-4 h-4 text-[#6E8F75] shrink-0" />
                    </div>
                    <p className="text-xs text-white/60 font-medium mt-0.5 truncate">{industry}</p>
                    <p className="text-[11px] text-[#6E8F75] font-semibold mt-1">
                      {companySize}
                    </p>
                  </div>
                </div>

                {/* Tags & Highlights */}
                <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/50 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#6E8F75]" /> Location
                    </span>
                    <span className="font-bold text-white/90">{location || 'Not set'}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/50 flex items-center gap-1.5">
                      <Laptop className="w-3.5 h-3.5 text-[#6E8F75]" /> Work Model
                    </span>
                    <span className="font-bold text-[#6E8F75] capitalize">{workModel}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/50 flex items-center gap-1.5">
                      <FileCheck2 className="w-3.5 h-3.5 text-[#6E8F75]" /> CR Verification
                    </span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      {crNumber ? 'CR ' + crNumber : 'Pending Entry'}
                    </span>
                  </div>
                </div>

                {/* Candidate Trust Guarantee */}
                <div className="pt-2 border-t border-white/[0.08] flex items-center gap-3 text-xs text-white/60">
                  <div className="w-7 h-7 rounded-lg bg-[#6E8F75]/20 text-[#6E8F75] flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <p className="leading-snug">
                    Candidates prioritize verified employer profiles for AI-assessed skill matching.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Benefits list */}
            <div className="bg-white rounded-3xl p-6 border border-[#0B0F19]/[0.06] space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#0B0F19]/40">
                What you unlock on Jadeer
              </h4>
              <ul className="space-y-2.5 text-xs text-[#0B0F19]/70 font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#6E8F75] shrink-0 mt-0.5" />
                  <span>Unlimited verified candidate profile browsing with deep code skill graphs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#6E8F75] shrink-0 mt-0.5" />
                  <span>Integrated AI technical interview scoring & mentor calibration reports.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#6E8F75] shrink-0 mt-0.5" />
                  <span>1-click interview scheduling with auto-sync directly into candidate schedules.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-[#0B0F19]/[0.05] bg-white/60 py-6">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#0B0F19]/40">
          <p>© {new Date().getFullYear()} Jadeer. Merit-Based Talent Validation Platform.</p>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-[#0B0F19] transition-colors">Home</Link>
            <Link to="/employer" className="hover:text-[#0B0F19] transition-colors">Employer Overview</Link>
            <Link to="/employer/signin" className="hover:text-[#0B0F19] transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
