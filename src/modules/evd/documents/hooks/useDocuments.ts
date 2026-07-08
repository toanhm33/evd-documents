import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchDocuments } from '@/modules/evd/documents/api/documents.api'
import { DOCUMENTS_QUERY_KEY } from '@/modules/evd/documents/constants/document.constants'
import type { Document, DocumentQueryParams, PaginatedDocuments } from '@/modules/evd/documents/types/document.types'
import { useAuthStore } from '@/app/stores/authStore'

function mergeDocumentRefs(
  oldData: PaginatedDocuments | undefined,
  newData: PaginatedDocuments,
): PaginatedDocuments {
  if (!oldData) return newData
  const oldMap = new Map<string, Document>(oldData.data.map((d) => [d.id, d]))
  const merged = newData.data.map((doc) => {
    const old = oldMap.get(doc.id)
    return old && old.updatedAt === doc.updatedAt ? old : doc
  })
  return { ...newData, data: merged }
}

export function useDocumentsQuery(params: DocumentQueryParams = {}) {
  const user = useAuthStore((state) => state.user)
  const isStaff = useAuthStore((state) => state.isStaff())

  const queryParams: DocumentQueryParams = {
    page: 1,
    pageSize: 20,
    ...params,
    ...(isStaff ? { createdBy: user.id } : {}),
  }

  return useQuery({
    queryKey: [DOCUMENTS_QUERY_KEY, queryParams],
    queryFn: () => fetchDocuments(queryParams),
    placeholderData: keepPreviousData,
    structuralSharing: (oldData, newData) =>
      mergeDocumentRefs(
        oldData as PaginatedDocuments | undefined,
        newData as PaginatedDocuments,
      ),
  })
}
