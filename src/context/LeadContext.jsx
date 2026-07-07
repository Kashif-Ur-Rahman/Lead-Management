import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { loadLeads, saveLeads, generateNextLeadId, todayISO, withDerivedFields } from '../utils/storage';

const LeadContext = createContext(null);

export function LeadProvider({ children }) {
  const [leads, setLeads] = useState(() => loadLeads());

  // Persist to localStorage any time the underlying data changes.
  const persist = useCallback((next) => {
    setLeads(next);
    saveLeads(next);
  }, []);

  const addLead = useCallback(
    (formValues) => {
      const newLead = {
        ...formValues,
        id: generateNextLeadId(leads),
        createdDate: todayISO(),
        lastActivityDate: todayISO(),
        communications: [],
      };
      persist([newLead, ...leads]);
      return newLead;
    },
    [leads, persist]
  );

  const updateLead = useCallback(
    (id, formValues) => {
      const next = leads.map((l) => (l.id === id ? { ...l, ...formValues } : l));
      persist(next);
    },
    [leads, persist]
  );

  const deleteLead = useCallback(
    (id) => {
      persist(leads.filter((l) => l.id !== id));
    },
    [leads, persist]
  );

  const addCommunication = useCallback(
    (leadId, communication) => {
      const next = leads.map((l) => {
        if (l.id !== leadId) return l;
        const newComm = {
          ...communication,
          id: `C-${Date.now()}`,
          date: todayISO(),
        };
        return {
          ...l,
          lastActivityDate: todayISO(),
          communications: [newComm, ...(l.communications || [])],
        };
      });
      persist(next);
    },
    [leads, persist]
  );

  // Derived fields (aging bucket, days since activity, follow-up status)
  // are computed fresh every render so they can never go stale.
  const leadsWithDerived = useMemo(() => leads.map(withDerivedFields), [leads]);

  const getLeadById = useCallback((id) => leadsWithDerived.find((l) => l.id === id), [leadsWithDerived]);

  const value = useMemo(
    () => ({
      leads: leadsWithDerived,
      addLead,
      updateLead,
      deleteLead,
      getLeadById,
      addCommunication,
    }),
    [leadsWithDerived, addLead, updateLead, deleteLead, getLeadById, addCommunication]
  );

  return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>;
}

export function useLeads() {
  const ctx = useContext(LeadContext);
  if (!ctx) throw new Error('useLeads must be used within a LeadProvider');
  return ctx;
}
