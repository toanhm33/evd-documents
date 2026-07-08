import { z } from 'zod'
import {
  DOCUMENT_CATEGORIES,
  DOCUMENT_STATUSES,
} from '@/modules/evd/documents/constants/document.constants'

export const documentCodeSchema = z
  .string()
  .trim()
  .min(1, 'Document code is required')
  .max(20, 'Document code must be at most 20 characters')
  .regex(/^[A-Z0-9-]+$/, 'Code may only contain uppercase letters, digits and hyphens')

export const documentTitleSchema = z
  .string()
  .trim()
  .min(3, 'Title must be at least 3 characters')
  .max(200, 'Title must be at most 200 characters')

export const documentCategorySchema = z.enum(DOCUMENT_CATEGORIES, {
  message: 'Invalid category',
})

export const documentStatusSchema = z.enum(DOCUMENT_STATUSES, {
  message: 'Invalid status',
})

export const documentFormSchema = z.object({
  code: documentCodeSchema,
  title: documentTitleSchema,
  category: documentCategorySchema,
  status: documentStatusSchema,
})

export const documentImportRowSchema = documentFormSchema

export type DocumentFormValues = z.infer<typeof documentFormSchema>

export type DocumentFieldKey = keyof DocumentFormValues

export function validateDocumentField(
  field: DocumentFieldKey,
  value: string,
): string | undefined {
  const shape = documentFormSchema.shape[field]
  const result = shape.safeParse(value)
  return result.success ? undefined : result.error.issues[0]?.message
}
