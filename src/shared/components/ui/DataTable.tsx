import React from 'react'
import { cn } from '@/shared/lib/utils'

export interface ColumnDef<T> {
  key: string
  header: string
  headerClassName?: string
  cell?: (row: T) => React.ReactNode
  cellClassName?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  rowKey: (row: T) => string
  children?: (row: T) => React.ReactNode
  emptyMessage?: string
  className?: string
}

export function DataTable<T>({
  data,
  columns,
  rowKey,
  children,
  emptyMessage = 'No data',
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="min-w-full text-left text-sm">
        <thead className="sticky top-0 z-10 bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground shadow-sm">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn('px-4 py-3 font-medium', col.headerClassName)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-sm text-muted-foreground"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : children ? (
            data.map((row) => (
              <React.Fragment key={rowKey(row)}>
                {children(row)}
              </React.Fragment>
            ))
          ) : (
            data.map((row) => (
              <tr key={rowKey(row)} className="border-t border-border hover:bg-muted/30">
                {columns.map((col) => (
                  <td key={col.key} className={cn('px-4 py-3', col.cellClassName)}>
                    {col.cell?.(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
