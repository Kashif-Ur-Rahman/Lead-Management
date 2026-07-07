# Lead Management (CRUD) — React.js

A complete Lead Management module built with React 18, React Router, and Vite.
Data persists in the browser's `localStorage`, so it survives page refreshes
without needing a backend.

## Setup

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

To build for production:
```bash
npm run build
npm run preview
```

## Project structure

```
src/
  utils/
    constants.js      -> single source of truth for all dropdown options + badge colors
    validation.js      -> ONE validation rules object, reused by every form (DRY)
    storage.js          -> localStorage read/write + derived-field calculations
  context/
    LeadContext.jsx     -> all CRUD logic lives here ONCE (add/update/delete/get/addCommunication)
  components/
    FormField.jsx        -> one input/select component used by every field (red border + error msg)
    LeadForm.jsx          -> ONE form used by both Add and Edit pages
    LeadFilters.jsx        -> filter bar + pure `applyFilters()` function
    LeadTable.jsx           -> sortable, paginated leads table
    CommunicationSection.jsx -> add-note form + notes table
    Badge.jsx                 -> colored pill for Priority/Status/Stage
  pages/
    LeadsListPage.jsx  -> "/"              (list + filters + export)
    AddLeadPage.jsx    -> "/leads/new"     (create)
    LeadDetailsPage.jsx-> "/leads/:id"     (view + edit icon + communication)
    EditLeadPage.jsx   -> "/leads/:id/edit"(update, pre-populated)
```

## How each requirement is satisfied

1. **Create/View/Update/Delete** — `LeadContext.jsx` exposes `addLead`,
   `getLeadById`, `updateLead`, `deleteLead`. Delete is available as the 🗑
   icon on each table row (with a confirm dialog).
2. **Add Lead form saves + shows in list** — `AddLeadPage` calls `addLead()`
   then navigates back to `/`, where the new row is immediately visible
   (state lives in Context, not local component state).
3. **All filters work** — `LeadFilters.jsx` + the pure `applyFilters()`
   function filter by Lead Status, Priority, Service Type, Follow-up Status,
   Specialty, State, Lead Source, Stage, and free-text search — all
   combinable at once.
4. **Field validation by data type/business rule** — `utils/validation.js`
   defines one rule per field (required checks, email regex, phone digit
   count, positive numeric collection amount, required dropdowns/dates).
5. **Invalid submit blocked + red highlight + message** — `LeadForm`'s
   `handleSubmit` runs `validate()` and returns early if any errors exist;
   `FormField.jsx` adds the `field-control--error` red-border class and
   renders the message whenever an error is passed in — this logic exists
   in exactly one place, so every field on every form behaves identically.
6. **Edit icon on Lead Details page** — top-right "✎ Edit" button on
   `LeadDetailsPage.jsx`, routes to `/leads/:id/edit`.
7. **Edit mode pre-populated** — `EditLeadPage` fetches the lead by id and
   passes it as `initialValues` into the same `LeadForm` used for Add.
8. **Save changes successfully** — `updateLead()` merges the new values into
   the lead in Context/localStorage, then navigates back to the details page.
9. **Communication section** — `CommunicationSection.jsx`, rendered on
   `LeadDetailsPage`.
10. **Add + save communication notes** — form with Type (select) + Note
    (textarea), validated the same way as the main form, calls
    `addCommunication(leadId, note)`.
11. **Notes table updates immediately** — `addCommunication` prepends the
    new note to the lead's `communications` array in Context state, so the
    table (which reads directly from Context) re-renders instantly with the
    newest note on top — no reload needed.

## Notes on data model (matches the reference excel Screenshot)

Lead ID, Practice Name, Contact Person, Specialty, State, Platform, Lead
Source, Avg Collection, Sales Rep, Priority, Lead Status, Service Type,
Created Date, Last Activity Date, Next Follow-up Date, Days Since Activity,
Follow-up Status, Aging Bucket, Stage — plus Email/Phone (added since the
task requires type-specific validation, e.g. email format, which the
screenshot's columns don't otherwise exercise).

`Days Since Activity`, `Aging Bucket`, and `Follow-up Status` are **derived**
values (computed from dates in `storage.js`) rather than editable fields, so
they can never disagree with the dates they're based on.

## Swapping localStorage for a real API later

All persistence calls are isolated in `src/utils/storage.js` and
`src/context/LeadContext.jsx`. To connect a real backend, replace the bodies
of `loadLeads`/`saveLeads` (and the CRUD functions in `LeadContext`) with
`fetch()`/`axios` calls — no component code needs to change.
