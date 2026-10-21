import { useCallback, useMemo, useState } from 'react';
import ServiceListingPage from './ServiceListingPage';
import ServiceStartPage from './ServiceStartPage';
import ServiceFormPage from './ServiceFormPage';
import ServiceViewPage from './ServiceViewPage';
import GatePassSuccessPage, { GatePassDraftSavedPage } from '../gatepass/GatePassSuccessPage';
import { CancelRequestModal, Toast } from '../gatepass/GatePassModals';
import { emptyValues, type ServiceConfig, type ServiceRow, type FormValues } from './serviceTypes';

type Step =
  | { kind: 'listing'; drafts?: boolean }
  | { kind: 'start' }
  | { kind: 'form'; initial: FormValues; renewOf?: string }
  | { kind: 'success'; row: ServiceRow }
  | { kind: 'draftSaved'; row: ServiceRow }
  | { kind: 'view'; row: ServiceRow };

const fmt = (d: Date) => `${String(d.getDate()).padStart(2, '0')}-${d.toLocaleString('en-GB', { month: 'short' })}-${d.getFullYear()}`;
const today = () => fmt(new Date());
const inOneMonth = () => { const d = new Date(); d.setMonth(d.getMonth() + 1); return fmt(d); };

const CREATED = ['14-Feb-2024', '02-Feb-2024', '28-Jan-2024', '20-Jan-2024', '11-Jan-2024', '05-Jan-2024', '29-Dec-2023', '18-Dec-2023', '10-Dec-2023', '01-Dec-2023'];
const ROW_STATUS = ['Successful', 'Rejected', 'Under Review', 'Submitted', 'Successful', 'Rejected', 'Successful', 'Submitted', 'Under Review', 'Cancelled'];

/** Sample listing + drafts for a service (application numbers are unique per service). */
function sampleRows(cfg: ServiceConfig, seed: number) {
  const rows: ServiceRow[] = ROW_STATUS.map((status, i) => ({
    applicationNo: `12354${seed}6486${String(87 + i).padStart(2, '0')}`,
    createdOn: CREATED[i % CREATED.length], status, values: cfg.sample(i),
  }));
  const drafts: ServiceRow[] = [0, 1, 2].map(i => ({
    applicationNo: `12354${seed}6487${10 + i}`, createdOn: CREATED[(i + 3) % CREATED.length], status: 'Draft', values: cfg.sample(i + 4),
  }));
  return { rows, drafts };
}

/**
 * Generic Tasreeh service flow — same structure, layout and components as Gate Passes / Delegation Visits:
 * Listing → Create (start) → Form → Submit → Success → View Request; Save As Drafts → Draft Saved;
 * row actions View / Renew / Cancel Request.
 */
export default function ServiceFlow({ config: cfg, seed, onClose }: { config: ServiceConfig; seed: number; onClose: () => void }) {
  const initialData = useMemo(() => sampleRows(cfg, seed), [cfg, seed]);
  const [step, setStep] = useState<Step>({ kind: 'listing' });
  const [rows, setRows] = useState<ServiceRow[]>(initialData.rows);
  const [drafts, setDrafts] = useState<ServiceRow[]>(initialData.drafts);
  const [cancelRow, setCancelRow] = useState<ServiceRow | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const clearToast = useCallback(() => setToast(null), []);

  const toListing = (showDrafts = false) => setStep({ kind: 'listing', drafts: showDrafts });

  const submit = (values: FormValues) => {
    const row: ServiceRow = { applicationNo: `12354${seed}648${900 + rows.length}`, createdOn: today(), status: 'Under Review', values };
    setRows(prev => [row, ...prev]);
    setStep({ kind: 'success', row });
  };
  const saveDraft = (values: FormValues) => {
    const row: ServiceRow = { applicationNo: `12354${seed}648${700 + drafts.length}`, createdOn: today(), status: 'Draft', values };
    setDrafts(prev => [row, ...prev]);
    setStep({ kind: 'draftSaved', row });
  };
  const cancel = (row: ServiceRow) => {
    setRows(prev => prev.map(r => (r.applicationNo === row.applicationNo ? { ...r, status: 'Cancelled' } : r)));
    setToast(`Request ${row.applicationNo} cancelled`);
    setCancelRow(null);
    if (step.kind === 'view') setStep({ kind: 'view', row: { ...row, status: 'Cancelled' } });
  };

  const onAction = (a: string, row: ServiceRow) => {
    if (/cancel/i.test(a)) setCancelRow(row);
    else if (/renew/i.test(a)) setStep({ kind: 'form', initial: row.values, renewOf: row.applicationNo.slice(-6) });
    else setStep({ kind: 'view', row });
  };

  let page: JSX.Element;
  switch (step.kind) {
    case 'start':
      page = <ServiceStartPage config={cfg} onHome={onClose} onBackToListing={() => toListing()} onProceed={() => setStep({ kind: 'form', initial: emptyValues(cfg) })} />;
      break;
    case 'form':
      page = (
        <ServiceFormPage
          key={step.renewOf ?? 'new'}
          config={cfg}
          initial={step.initial}
          renewOf={step.renewOf}
          onHome={onClose}
          onBackToListing={() => toListing()}
          onSubmit={submit}
          onSaveDraft={saveDraft}
        />
      );
      break;
    case 'success': {
      const s = step;
      page = (
        <GatePassSuccessPage
          title={cfg.title}
          crumb={cfg.title}
          applicationNo={s.row.applicationNo}
          createdDate={s.row.createdOn}
          showPrint={false}
          onHome={onClose}
          onBackToListing={() => toListing()}
          onViewRequest={() => setStep({ kind: 'view', row: s.row })}
        />
      );
      break;
    }
    case 'draftSaved': {
      const s = step;
      page = (
        <GatePassDraftSavedPage
          title={cfg.title}
          crumb={cfg.title}
          backLabel="Back to Listing"
          draftNo={s.row.applicationNo}
          createdDate={s.row.createdOn}
          validTill={inOneMonth()}
          onHome={onClose}
          onBackToPasses={() => toListing()}
          onViewDrafts={() => toListing(true)}
          onEdit={() => setStep({ kind: 'form', initial: s.row.values })}
        />
      );
      break;
    }
    case 'view': {
      const s = step;
      page = <ServiceViewPage config={cfg} row={s.row} onHome={onClose} onBackToListing={() => toListing()} onCancelRequest={() => setCancelRow(s.row)} />;
      break;
    }
    default:
      page = (
        <ServiceListingPage
          key={step.drafts ? 'drafts' : 'list'}
          config={cfg}
          rows={rows}
          drafts={drafts}
          initialShowDrafts={step.drafts}
          onClose={onClose}
          onCreate={() => setStep({ kind: 'start' })}
          onAction={onAction}
          onOpenDraft={row => setStep({ kind: 'form', initial: row.values })}
        />
      );
  }

  return (
    <>
      {page}
      {cancelRow && (
        <CancelRequestModal
          appNo={cancelRow.applicationNo}
          subject={`${cfg.title.replace('Tasreeh - ', '')} request`}
          note="PCFC Security will be notified of the cancellation."
          onClose={() => setCancelRow(null)}
          onConfirm={() => cancel(cancelRow)}
        />
      )}
      {toast && <Toast message={toast} onDone={clearToast} />}
    </>
  );
}
