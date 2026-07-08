# EVD — File Management Module

Technical test project for **LOTTE x CMC Global** — React admin screen for document management (EVD module).

**Demo:** [https://evd-documents.vercel.app](https://evd-documents.vercel.app)

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- TanStack Query (server state)
- Zustand (auth / role simulation)
- MSW (mock API — runs in both dev and production)
- Zod + react-hook-form (validation)
- PapaParse (CSV parsing in Web Worker)
- SheetJS / xlsx (Excel parsing in Web Worker)
- TanStack Virtual (virtualized error list)

## Prerequisites

- Node.js 18+
- npm 9+

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

> On the first visit the page reloads once automatically — this is MSW registering its Service Worker.

## Demo roles

Use the role selector in the header:

| Role | Behavior |
|------|----------|
| **ADMIN** | See all documents, full CRUD + import |
| **STAFF** | See only own documents; Add / Delete / Import are hidden |

## Mock API (MSW)

Endpoints mocked at `/api/*`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/documents` | List with pagination, search, filter, `createdBy` |
| GET | `/api/documents/:id` | Get single document |
| POST | `/api/documents` | Create document |
| PUT | `/api/documents/:id` | Update document |
| DELETE | `/api/documents/:id` | Delete document |
| POST | `/api/documents/bulk` | Bulk import |

Seed data: **100 documents** in `src/modules/evd/documents/mocks/documents.data.ts`.

## Project structure

```
src/
├── app/                              # App shell
│   ├── App.tsx
│   ├── constants/auth.constants.ts
│   ├── layout/AppHeader.tsx
│   └── stores/authStore.ts           # Zustand — role state
│
├── shared/                           # Cross-module reusable code
│   ├── components/
│   │   ├── ui/                       # Primitive UI components
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── DropdownButton.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Pagination.tsx
│   │   │   └── Select.tsx
│   │   └── patterns/                 # Reusable feature patterns
│   │       ├── FileImportModal.tsx   # Generic CSV/Excel import modal
│   │       ├── ImportErrorList.tsx   # Virtualized error list
│   │       └── InlineEditRowShell.tsx
│   ├── constants/import.constants.ts
│   ├── hooks/
│   │   ├── useDebouncedValue.ts
│   │   ├── useEscapeKey.ts
│   │   ├── useImportWorker.ts        # Generic Web Worker hook
│   │   └── useInlineEdit.ts          # Headless inline-edit hook
│   ├── lib/utils.ts
│   ├── providers/QueryProvider.tsx
│   └── types/api.common.ts
│
├── modules/
│   └── evd/
│       └── documents/
│           ├── api/documents.api.ts
│           ├── components/
│           │   ├── DeleteConfirmDialog.tsx
│           │   ├── DisplayRow.tsx
│           │   ├── DocumentCsvFormatHint.tsx
│           │   ├── DocumentFormModal.tsx
│           │   ├── DocumentsTable.tsx
│           │   ├── DocumentsToolbar.tsx
│           │   ├── EditableRow.tsx
│           │   └── ImportModal.tsx
│           ├── constants/document.constants.ts
│           ├── hooks/
│           │   ├── useDocumentFilters.ts
│           │   ├── useDocumentMutations.ts
│           │   └── useDocuments.ts
│           ├── mocks/
│           │   ├── documents.data.ts
│           │   └── documents.handlers.ts
│           ├── pages/DocumentsPage.tsx
│           ├── schemas/document.schema.ts
│           ├── types/document.types.ts
│           ├── workers/
│           │   ├── import.worker.ts          # CSV parse + validate
│           │   └── import-excel.worker.ts    # Excel parse + validate
│           └── index.ts
│
├── mocks/browser.ts                  # MSW bootstrap
├── main.tsx
└── index.css
```

## Features implemented

| # | Feature | Notes |
|---|---------|-------|
| 1 | Document list table | Code, title, category, status, created by, date |
| 2 | Pagination + search + filter | Server-side, debounced search |
| 3 | Create / Edit modal | Zod validation, react-hook-form |
| 4 | Inline cell editing | Edit-in-place, dirty tracking, per-cell validation |
| 5 | Bulk import (CSV & Excel) | Web Worker, Zod validation, virtualized error list |
| 6 | Delete with confirmation | ConfirmDialog component |
| 7 | UI states | Loading skeleton, empty state, error state with retry |
| 8 | Permission-based UI | ADMIN vs STAFF role, filtered data |
| 9 | State management | TanStack Query + Zustand |
| ★ | Error Boundary | Root + module-level boundaries |
| ★ | Reusable shared components | `shared/components/ui` and `shared/components/patterns` |
| ★ | Vercel deployment | [evd-documents.vercel.app](https://evd-documents.vercel.app) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with MSW |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run oxlint |

## Import templates

| File | Description |
|------|-------------|
| `public/template-import.csv` | CSV template for bulk import |
| `public/template-import.xlsx` | Excel template for bulk import |
