import { memo } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/shared/components/ui/Badge'
import { Button } from '@/shared/components/ui/Button'
import type { Document } from '@/modules/evd/documents/types/document.types'
import {
  CATEGORY_LABELS,
  STATUS_LABELS,
  type DocumentStatus,
} from '@/modules/evd/documents/constants/document.constants'
import { formatDate } from '@/shared/lib/utils'

function getStatusVariant(status: DocumentStatus) {
  switch (status) {
    case 'ACTIVE': return 'active'
    case 'INACTIVE': return 'inactive'
    case 'DRAFT': return 'draft'
    default: return 'default'
  }
}

interface DisplayRowProps {
  document: Document
  canDelete: boolean
  onEdit: (id: string) => void
  onDelete: (document: Document) => void
}

export const DisplayRow = memo(function DisplayRow({
  document,
  canDelete,
  onEdit,
  onDelete,
}: DisplayRowProps) {
  return (
    <tr className="border-t border-border hover:bg-muted/30">
      <td className="px-4 py-3 font-medium whitespace-nowrap">{document.code}</td>
      <td className="max-w-xs truncate px-4 py-3" title={document.title}>
        {document.title}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        {CATEGORY_LABELS[document.category]}
      </td>
      <td className="px-4 py-3">
        <Badge variant={getStatusVariant(document.status)}>
          {STATUS_LABELS[document.status]}
        </Badge>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">{document.createdByName}</td>
      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
        {formatDate(document.createdAt)}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            aria-label={`Edit ${document.code}`}
            onClick={() => onEdit(document.id)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              aria-label={`Delete ${document.code}`}
              onClick={() => onDelete(document)}
              className="text-destructive hover:bg-red-50 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  )
})
