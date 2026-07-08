export const DOCUMENT_CATEGORIES = [
  'CONTRACT',
  'INVOICE',
  'REPORT',
  'POLICY',
  'OTHER',
] as const

export const DOCUMENT_STATUSES = ['ACTIVE', 'INACTIVE', 'DRAFT'] as const

export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number]
export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number]

export const DOCUMENTS_QUERY_KEY = 'documents'

export const DEFAULT_PAGE_SIZE = 20

export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const


export const DEFAULT_DOCUMENT_FORM_VALUES = {
  code: '',
  title: '',
  category: DOCUMENT_CATEGORIES[0],
  status: DOCUMENT_STATUSES[2],
}

export const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  CONTRACT: 'Contract',
  INVOICE: 'Invoice',
  REPORT: 'Report',
  POLICY: 'Policy',
  OTHER: 'Other',
}

export const STATUS_LABELS: Record<DocumentStatus, string> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  DRAFT: 'Draft',
}
