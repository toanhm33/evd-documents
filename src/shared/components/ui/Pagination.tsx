import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Select } from '@/shared/components/ui/Select'
import { cn } from '@/shared/lib/utils'

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50] as const

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  pageSizeOptions?: readonly number[]
  itemLabel?: string
  className?: string
}

function getPageRange(page: number, pageSize: number, total: number) {
  if (total === 0) return { from: 0, to: 0 }
  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)
  return { from, to }
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  itemLabel = 'results',
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const { from, to } = getPageRange(page, pageSize, total)
  const canGoPrev = page > 1
  const canGoNext = page < totalPages

  return (
    <div
      className={cn(
        'flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <p className="text-sm text-muted-foreground">
        {total === 0 ? (
          'No results'
        ) : (
          <>
            Showing <span className="font-medium text-zinc-900">{from}</span>–
            <span className="font-medium text-zinc-900">{to}</span> of{' '}
            <span className="font-medium text-zinc-900">{total}</span> {itemLabel}
          </>
        )}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="hidden sm:inline">Rows per page</span>
          <Select
            aria-label="Rows per page"
            value={String(pageSize)}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="w-20"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            aria-label="Previous page"
            disabled={!canGoPrev}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-24 px-2 text-center text-sm text-muted-foreground">
            Page {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            aria-label="Next page"
            disabled={!canGoNext}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
