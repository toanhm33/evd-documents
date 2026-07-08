import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

export interface ImportError {
  rowNumber: number
  errors: string[]
}

interface ImportErrorListProps {
  errors: ImportError[]
}

const ROW_HEIGHT = 56

export function ImportErrorList({ errors }: ImportErrorListProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: errors.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
  })

  return (
    <div
      ref={containerRef}
      className="max-h-48 overflow-y-auto rounded-md border border-red-200 bg-red-50"
    >
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const item = errors[virtualRow.index]
          return (
            <div
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: virtualRow.start,
                left: 0,
                right: 0,
                height: virtualRow.size,
              }}
              className="flex items-start gap-3 border-b border-red-100 px-3 py-2 last:border-0"
            >
              <span className="mt-0.5 shrink-0 rounded bg-red-200 px-1.5 py-0.5 text-xs font-mono font-semibold text-red-800">
                Row {item.rowNumber}
              </span>
              <div className="min-w-0 flex-1">
                {item.errors.map((err, i) => (
                  <p key={i} className="truncate text-xs text-red-700">
                    {err}
                  </p>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
