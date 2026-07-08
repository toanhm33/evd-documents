import type { PaginatedResponse } from '@/shared/types/api.common'
import type {
  BulkImportResult,
  Document,
  DocumentQueryParams,
} from '@/modules/evd/documents/types/document.types'
import type { DocumentFormValues } from '@/modules/evd/documents/schemas/document.schema'

const API_BASE = '/api'

function buildQuery(params: DocumentQueryParams = {}): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value))
    }
  })

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as
      | { message?: string }
      | null
    throw new Error(errorBody?.message ?? `Request failed (${response.status})`)
  }

  return response.json() as Promise<T>
}

export async function fetchDocuments(
  params: DocumentQueryParams = {},
): Promise<PaginatedResponse<Document>> {
  const response = await fetch(`${API_BASE}/documents${buildQuery(params)}`)
  return handleResponse<PaginatedResponse<Document>>(response)
}

export async function fetchDocument(id: string): Promise<Document> {
  const response = await fetch(`${API_BASE}/documents/${id}`)
  return handleResponse<Document>(response)
}

export async function createDocument(payload: DocumentFormValues): Promise<Document> {
  const response = await fetch(`${API_BASE}/documents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handleResponse<Document>(response)
}

export async function updateDocument(
  id: string,
  payload: Partial<DocumentFormValues>,
): Promise<Document> {
  const response = await fetch(`${API_BASE}/documents/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handleResponse<Document>(response)
}

export async function deleteDocument(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/documents/${id}`, {
    method: 'DELETE',
  })
  await handleResponse<{ success: boolean }>(response)
}

export async function bulkImportDocuments(
  rows: DocumentFormValues[],
): Promise<BulkImportResult> {
  const response = await fetch(`${API_BASE}/documents/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rows }),
  })
  return handleResponse<BulkImportResult>(response)
}
