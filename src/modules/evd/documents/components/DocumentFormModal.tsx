import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { memo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Modal } from '@/shared/components/ui/Modal'
import { Select } from '@/shared/components/ui/Select'
import {
  CATEGORY_LABELS,
  DEFAULT_DOCUMENT_FORM_VALUES,
  DOCUMENT_CATEGORIES,
  DOCUMENT_STATUSES,
  STATUS_LABELS,
} from '@/modules/evd/documents/constants/document.constants'
import {
  useCreateDocument,
  useUpdateDocument,
} from '@/modules/evd/documents/hooks/useDocumentMutations'
import {
  documentFormSchema,
  type DocumentFormValues,
} from '@/modules/evd/documents/schemas/document.schema'
import type { Document } from '@/modules/evd/documents/types/document.types'
import { cn } from '@/shared/lib/utils'

interface DocumentFormModalProps {
  open: boolean
  editTarget: Document | null
  onClose: () => void
}

export const DocumentFormModal = memo(function DocumentFormModal({ open, editTarget, onClose }: DocumentFormModalProps) {
  const isEdit = editTarget !== null
  const createMutation = useCreateDocument()
  const updateMutation = useUpdateDocument()
  const isPending = createMutation.isPending || updateMutation.isPending
  const apiError = createMutation.error ?? updateMutation.error

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: DEFAULT_DOCUMENT_FORM_VALUES,
  })

  useEffect(() => {
    if (open) {
      reset(
        isEdit
          ? {
              code: editTarget.code,
              title: editTarget.title,
              category: editTarget.category,
              status: editTarget.status,
            }
          : DEFAULT_DOCUMENT_FORM_VALUES,
      )
      createMutation.reset()
      updateMutation.reset()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editTarget?.id])

  const handleClose = () => {
    if (isPending) return
    onClose()
  }

  const onSubmit = async (values: DocumentFormValues) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: editTarget.id, payload: values })
      } else {
        await createMutation.mutateAsync(values)
      }
      onClose()
    } catch {
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEdit ? 'Edit Document' : 'Add New Document'}
      description={isEdit ? `Editing: ${editTarget.code}` : 'Fill in the information below.'}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-900" htmlFor="code">
            Document Code <span className="text-destructive">*</span>
          </label>
          <Input
            id="code"
            placeholder="E.g.: DOC-001"
            disabled={isEdit}
            aria-invalid={!!errors.code}
            {...register('code', {
              setValueAs: (v: string) => v.toUpperCase().trim(),
            })}
            className={cn(isEdit && 'bg-muted text-muted-foreground', errors.code && 'border-destructive focus-visible:ring-destructive/40')}
          />
          {errors.code && (
            <p className="text-xs text-destructive">{errors.code.message}</p>
          )}
          {isEdit && (
            <p className="text-xs text-muted-foreground">Code cannot be changed after creation.</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-900" htmlFor="title">
            Title <span className="text-destructive">*</span>
          </label>
          <Input
            id="title"
            placeholder="Enter document title..."
            aria-invalid={!!errors.title}
            {...register('title')}
            className={cn(errors.title && 'border-destructive focus-visible:ring-destructive/40')}
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-900" htmlFor="category">
              Category <span className="text-destructive">*</span>
            </label>
            <Select
              id="category"
              aria-invalid={!!errors.category}
              {...register('category')}
            >
              {DOCUMENT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </Select>
            {errors.category && (
              <p className="text-xs text-destructive">{errors.category.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-900" htmlFor="status">
              Status <span className="text-destructive">*</span>
            </label>
            <Select
              id="status"
              aria-invalid={!!errors.status}
              {...register('status')}
            >
              {DOCUMENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </Select>
            {errors.status && (
              <p className="text-xs text-destructive">{errors.status.message}</p>
            )}
          </div>
        </div>

        {apiError && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {apiError instanceof Error ? apiError.message : 'An error occurred. Please try again.'}
          </p>
        )}

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" variant={isEdit ? 'success' : 'default'} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? 'Save Changes' : 'Create Document'}
          </Button>
        </div>
      </form>
    </Modal>
  )
})
