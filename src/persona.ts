/* Tasreeh persona chosen on the customer-type popup.
   visitor          → Visitor
   visitor-company  → Visitor Company (the standard Tasreeh service flows)
   host-company     → Host Company (Gate Pass: All Requests + Pass Approvals) */
export type Persona = 'visitor' | 'visitor-company' | 'host-company' | 'other';

const KEY = 'dt-persona';

export function setPersona(p: Persona) {
  try { sessionStorage.setItem(KEY, p); } catch { /* ignore */ }
}

export function getPersona(): Persona {
  try { return (sessionStorage.getItem(KEY) as Persona) || 'visitor-company'; } catch { return 'visitor-company'; }
}
