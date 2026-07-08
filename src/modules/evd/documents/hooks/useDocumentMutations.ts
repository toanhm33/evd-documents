import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  bulkImportDocuments,
  createDocument,
  deleteDocument,
  updateDocument,
} from '@/modules/evd/documents/api/documents.api'
import { DOCUMENTS_QUERY_KEY } from '@/modules/evd/documents/constants/document.constants'
import type { DocumentFormValues } from '@/modules/evd/documents/schemas/document.schema'

function useInvalidateDocuments() {
  const qc = useQueryClient()
  return () => qc.invalidateQueries({ queryKey: [DOCUMENTS_QUERY_KEY] })
}

export function useCreateDocument() {
  const invalidate = useInvalidateDocuments()
  return useMutation({
    mutationFn: (payload: DocumentFormValues) => createDocument(payload),
    onSuccess: invalidate,
  })
}

export function useUpdateDocument() {
  const invalidate = useInvalidateDocuments()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<DocumentFormValues> }) =>
      updateDocument(id, payload),
    onSuccess: invalidate,
  })
}

export function useDeleteDocument() {
  const invalidate = useInvalidateDocuments()
  return useMutation({
    mutationFn: (id: string) => deleteDocument(id),
    onSuccess: invalidate,
  })
}

export function useBulkImport() {
  const invalidate = useInvalidateDocuments()
  return useMutation({
    mutationFn: (rows: DocumentFormValues[]) => bulkImportDocuments(rows),
    onSuccess: invalidate,
  })
}
