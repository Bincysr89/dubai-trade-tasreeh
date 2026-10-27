import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { font, GSection, Grid4, GInput, GSelect, PrimaryBtn, SecondaryBtn } from '../components/gatepass/GateFields';
import { setAuthenticated } from '../auth';
import { setPersona } from '../persona';
const uaePassLogoSrc = new URL('../assets/uaepass-logo.svg', import.meta.url).href;

/* ──────────────────────────────────────────────────────────────
   UAE PASS sign-in for an individual (User Management Figma
   16178:28201 UAE PASS login · 17407:61879 Update Profile).
   ────────────────────────────────────────────────────────────── */

const uaeFont = "'Roboto', 'Helvetica Neue', Arial, sans-serif";
const Stripe = () => <div className="h-[5px] w-full" style={{ background: 'linear-gradient(90deg, #00857c 0%, #7cc6a6 50%, #f3d98b 100%)' }} />;

/* ── UAE PASS — Login (Figma 16178:28201) ── */
export function UaePassLoginPage() {
  const navigate = useNavigate();
  const [id, setId] = useState('971559524462');
  const [remember, setRemember] = useState(true);

  const login = () => {
    setAuthenticated(true);
    try { sessionStorage.removeItem('dt-bu-linked'); } catch { /* ignore */ }
    setPersona('individual');
    navigate('/uaepass/profile');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ fontFamily: uaeFont }}>
      <Stripe />
      <main className="flex-1 flex flex-col items-center px-4 pt-[56px] pb-16">
        <img src={uaePassLogoSrc} alt="UAE PASS" style={{ width: 66, height: 66 }} />
        <h1 className="text-[24px] font-semibold text-[#111] mt-[32px] mb-[30px]">Login to UAE PASS</h1>
        <form className="w-full max-w-[342px] flex flex-col" onSubmit={e => { e.preventDefault(); login(); }}>
          <input value={id} onChange={e => setId(e.target.value)} aria-label="Emirates ID, email or phone"
            placeholder="Emirates ID, email, or phone e.g. 971500000000"
            className="h-[40px] rounded-[6px] px-[13px] text-[15px] text-[#111] focus:outline-none"
            style={{ border: '1px solid #9fc6f5', boxShadow: '0 0 0 2px rgba(19,96,210,0.06)' }} />
          <label className="flex items-center gap-[10px] mt-[14px] text-[13px] text-[#222] cursor-pointer select-none">
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
              className="size-[16px] cursor-pointer" style={{ accentColor: '#e5195e' }} />
            Remember me
          </label>
          <button type="submit"
            className="h-[40px] mt-[14px] rounded-[4px] text-white text-[16px] font-semibold hover:opacity-90 transition-opacity"
            style={{ background: '#7a869e' }}>
            Login
          </button>
        </form>
        <div className="w-full max-w-[342px] h-px bg-[#e5e5e5] mt-[18px] mb-[18px]" />
        <p className="text-[12px] text-[#222]">
          Don&apos;t have UAEPASS account? <a href="#" onClick={e => e.preventDefault()} className="font-semibold" style={{ color: '#00a14b' }}>Create new account</a>
        </p>
        <a href="#" onClick={e => e.preventDefault()} className="text-[12px] font-semibold mt-[24px]" style={{ color: '#00a14b' }}>Recover your account</a>
      </main>
      <footer className="border-t border-[#eee] pt-[18px] flex flex-col items-center gap-[18px]">
        <nav className="flex flex-wrap justify-center gap-x-[22px] gap-y-2 text-[11px] text-[#444]">
          {['Home', 'About', 'Support', 'FAQ', 'Kiosk Locations', 'Service Provider'].map(l => (
            <a key={l} href="#" onClick={e => e.preventDefault()} className="hover:underline">{l}</a>
          ))}
        </nav>
        <p className="text-[9px] text-[#444] mb-[12px]">Copyright © 2026 UAE PASS All rights reserved.</p>
        <Stripe />
      </footer>
    </div>
  );
}

/* ── Update Profile Information (Figma 17407:61879) ── */
const PROFILE_DEFAULTS = {
  title: 'Mr.', firstName: 'Ahmed', middleName: '', lastName: 'Al Marri', nationality: 'United Arab Emirates',
  poBox: '168901', ageGroup: '36 - 45', designation: 'Engineer', emiratesId: '784-1988-7654321-2',
  email: 'ahmed.almarri@gmail.com', confirmEmail: 'ahmed.almarri@gmail.com', companyPhone: '971 - 4 - 4337000',
  directPhone: '971 - 55 - 9524462', mobile: '971 - 55 - 9524462', fax: '',
};

export function UpdateProfilePage() {
  const navigate = useNavigate();
  const [p, setP] = useState(PROFILE_DEFAULTS);
  const set = (k: keyof typeof PROFILE_DEFAULTS) => (v: string) => setP(prev => ({ ...prev, [k]: v }));

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafd]" style={{ fontFamily: font }}>
      <header className="relative h-[100px] flex items-center px-4 sm:px-[43px] overflow-hidden flex-shrink-0"
        style={{ background: 'linear-gradient(12.6deg, #0e1b3d 51%, #dc3545 146%)' }}>
        <Logo height={46} white />
      </header>

      <main className="flex-1 px-4 sm:px-[43px] pt-[27px] pb-[32px]">
        <h1 className="text-[24px] font-medium text-[#111838] mb-[24px]">Update Profile Information</h1>
        <GSection title="Profile Information">
          <Grid4>
            <GSelect label="Title" value={p.title} options={['Mr.', 'Mrs.', 'Ms.', 'Dr.']} onChange={set('title')} required />
            <GInput label="First Name" value={p.firstName} onChange={set('firstName')} required />
            <GInput label="Middle Name" value={p.middleName} onChange={set('middleName')} placeholder="--" />
            <GInput label="Last Name" value={p.lastName} onChange={set('lastName')} required />
            <GInput label="Nationality" value={p.nationality} readOnly />
            <GInput label="P.O Box" value={p.poBox} onChange={set('poBox')} required />
            <GSelect label="Age Group" value={p.ageGroup} options={['18 - 25', '26 - 35', '36 - 45', '46 - 55', '56+']} onChange={set('ageGroup')} />
            <GInput label="Designation" value={p.designation} onChange={set('designation')} required />
            <GInput label="Emirates ID" value={p.emiratesId} readOnly />
          </Grid4>
        </GSection>
        <GSection title="Contact Information">
          <Grid4>
            <GInput label="E-mail" value={p.email} onChange={set('email')} required />
            <GInput label="Confirm E-mail" value={p.confirmEmail} onChange={set('confirmEmail')} required />
            <GInput label="Company Telephone No" value={p.companyPhone} onChange={set('companyPhone')} required />
            <GInput label="Direct Telephone No" value={p.directPhone} onChange={set('directPhone')} required />
            <GInput label="Mobile No" value={p.mobile} onChange={set('mobile')} required />
            <GInput label="Fax No" value={p.fax} onChange={set('fax')} placeholder="971 - 4 - XXXXXXX" />
          </Grid4>
        </GSection>
      </main>

      <div className="bg-white flex items-center justify-end gap-[16px] px-4 sm:px-[40px] py-[16px] sticky bottom-0"
        style={{ boxShadow: '0 -4px 20px rgba(14,27,61,0.08)' }}>
        <SecondaryBtn onClick={() => setP(PROFILE_DEFAULTS)}>Reset</SecondaryBtn>
        <PrimaryBtn onClick={() => navigate('/landing/individual', { state: { welcome: true } })}>Submit</PrimaryBtn>
      </div>
    </div>
  );
}
