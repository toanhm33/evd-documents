import type { DocumentCategory, DocumentStatus } from '@/modules/evd/documents/constants/document.constants'

export interface Document {
  id: string
  code: string
  title: string
  category: DocumentCategory
  status: DocumentStatus
  createdBy: string
  createdByName: string
  createdAt: string
  updatedAt: string
}

export interface PaginatedDocuments {
  data: Document[]
  total: number
  page: number
  pageSize: number
}

export interface DocumentQueryParams {
  page?: number
  pageSize?: number
  search?: string
  status?: DocumentStatus | ''
  category?: DocumentCategory | ''
  createdBy?: string
}

export interface BulkImportError {
  row: number
  field: string
  message: string
}

export interface BulkImportResult {
  imported: number
  failed: number
  errors: BulkImportError[]
}
