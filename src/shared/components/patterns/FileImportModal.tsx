import { AlertTriangle, CheckCircle2, FileUp, Loader2, Upload } from 'lucide-react'
import { memo, useRef } from 'react'
import { Button } from '@/shared/components/ui/Button'
import { ImportErrorList } from '@/shared/components/patterns/ImportErrorList'
import { Modal } from '@/shared/components/ui/Modal'
import { useImportWorker } from '@/shared/hooks/useImportWorker'

interface FileImportModalProps {
  open: boolean
  onClose: () => void
  createWorker: () => Worker
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onImport: (rows: any[]) => Promise<void>
  isImporting: boolean
  importError: Error | null
  title?: string
  fileTypeLabel?: string
  templateUrl?: string
  acceptedFileTypes?: string
  readerMode?: 'text' | 'arraybuffer'
  formatHint?: React.ReactNode
}

export const FileImportModal = memo(function FileImportModal({
  open,
  onClose,
  createWorker,
  onImport,
  isImporting,
  importError,
  title = 'Import from file',
  fileTypeLabel = 'file',
  templateUrl,
  acceptedFileTypes = '.csv,text/csv',
  readerMode = 'text',
  formatHint,
}: FileImportModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { parse, reset, isParsing, isDone, result, errorMessage } = useImportWorker(createWorker)

  const handleClose = () => {
    if (isParsing || isImporting) return
    reset()
    onClose()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      parse(ev.target?.result as string | ArrayBuffer)
    }
    if (readerMode === 'arraybuffer') {
      reader.readAsArrayBuffer(file)
    } else {
      reader.readAsText(file, 'utf-8')
    }
    e.target.value = ''
  }

  const handleImport = async () => {
    if (!result || result.valid.length === 0) return
    try {
      await onImport(result.valid.map((r) => r.data))
      handleClose()
    } catch {
    }
  }

  const validCount = result?.valid.length ?? 0
  const invalidCount = result?.invalid.length ?? 0

  return (
    <Modal open={open} onClose={handleClose} title={title}>
      <div className="flex flex-col gap-5">

        {formatHint && (
          <div className="rounded-md border border-border bg-muted/40 px-4 py-3">
            {formatHint}
            {templateUrl && (
              <a
                href={templateUrl}
                download
                className="mt-2 inline-block text-xs text-blue-600 underline hover:text-blue-800"
              >
                Download template file
              </a>
            )}
          </div>
        )}

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFileTypes}
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
            disabled={isParsing || isImporting}
          >
            {isParsing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                {isDone ? 'Choose another file' : `Choose ${fileTypeLabel} file`}
              </>
            )}
          </Button>
          {errorMessage && (
            <p className="mt-1 text-xs text-destructive">{errorMessage}</p>
          )}
        </div>

        {isDone && result && (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                <div>
                  <p className="text-xs text-green-700">Valid</p>
                  <p className="text-lg font-bold leading-tight text-green-800">{validCount}</p>
                </div>
              </div>
              <div className={`flex items-center gap-2 rounded-md border px-3 py-2 ${
                invalidCount > 0 ? 'border-red-200 bg-red-50' : 'border-border bg-muted/40'
              }`}>
                <AlertTriangle className={`h-4 w-4 shrink-0 ${
                  invalidCount > 0 ? 'text-red-500' : 'text-muted-foreground'
                }`} />
                <div>
                  <p className={`text-xs ${invalidCount > 0 ? 'text-red-700' : 'text-muted-foreground'}`}>
                    Errors
                  </p>
                  <p className={`text-lg font-bold leading-tight ${
                    invalidCount > 0 ? 'text-red-800' : 'text-zinc-500'
                  }`}>
                    {invalidCount}
                  </p>
                </div>
              </div>
            </div>

            {invalidCount > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-medium text-red-700">
                  Details for {invalidCount} invalid row(s) (will be skipped):
                </p>
                <ImportErrorList errors={result.invalid} />
              </div>
            )}

            {validCount === 0 && (
              <p className="text-center text-sm text-muted-foreground">
                No valid rows to import.
              </p>
            )}
          </div>
        )}

        {importError && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {importError instanceof Error ? importError.message : 'Import failed. Please try again.'}
          </p>
        )}

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button variant="outline" onClick={handleClose} disabled={isParsing || isImporting}>
            Cancel
          </Button>
          {isDone && validCount > 0 && (
            <Button onClick={handleImport} disabled={isImporting}>
              {isImporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Import {validCount} row(s)
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
})
