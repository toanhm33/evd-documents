/// <reference lib="webworker" />
import * as XLSX from 'xlsx'
import { documentFormSchema } from '@/modules/evd/documents/schemas/document.schema'
import type { DocumentFormValues } from '@/modules/evd/documents/schemas/document.schema'
import type { ValidRow, InvalidRow, WorkerResult } from '@/modules/evd/documents/workers/import.worker'

self.onmessage = (event: MessageEvent<ArrayBuffer>) => {
  const workbook = XLSX.read(event.data, { type: 'array' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
    defval: '',
    raw: false,
  })

  const valid: ValidRow[] = []
  const invalid: InvalidRow[] = []

  rows.forEach((rawRow, index) => {
    const rowNumber = index + 2

    const normalized = {
      code: (rawRow['code'] ?? rawRow['Code'] ?? '').toString().trim().toUpperCase(),
      title: (rawRow['title'] ?? rawRow['Title'] ?? '').toString().trim(),
      category: (rawRow['category'] ?? rawRow['Category'] ?? '').toString().trim().toUpperCase(),
      status: (rawRow['status'] ?? rawRow['Status'] ?? '').toString().trim().toUpperCase(),
    }

    const result = documentFormSchema.safeParse(normalized)

    if (result.success) {
      valid.push({ rowNumber, data: result.data as DocumentFormValues })
    } else {
      const errors = result.error.issues.map(
        (issue) => `${issue.path.join('.')}: ${issue.message}`,
      )
      invalid.push({ rowNumber, data: rawRow, errors })
    }
  })

  const response: WorkerResult = {
    valid,
    invalid,
    totalRows: rows.length,
  }
  self.postMessage(response)
}
