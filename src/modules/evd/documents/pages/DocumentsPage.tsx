import { AlertCircle, Loader2, Plus } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Button } from '@/shared/components/ui/Button'
import { useAuthStore } from '@/app/stores/authStore'
import { DeleteConfirmDialog } from '@/modules/evd/documents/components/DeleteConfirmDialog'
import { DocumentFormModal } from '@/modules/evd/documents/components/DocumentFormModal'
import { DocumentsTable } from '@/modules/evd/documents/components/DocumentsTable'
import { DocumentsToolbar } from '@/modules/evd/documents/components/DocumentsToolbar'
import { ImportModal } from '@/modules/evd/documents/components/ImportModal'
import { Pagination } from '@/shared/components/ui/Pagination'
import { useDocumentFilters } from '@/modules/evd/documents/hooks/useDocumentFilters'
import { PAGE_SIZE_OPTIONS } from '@/modules/evd/documents/constants/document.constants'
import { useDocumentsQuery } from '@/modules/evd/documents/hooks/useDocuments'
import type { Document } from '@/modules/evd/documents/types/document.types'

export function DocumentsPage() {
  const isStaff = useAuthStore((state) => state.isStaff())
  const user = useAuthStore((state) => state.user)

  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Document | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Document | null>(null)
  const [importCsvOpen, setImportCsvOpen] = useState(false)
  const [importExcelOpen, setImportExcelOpen] = useState(false)

  const {
    filters,
    debouncedSearch,
    setPage,
    setPageSize,
    setSearch,
    setStatus,
    setCategory,
    resetFilters,
    hasActiveFilters,
  } = useDocumentFilters()

  const { data, isLoading, isFetching, isError, error, refetch } = useDocumentsQuery({
    page: filters.page,
    pageSize: filters.pageSize,
    search: debouncedSearch,
    status: filters.status,
    category: filters.category,
  })

  const handleOpenCreate = () => {
    setEditTarget(null)
    setFormOpen(true)
  }

  const handleCloseForm = useCallback(() => {
    setFormOpen(false)
    setEditTarget(null)
  }, [])


  const handleCloseDelete = useCallback(() => {
    setDeleteTarget(null)
  }, [])

  const handleOpenImportCsv = () => setImportCsvOpen(true)
  const handleCloseImportCsv = useCallback(() => setImportCsvOpen(false), [])

  const handleOpenImportExcel = () => setImportExcelOpen(true)
  const handleCloseImportExcel = useCallback(() => setImportExcelOpen(false), [])

  const showInitialLoading = isLoading
  const showTable = !isLoading && !isError && data
  const isEmpty = showTable && data.total === 0

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <section className="mb-6 rounded-xl border border-border bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">Document List</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage, search and import documents for your organization.
            </p>
          </div>
          {!isStaff && (
            <Button onClick={handleOpenCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Document
            </Button>
          )}
        </div>

        {isStaff && (
          <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            STAFF mode: showing only documents created by <strong>{user.name}</strong>. Delete is disabled.
          </p>
        )}
      </section>

      {showInitialLoading && (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-white py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading data...</span>
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-destructive" />
            <div className="flex-1">
              <h3 className="font-medium text-red-900">Failed to load data</h3>
              <p className="mt-1 text-sm text-red-700">
                {error instanceof Error ? error.message : 'An unknown error occurred'}
              </p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          </div>
        </div>
      )}

      {showTable && (
        <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <DocumentsToolbar
            search={filters.search}
            status={filters.status}
            category={filters.category}
            hasActiveFilters={hasActiveFilters}
            canImport={!isStaff}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            onCategoryChange={setCategory}
            onResetFilters={resetFilters}
            onImportCsv={handleOpenImportCsv}
            onImportExcel={handleOpenImportExcel}
          />

          {isFetching && !isLoading && (
            <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-5 py-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Updating...</span>
            </div>
          )}

          {isEmpty ? (
            <div className="py-16 text-center">
              <p className="text-lg font-medium text-zinc-900">No documents found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {hasActiveFilters
                  ? 'No results match your filters. Try adjusting the filters or search keyword.'
                  : 'No data yet. Click "Add Document" to get started.'}
              </p>
              {hasActiveFilters ? (
                <Button variant="outline" size="sm" className="mt-4" onClick={resetFilters}>
                  Clear Filters
                </Button>
              ) : (
                <Button size="sm" className="mt-4" onClick={handleOpenCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Document
                </Button>
              )}
            </div>
          ) : (
            <>
              <DocumentsTable
                documents={data.data}
                canDelete={!isStaff}
                onDelete={setDeleteTarget}
              />
              <Pagination
                page={data.page}
                pageSize={data.pageSize}
                total={data.total}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                itemLabel="documents"
              />
            </>
          )}
        </section>
      )}

      <DocumentFormModal
        open={formOpen}
        editTarget={editTarget}
        onClose={handleCloseForm}
      />

      <DeleteConfirmDialog
        target={deleteTarget}
        onClose={handleCloseDelete}
      />

      <ImportModal open={importCsvOpen} onClose={handleCloseImportCsv} />
      <ImportModal open={importExcelOpen} onClose={handleCloseImportExcel} type="excel" />
    </main>
  )
}
