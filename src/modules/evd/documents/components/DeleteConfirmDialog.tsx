import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog'
import { useDeleteDocument } from '@/modules/evd/documents/hooks/useDocumentMutations'
import type { Document } from '@/modules/evd/documents/types/document.types'

interface DeleteConfirmDialogProps {
  target: Document | null
  onClose: () => void
}

export function DeleteConfirmDialog({ target, onClose }: DeleteConfirmDialogProps) {
  const { mutateAsync, isPending, error, reset } = useDeleteDocument()

  const handleConfirm = async () => {
    if (!target) return
    try {
      await mutateAsync(target.id)
      onClose()
    } catch {
    }
  }

  const handleClose = () => {
    if (isPending) return
    reset()
    onClose()
  }

  return (
    <ConfirmDialog
      open={target !== null}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title="Confirm Delete"
      description={
        <>
          Are you sure you want to delete document{' '}
          <span className="font-semibold text-zinc-900">{target?.code}</span>?
          <br />
          <span className="text-muted-foreground">This action cannot be undone.</span>
        </>
      }
      confirmLabel="Delete Document"
      confirmVariant="destructive"
      isLoading={isPending}
      error={error instanceof Error ? error : null}
    />
  )
}
