import { Loader2, Save, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'

interface InlineEditRowShellProps {
  children: React.ReactNode
  onSave: () => void
  onCancel: () => void
  isDirty: boolean
  isPending: boolean
  saveError?: Error | null
  colSpanForError?: number
}

export function InlineEditRowShell({
  children,
  onSave,
  onCancel,
  isDirty,
  isPending,
  saveError,
  colSpanForError,
}: InlineEditRowShellProps) {
  return (
    <>
      <tr className="border-t border-blue-200 bg-blue-50/40">
        {children}
        <td className="px-4 py-2">
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="success"
              size="sm"
              onClick={onSave}
              disabled={!isDirty || isPending}
              title="Save (Enter)"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={isPending}
              title="Cancel (Esc)"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </td>
      </tr>
      {saveError && (
        <tr className="bg-blue-50/40">
          <td
            colSpan={colSpanForError}
            className="px-4 pb-2 text-xs text-destructive"
          >
            {saveError.message}
          </td>
        </tr>
      )}
    </>
  )
}
