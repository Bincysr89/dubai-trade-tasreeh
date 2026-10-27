import { getPersona } from '../persona';
import { useState } from 'react';
import Header from './Header';
import supplierIconSrc from '../assets/icon-supplier.svg';
import catalogueBg from '../assets/catalogue background.jpg';
import GatePassFlow from './gatepass/GatePassFlow';
import DelegationFlow from './delegation/DelegationFlow';
import ServiceFlow from './tasreeh/ServiceFlow';
import { SERVICE_REGISTRY } from './tasreeh/serviceConfigs';
import { TASREEH_SERVICES } from './gatepass/gatePassData';

type Props = { onClose: () => void };

/* Service columns (Figma 1:6268) — Gate Management carries the Tasreeh services first. */
const SUPPLIER_COLUMNS: { title: string; items: string[] }[] = [
  {
    title: 'Registration',
    items: [
      'AEO Program', 'Client Accreditation', 'DC - Manage Services',
      'Case Registration', 'Register shipping line', 'Shipping Line Master',
    ],
  },
  {
    title: 'Carrier Management',
    items: [
      'DPA - Pre-qualification', 'DPA - PAN,PDN,PC', 'DPA - NOC Certificates', 'DPA - ePermit',
      'DPA - License Activity Approval', 'DPA - Operating Permit', 'DPA - Bunker Vehicle Permit',
      'DPA - Bunker Vessel Permit', 'DPA - Container Inspection', 'DMA- Provider Registration',
      'DMA- NOC Certificates', 'DMA - Operation Permits',
      'DMA- Vessel Anchorage Permit in the Emirates water', 'PCFC- Payments',
      'Vessel Line Change', 'Vessel Registration Request', 'Water Reading',
    ],
  },
  {
    title: 'Cargo Management',
    items: [
      'Bill of Lading', 'Container Request', 'DDO', 'Discharge /Load List', 'DNOC', 'Export Manifest',
      'Manage DDO/DNOC', 'Manifest', 'NOC Linking', 'Trade +', 'Voyage', 'Voyage NOC',
      'CT Miscellaneous Services', 'Agent Event Notification', 'Container Cleaning',
      'Container Enquiry', 'Container Hold/Release', 'Container Line Change',
    ],
  },
  {
    title: 'Integrated Clearance',
    items: [
      'DC - landing Certificate', 'DC - Letter & Certificates', 'DM Permits', 'DP World Work Permits',
      'e-Certificates', 'IMDG NOC Management', 'Marine NOC', 'Master Declaration',
      'DC - Cargo Reconcilation', 'DC - Cargo Tracking', 'DC - Export Manifest',
      'DC - Inspection Services', 'DC - Smart Workspace', 'Declaration Services',
      'Digital Certificate', 'Cargo Transfer Services', 'M1- Bill Clearance',
    ],
  },
  {
    title: 'Gate Management',
    items: [...TASREEH_SERVICES, 'VGM Certificate', 'Visitor Gate Pass - PCFC'],
  },
  {
    title: 'Payments',
    items: [
      'Advance Deposit', 'Claim Services', 'Centralized Payments', 'DC - Account Services',
      'DP World Payments', 'e-Payment', 'Invoice Payment', 'Prepaid Card', 'Refund Services',
      'Deposit Refund', 'TLUC Payment',
    ],
  },
  {
    title: 'Reports',
    items: [
      'Container Reports', 'Declaration Statement', 'Discharge Load Operations',
      'M1- Bill Clearance', 'Vessel reports',
    ],
  },
];

/* Services that open a working flow */
const ALL_LIVE = ['Tasreeh - Gate Passes', 'Tasreeh - Delegation Visits', ...Object.keys(SERVICE_REGISTRY)];
/* Individual (UAE PASS basic account) only gets the free Gate Pass service */
const liveServices = () => new Set(getPersona() === 'individual' ? ['Tasreeh - Gate Passes'] : ALL_LIVE);
const TASREEH = new Set(TASREEH_SERVICES);

export default function SupplierDetailModal({ onClose }: Props) {
  const [LIVE] = useState(liveServices);
  const [individual] = useState(() => getPersona() === 'individual');
  const [search, setSearch] = useState('');
  const [service, setService] = useState<string | null>(null);

  if (service === 'Tasreeh - Gate Passes') {
    return <GatePassFlow onClose={() => setService(null)} />;
  }
  if (service === 'Tasreeh - Delegation Visits') {
    return <DelegationFlow onClose={() => setService(null)} />;
  }
  if (service && SERVICE_REGISTRY[service]) {
    const { config, seed } = SERVICE_REGISTRY[service];
    return <ServiceFlow key={config.key} config={config} seed={seed} onClose={() => setService(null)} />;
  }

  const filtered = SUPPLIER_COLUMNS.map(col => ({
    ...col,
    items: search ? col.items.filter(i => i.toLowerCase().includes(search.toLowerCase())) : col.items,
  })).filter(col => !search || col.items.length > 0);

  const NavArrow = ({ dir }: { dir: 'left' | 'right' }) => (
    <div className="size-[40px] rounded-full flex items-center justify-center text-white flex-shrink-0"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(2px)' }}>
      <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d={dir === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
      </svg>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden">
      {/* Full-page catalogue background image */}
      <div className="absolute inset-0"
        style={{ backgroundImage: `url(${catalogueBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />

      <div className="relative z-10 flex-shrink-0">
        <Header onServiceCatalogue={onClose} />
      </div>

      <button onClick={onClose} aria-label="Close"
        className="absolute right-[16px] top-[96px] z-20 size-[36px] flex items-center justify-center text-[#0e1b3d] hover:opacity-60 transition-opacity">
        <svg viewBox="0 0 24 24" className="size-[24px]" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="relative z-10 flex-shrink-0 h-[60px]" />

      {/* Sub-nav + title area */}
      <div className="relative z-10 flex-shrink-0">
        <div className="relative flex items-center justify-center px-10 py-5">
          <a className="absolute left-10 hidden sm:flex items-center gap-3 cursor-pointer hover:opacity-80" onClick={onClose}>
            <NavArrow dir="left" />
            <span className="text-[#0a1852] text-[20px] uppercase tracking-wider" style={{ fontFamily: "'Dubai', sans-serif" }}>Air</span>
          </a>

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-3">
              <div className="bg-[#0e1b3d] border border-white flex items-center justify-center flex-shrink-0 rounded-[10px]"
                style={{ width: 40, height: 40, padding: 4 }}>
                <img src={supplierIconSrc} alt="Supplier" style={{ width: 22, height: 30 }} />
              </div>
              <span className="text-[#0a1852] text-[24px] uppercase font-bold" style={{ fontFamily: "'Dubai', sans-serif" }}>
                Supplier
              </span>
            </div>
            <p className="text-[#060c28] text-[20px] text-center mt-1"
              style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 400, letterSpacing: '0.2px' }}>
              Explore extensive services offered for all of modes.
            </p>
          </div>

          <a className="absolute right-10 hidden sm:flex items-center gap-3 cursor-pointer hover:opacity-80" onClick={onClose}>
            <span className="text-[#0a1852] text-[20px] uppercase tracking-wider" style={{ fontFamily: "'Dubai', sans-serif" }}>Sea</span>
            <NavArrow dir="right" />
          </a>
        </div>

        {/* Search bar */}
        <div className="flex justify-center pb-5 px-4">
          <div className="relative w-full sm:w-[440px]">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Services"
              className="w-full h-[48px] border border-[#d0d5e8] rounded-[8px] pl-4 pr-12 text-[16px] text-[#0e1b3d] placeholder-[#8f94ae] bg-white focus:outline-none focus:border-[#0e1b3d]"
              style={{ fontFamily: "'Dubai', sans-serif" }} />
            <svg viewBox="0 0 18 18" width="20" height="20" className="absolute right-4 top-1/2 -translate-y-1/2" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D" />
            </svg>
          </div>
        </div>
      </div>

      {/* Service columns — whole card scrolls */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-10 lg:px-[60px] pt-6 pb-6">
        <div className="rounded-[14px] p-[3px]"
          style={{ background: 'linear-gradient(135deg, rgba(19,96,210,1) 0%, rgba(255,255,255,1) 50%, rgba(232,44,42,1) 100%)' }}>
          <div className="bg-white rounded-[12px] overflow-x-auto" style={{ boxShadow: '0 4px 15.5px rgba(0,0,0,0.08)' }}>
            <div className="flex divide-x divide-[#e8eaf0] w-full">
              {filtered.map(col => (
                <div key={col.title} className="flex-1 flex flex-col px-3 pt-6 pb-4" style={{ minWidth: 150 }}>
                  <div className="mb-5">
                    <p className="text-[#0e1b3d] text-[16px] font-medium leading-6 whitespace-nowrap"
                      style={{ fontFamily: "'Dubai', sans-serif", letterSpacing: '0.18px' }}>
                      {col.title}
                    </p>
                    <div className="w-6 h-[2px] bg-[#e8212e] mt-1" />
                  </div>
                  <div className="flex flex-col gap-[8px]">
                    {col.items.map(item => {
                      const live = LIVE.has(item);
                      const tasreeh = !individual && TASREEH.has(item);
                      return (
                        <button
                          key={item}
                          onClick={live ? () => setService(item) : undefined}
                          className={`text-left px-[10px] rounded-[4px] text-[16px] transition-colors ${
                            live
                              ? 'bg-[#dce9ff] border border-[#1360d2] text-[#1360d2] hover:bg-[#c5d9ff] font-medium'
                              : tasreeh
                                ? 'bg-[#eef1fc] border border-[#c7d0f2] text-[#3a4a86] hover:bg-[#e2e7fb] font-medium'
                                : 'bg-[#f7faff] text-[#0e1b3d] hover:bg-[#d6e6ff]'
                          }`}
                          style={{
                            fontFamily: "'Dubai', sans-serif", letterSpacing: '0.14px', lineHeight: '24px',
                            cursor: live ? 'pointer' : 'default', minHeight: 40, display: 'flex', alignItems: 'center',
                          }}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
