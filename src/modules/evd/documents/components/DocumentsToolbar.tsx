import { FileSpreadsheet, FileText, Search, Upload, X } from 'lucide-react'
import { Input } from '@/shared/components/ui/Input'
import { Select } from '@/shared/components/ui/Select'
import { Button } from '@/shared/components/ui/Button'
import { DropdownButton } from '@/shared/components/ui/DropdownButton'
import {
  CATEGORY_LABELS,
  DOCUMENT_CATEGORIES,
  DOCUMENT_STATUSES,
  STATUS_LABELS,
} from '@/modules/evd/documents/constants/document.constants'
import type {
  DocumentCategory,
  DocumentStatus,
} from '@/modules/evd/documents/constants/document.constants'

interface DocumentsToolbarProps {
  search: string
  status: DocumentStatus | ''
  category: DocumentCategory | ''
  hasActiveFilters: boolean
  canImport: boolean
  onSearchChange: (value: string) => void
  onStatusChange: (value: DocumentStatus | '') => void
  onCategoryChange: (value: DocumentCategory | '') => void
  onResetFilters: () => void
  onImportCsv: () => void
  onImportExcel: () => void
}

export function DocumentsToolbar({
  search,
  status,
  category,
  hasActiveFilters,
  canImport,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
  onResetFilters,
  onImportCsv,
  onImportExcel,
}: DocumentsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by code or title..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="pl-9 max-w-lg"
            aria-label="Search documents"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-auto lg:grid-cols-3">
          <Select
            aria-label="Filter by status"
            value={status}
            onChange={(event) => onStatusChange(event.target.value as DocumentStatus | '')}
          >
            <option value="">All statuses</option>
            {DOCUMENT_STATUSES.map((item) => (
              <option key={item} value={item}>
                {STATUS_LABELS[item]}
              </option>
            ))}
          </Select>

          <Select
            aria-label="Filter by category"
            value={category}
            onChange={(event) => onCategoryChange(event.target.value as DocumentCategory | '')}
          >
            <option value="">All categories</option>
            {DOCUMENT_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {CATEGORY_LABELS[item]}
              </option>
            ))}
          </Select>

          {canImport && (
            <DropdownButton
              label="Import"
              icon={<Upload className="h-4 w-4" />}
              items={[
                {
                  key: 'csv',
                  label: 'Import CSV',
                  icon: <FileText className="h-4 w-4" />,
                  onClick: onImportCsv,
                },
                {
                  key: 'excel',
                  label: 'Import Excel',
                  icon: <FileSpreadsheet className="h-4 w-4" />,
                  onClick: onImportExcel,
                },
              ]}
            />
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">Filters active</p>
          <Button variant="ghost" size="sm" onClick={onResetFilters}>
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
