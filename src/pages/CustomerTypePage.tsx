import { setPersona, type Persona } from '../persona';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthenticated } from '../auth';

/* ──────────────────────────────────────────────────────────────
   After-login "Select Agent Profile" popup. Each agent profile
   keeps its Tasreeh persona flow:
   1298 Tasreeh → Visitor Company · Air Clearing Agent → Visitor Company ·
   DCAA Member → Host Company · Other Agent Type → Other
   ────────────────────────────────────────────────────────────── */

type CardProps = {
  label: string;
  selected?: boolean;
  onClick: () => void;
};

/* Agent profile icon — building grid over a person, inside an open circle */
const AgentProfileIcon = () => (
  <svg viewBox="0 0 72 72" width="72" height="72" fill="none" aria-hidden="true">
    <path d="M10 58A34 34 0 1 1 62 58" stroke="#1a1a1a" strokeWidth="1.3" />
    {([[22, 16, '#1a1a1a'], [32, 16, '#ea2428'], [42, 16, '#1a1a1a'], [22, 27, '#ea2428'], [42, 27, '#ea2428']] as const).map(([x, y, c], i) => (
      <rect key={i} x={x} y={y} width="8" height="8" stroke={c} strokeWidth="1.4" />
    ))}
    <circle cx="36" cy="32" r="5" stroke="#1a1a1a" strokeWidth="1.4" />
    <path d="M24 58v-8c0-5 4-9 9-9h6c5 0 9 4 9 9v8M33 41l3 5 3-5M36 46v9" stroke="#1a1a1a" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

function AgentCard({ label, selected, onClick }: CardProps) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`relative bg-white rounded-[12px] w-full max-w-[228px] h-[294px] flex flex-col overflow-hidden transition-all
        ${selected ? 'border-2 border-[#1360d2] shadow-[0_8px_24px_-4px_rgba(19,96,210,0.25)]' : 'border-2 border-[#ddd] hover:border-[#0e1b3d]'}`}
    >
      {/* thin red corner curve */}
      <span className="absolute top-0 right-0 w-[78px] h-[56px] overflow-hidden pointer-events-none">
        <span className="absolute -top-[56px] -right-[78px] w-[156px] h-[112px] rounded-full border border-[#ea2428]" />
      </span>
      <span className="flex-1 flex items-end justify-center pb-[24px]">
        <AgentProfileIcon />
      </span>
      <span className="w-full min-h-[100px] bg-[#f9f9f9] flex items-center justify-center px-[14px] py-[12px] text-center">
        <span className="text-[#0e1b3d] font-medium text-[17px] leading-[24px] line-clamp-3">{label}</span>
      </span>
      <span className="h-[20px] flex-shrink-0" />
    </button>
  );
}

const PERSONA_BY_ID: Record<string, Persona> = { trader: 'visitor-company', shipping: 'visitor-company', airline: 'host-company', other: 'other' };

const PROFILES = [
  { id: 'trader',   label: '1298 - Tasreeh - Company Name',                                       target: '/landing/shipping-agent' },
  { id: 'shipping', label: '16545641654 - Air - Clearing Agent - SWBRO01 M&M Private L.L.C',    target: '/landing/shipping-agent' },
  { id: 'airline',  label: '32704 - DCAA Member - Sandbox Company no 1',                         target: '/landing/airline-agent' },
  { id: 'other',    label: 'Select Other Agent Type',                                            target: '/other-agent-type' },
];

export default function CustomerTypePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>('trader');

  const select = (id: string, target: string) => {
    setSelected(id);
    setPersona(PERSONA_BY_ID[id] ?? 'other');
    setTimeout(() => navigate(target), 150);
  };

  const close = () => {
    setAuthenticated(false);
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-10 lg:px-[60px] py-12 bg-[#f8fafd]">
      <div className="bg-white w-full max-w-[1260px] rounded-lg overflow-hidden shadow-2xl" role="dialog" aria-label="Select Agent Profile">
        <div className="bg-[#0e1b3d] px-[16px] h-[62px] flex items-center justify-between">
          <h2 className="text-white font-bold text-[22px]">Select Agent Profile</h2>
          <button onClick={close} aria-label="Close" className="text-white hover:opacity-70">
            <svg viewBox="0 0 28 28" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="14" cy="14" r="12" /><path d="M10 10l8 8M18 10l-8 8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="px-6 sm:px-12 pt-[60px] pb-[64px]">
          <h3 className="text-[#0e1b3d] text-[24px] sm:text-[26px] font-medium text-center mb-[56px]">
            Hi User, Please select agent profile to access services
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[44px] max-w-[1040px] mx-auto place-items-center">
            {PROFILES.map(p => (
              <AgentCard key={p.id} label={p.label} selected={selected === p.id} onClick={() => select(p.id, p.target)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
