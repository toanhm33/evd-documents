/// <reference lib="webworker" />
import Papa from 'papaparse'
import { documentFormSchema } from '@/modules/evd/documents/schemas/document.schema'
import type { DocumentFormValues } from '@/modules/evd/documents/schemas/document.schema'

export interface ValidRow {
  rowNumber: number
  data: DocumentFormValues
}

export interface InvalidRow {
  rowNumber: number
  data: Record<string, string>
  errors: string[]
}

export interface WorkerResult {
  valid: ValidRow[]
  invalid: InvalidRow[]
  totalRows: number
}

self.onmessage = (event: MessageEvent<string>) => {
  const csvText = event.data

  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  })

  const valid: ValidRow[] = []
  const invalid: InvalidRow[] = []

  parsed.data.forEach((rawRow, index) => {
    const rowNumber = index + 2

    const normalized = {
      code: rawRow['code']?.trim().toUpperCase() ?? '',
      title: rawRow['title']?.trim() ?? '',
      category: rawRow['category']?.trim().toUpperCase() ?? '',
      status: rawRow['status']?.trim().toUpperCase() ?? '',
    }

    const result = documentFormSchema.safeParse(normalized)

    if (result.success) {
      valid.push({ rowNumber, data: result.data })
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
    totalRows: parsed.data.length,
  }
  self.postMessage(response)
}
