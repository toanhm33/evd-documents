import type { DocumentCategory, DocumentStatus } from '@/modules/evd/documents/constants/document.constants'
import {
  DOCUMENT_CATEGORIES,
  DOCUMENT_STATUSES,
} from '@/modules/evd/documents/constants/document.constants'
import type { Document } from '@/modules/evd/documents/types/document.types'
import { DEMO_USERS } from '@/app/constants/auth.constants'

const TITLES = [
  'Service Agreement',
  'Acceptance Certificate',
  'Quarterly Financial Report',
  'Warehouse Operations Procedure',
  'Information Security Policy',
  'Payment Invoice',
  'Project Deployment Plan',
  'User Guide',
  'Personnel Evaluation Form',
  'Internal Audit Report',
]

const CREATORS = [
  { id: DEMO_USERS.admin.id, name: DEMO_USERS.admin.name },
  { id: DEMO_USERS.staff.id, name: DEMO_USERS.staff.name },
  { id: 'staff2', name: 'John Smith' },
  { id: 'staff3', name: 'Jane Doe' },
]

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!
}

function padNumber(value: number, length = 3): string {
  return String(value).padStart(length, '0')
}

function createDocument(index: number): Document {
  const creator = pickRandom(CREATORS)
  const category = pickRandom(DOCUMENT_CATEGORIES) as DocumentCategory
  const status = pickRandom(DOCUMENT_STATUSES) as DocumentStatus
  const createdAt = new Date(Date.now() - index * 86_400_000).toISOString()

  return {
    id: crypto.randomUUID(),
    code: `DOC-${padNumber(index + 1)}`,
    title: `${pickRandom(TITLES)} #${index + 1}`,
    category,
    status,
    createdBy: creator.id,
    createdByName: creator.name,
    createdAt,
    updatedAt: createdAt,
  }
}

export const seedDocuments: Document[] = Array.from({ length: 100 }, (_, index) =>
  createDocument(index),
)

export function cloneSeedDocuments(): Document[] {
  return seedDocuments.map((document) => ({ ...document }))
}
