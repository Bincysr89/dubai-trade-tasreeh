import { setPersona } from '../persona';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthenticated } from '../auth';
import { AgentProfilePanel, rememberAgentProfile } from '../components/AgentProfilePicker';

/* ──────────────────────────────────────────────────────────────
   After-login "Select Agent Profile" popup. Each agent profile
   keeps its Tasreeh persona flow:
   1298 Tasreeh → Visitor Company · Air Clearing Agent → Visitor Company ·
   DCAA Member → Host Company · Other Agent Type → Other
   ────────────────────────────────────────────────────────────── */
export default function CustomerTypePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>('trader');

  const close = () => {
    setAuthenticated(false);
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-10 lg:px-[60px] py-12 bg-[#f8fafd]">
      <AgentProfilePanel
        selected={selected}
        onClose={close}
        onPick={p => {
          setSelected(p.id);
          setPersona(p.persona);
          rememberAgentProfile(p.id);
          setTimeout(() => navigate(p.route), 150);
        }}
      />
    </div>
  );
}
