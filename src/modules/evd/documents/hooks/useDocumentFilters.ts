import { useCallback, useState } from 'react'
import type {
  DocumentCategory,
  DocumentStatus,
} from '@/modules/evd/documents/constants/document.constants'
import { DEFAULT_PAGE_SIZE } from '@/modules/evd/documents/constants/document.constants'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'

export interface DocumentFilters {
  page: number
  pageSize: number
  search: string
  status: DocumentStatus | ''
  category: DocumentCategory | ''
}

const INITIAL_FILTERS: DocumentFilters = {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  search: '',
  status: '',
  category: '',
}

export function useDocumentFilters() {
  const [filters, setFilters] = useState<DocumentFilters>(INITIAL_FILTERS)
  const debouncedSearch = useDebouncedValue(filters.search, 300)

  const setPage = useCallback((page: number) => {
    setFilters((current) => ({ ...current, page }))
  }, [])

  const setPageSize = useCallback((pageSize: number) => {
    setFilters((current) => ({ ...current, pageSize, page: 1 }))
  }, [])

  const setSearch = useCallback((search: string) => {
    setFilters((current) => ({ ...current, search, page: 1 }))
  }, [])

  const setStatus = useCallback((status: DocumentStatus | '') => {
    setFilters((current) => ({ ...current, status, page: 1 }))
  }, [])

  const setCategory = useCallback((category: DocumentCategory | '') => {
    setFilters((current) => ({ ...current, category, page: 1 }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS)
  }, [])

  const hasActiveFilters =
    filters.search !== '' || filters.status !== '' || filters.category !== ''

  return {
    filters,
    debouncedSearch,
    setPage,
    setPageSize,
    setSearch,
    setStatus,
    setCategory,
    resetFilters,
    hasActiveFilters,
  }
}
