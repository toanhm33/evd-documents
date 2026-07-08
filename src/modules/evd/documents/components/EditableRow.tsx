import { memo } from 'react'
import { Input } from '@/shared/components/ui/Input'
import { Select } from '@/shared/components/ui/Select'
import { InlineEditRowShell } from '@/shared/components/patterns/InlineEditRowShell'
import { useInlineEdit } from '@/shared/hooks/useInlineEdit'
import {
  CATEGORY_LABELS,
  DOCUMENT_CATEGORIES,
  DOCUMENT_STATUSES,
  STATUS_LABELS,
  type DocumentCategory,
  type DocumentStatus,
} from '@/modules/evd/documents/constants/document.constants'
import { useUpdateDocument } from '@/modules/evd/documents/hooks/useDocumentMutations'
import { validateDocumentField } from '@/modules/evd/documents/schemas/document.schema'
import type { Document } from '@/modules/evd/documents/types/document.types'
import { cn, formatDate } from '@/shared/lib/utils'

interface Draft {
  title: string
  category: DocumentCategory
  status: DocumentStatus
}

interface EditableRowProps {
  document: Document
  onCancel: () => void
  onSaved: () => void
}

export const EditableRow = memo(function EditableRow({
  document,
  onCancel,
  onSaved,
}: EditableRowProps) {
  const { mutateAsync, isPending, error: saveError } = useUpdateDocument()

  const { draft, isDirty, fieldErrors, updateField, runValidate } = useInlineEdit<Draft>({
    initialValues: {
      title: document.title,
      category: document.category,
      status: document.status,
    },
    validate: (d) => ({
      title: validateDocumentField('title', d.title) ?? undefined,
    }),
  })

  const handleSave = async () => {
    if (!isDirty || isPending) return
    if (!runValidate()) return
    try {
      await mutateAsync({ id: document.id, payload: draft })
      onSaved()
    } catch {
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onCancel()
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <InlineEditRowShell
      onSave={handleSave}
      onCancel={onCancel}
      isDirty={isDirty}
      isPending={isPending}
      saveError={saveError instanceof Error ? saveError : null}
      colSpanForError={7}
    >
      <td className="px-4 py-2 font-medium text-muted-foreground whitespace-nowrap">
        {document.code}
      </td>

      <td className="max-w-xs px-4 py-2">
        <Input
          value={draft.title}
          onChange={(e) => updateField('title', e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          disabled={isPending}
          aria-invalid={!!fieldErrors.title}
          className={cn(
            'h-8 text-sm',
            fieldErrors.title && 'border-destructive focus-visible:ring-destructive/40',
          )}
        />
        {fieldErrors.title && (
          <p className="mt-0.5 text-xs text-destructive">{fieldErrors.title}</p>
        )}
      </td>

      <td className="px-4 py-2 whitespace-nowrap">
        <Select
          value={draft.category}
          onChange={(e) => updateField('category', e.target.value as DocumentCategory)}
          onKeyDown={handleKeyDown}
          disabled={isPending}
          className="h-8 text-sm"
        >
          {DOCUMENT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_LABELS[cat]}
            </option>
          ))}
        </Select>
      </td>

      <td className="px-4 py-2">
        <Select
          value={draft.status}
          onChange={(e) => updateField('status', e.target.value as DocumentStatus)}
          onKeyDown={handleKeyDown}
          disabled={isPending}
          className="h-8 text-sm"
        >
          {DOCUMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </Select>
      </td>

      <td className="px-4 py-2 whitespace-nowrap text-muted-foreground">
        {document.createdByName}
      </td>

      <td className="px-4 py-2 whitespace-nowrap text-muted-foreground">
        {formatDate(document.createdAt)}
      </td>
    </InlineEditRowShell>
  )
})
