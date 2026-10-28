import { setPersona } from '../persona';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthenticated } from '../auth';
import { AgentProfilePanel, SimulateFlowPanel, rememberAgentProfile, AGENT_PROFILES, type AgentProfile } from '../components/AgentProfilePicker';

/* ──────────────────────────────────────────────────────────────
   After-login "Select Agent Profile" popup. Each agent profile
   keeps its Tasreeh persona flow:
   1298 Tasreeh → simulate Visitor / Host Company · Air Clearing Agent → Visitor Company ·
   DCAA Member → Host Company · Other Agent Type → Other
   ────────────────────────────────────────────────────────────── */
export default function CustomerTypePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>('trader');
  /* 1298 - Tasreeh asks which Tasreeh flow to simulate first */
  const [simulating, setSimulating] = useState<AgentProfile | null>(null);
  const [simPick, setSimPick] = useState('');
  const go = (persona: AgentProfile['persona'], route: string, profileId: string) => {
    setPersona(persona);
    rememberAgentProfile(profileId);
    setTimeout(() => navigate(route), 150);
  };

  const close = () => {
    setAuthenticated(false);
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-10 lg:px-[60px] py-12 bg-[#f8fafd]">
      {simulating ? (
        <SimulateFlowPanel
          profile={simulating}
          selected={simPick}
          onClose={() => setSimulating(null)}
          onPick={f => { setSimPick(f.id); go(f.persona, f.route, simulating.id); }}
        />
      ) : (
        <AgentProfilePanel
          selected={selected}
          onClose={close}
          onPick={p => {
            setSelected(p.id);
            if (p.simulate) setTimeout(() => setSimulating(AGENT_PROFILES.find(x => x.id === p.id)!), 150);
            else go(p.persona, p.route, p.id);
          }}
        />
      )}
    </div>
  );
}
