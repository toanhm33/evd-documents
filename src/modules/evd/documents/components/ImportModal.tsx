import { FileImportModal } from '@/shared/components/patterns/FileImportModal'
import { DocumentCsvFormatHint } from '@/modules/evd/documents/components/DocumentCsvFormatHint'
import { useBulkImport } from '@/modules/evd/documents/hooks/useDocumentMutations'
import type { DocumentFormValues } from '@/modules/evd/documents/schemas/document.schema'
import CsvWorker from '@/modules/evd/documents/workers/import.worker.ts?worker'
import ExcelWorker from '@/modules/evd/documents/workers/import-excel.worker.ts?worker'

export type ImportType = 'csv' | 'excel'

interface ImportModalProps {
  open: boolean
  onClose: () => void
  type?: ImportType
}

const CONFIG = {
  csv: {
    createWorker: () => new CsvWorker(),
    title: 'Import Documents from CSV',
    fileTypeLabel: '.CSV',
    templateUrl: '/template-import.csv',
    acceptedFileTypes: '.csv,text/csv',
    readerMode: 'text' as const,
  },
  excel: {
    createWorker: () => new ExcelWorker(),
    title: 'Import Documents from Excel',
    fileTypeLabel: '.XLSX',
    templateUrl: '/template-import.xlsx',
    acceptedFileTypes: '.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    readerMode: 'arraybuffer' as const,
  },
}

export function ImportModal({ open, onClose, type = 'csv' }: ImportModalProps) {
  const { mutateAsync, isPending, error } = useBulkImport()
  const config = CONFIG[type]

  const handleImport = async (rows: DocumentFormValues[]) => {
    await mutateAsync(rows)
  }

  return (
    <FileImportModal
      open={open}
      onClose={onClose}
      createWorker={config.createWorker}
      onImport={handleImport}
      isImporting={isPending}
      importError={error instanceof Error ? error : null}
      title={config.title}
      fileTypeLabel={config.fileTypeLabel}
      templateUrl={config.templateUrl}
      acceptedFileTypes={config.acceptedFileTypes}
      readerMode={config.readerMode}
      formatHint={<DocumentCsvFormatHint />}
    />
  )
}
