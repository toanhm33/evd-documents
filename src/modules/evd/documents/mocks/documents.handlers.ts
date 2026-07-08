import { http, HttpResponse, delay } from 'msw'
import { DEMO_USERS } from '@/app/constants/auth.constants'
import type { DocumentFormValues } from '@/modules/evd/documents/schemas/document.schema'
import { documentFormSchema } from '@/modules/evd/documents/schemas/document.schema'
import type { Document, DocumentQueryParams } from '@/modules/evd/documents/types/document.types'
import { cloneSeedDocuments } from '@/modules/evd/documents/mocks/documents.data'

let documents = cloneSeedDocuments()

function parseQueryParams(url: URL): DocumentQueryParams {
  return {
    page: Number(url.searchParams.get('page') ?? 1),
    pageSize: Number(url.searchParams.get('pageSize') ?? 20),
    search: url.searchParams.get('search') ?? '',
    status: (url.searchParams.get('status') ?? '') as DocumentQueryParams['status'],
    category: (url.searchParams.get('category') ?? '') as DocumentQueryParams['category'],
    createdBy: url.searchParams.get('createdBy') ?? '',
  }
}

function filterDocuments(params: DocumentQueryParams): Document[] {
  const search = params.search?.trim().toLowerCase() ?? ''

  return documents.filter((document) => {
    if (params.createdBy && document.createdBy !== params.createdBy) {
      return false
    }

    if (params.status && document.status !== params.status) {
      return false
    }

    if (params.category && document.category !== params.category) {
      return false
    }

    if (search) {
      const matchesCode = document.code.toLowerCase().includes(search)
      const matchesTitle = document.title.toLowerCase().includes(search)
      if (!matchesCode && !matchesTitle) {
        return false
      }
    }

    return true
  })
}

function paginate<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}

export const documentHandlers = [
  http.get('/api/documents', async ({ request }) => {
    await delay(350)

    const url = new URL(request.url)
    const params = parseQueryParams(url)
    const filtered = filterDocuments(params)
    const page = params.page ?? 1
    const pageSize = params.pageSize ?? 20

    return HttpResponse.json({
      data: paginate(filtered, page, pageSize),
      total: filtered.length,
      page,
      pageSize,
    })
  }),

  http.get('/api/documents/:id', async ({ params }) => {
    await delay(200)
    const document = documents.find((item) => item.id === params.id)

    if (!document) {
      return HttpResponse.json({ message: 'Document not found' }, { status: 404 })
    }

    return HttpResponse.json(document)
  }),

  http.post('/api/documents', async ({ request }) => {
    await delay(300)
    const payload = (await request.json()) as DocumentFormValues
    const parsed = documentFormSchema.safeParse(payload)

    if (!parsed.success) {
      return HttpResponse.json(
        { message: parsed.error.issues[0]?.message ?? 'Invalid payload' },
        { status: 400 },
      )
    }

    const duplicate = documents.some((item) => item.code === parsed.data.code)
    if (duplicate) {
      return HttpResponse.json({ message: 'Document code already exists' }, { status: 409 })
    }

    const now = new Date().toISOString()
    const created: Document = {
      id: crypto.randomUUID(),
      ...parsed.data,
      createdBy: DEMO_USERS.admin.id,
      createdByName: DEMO_USERS.admin.name,
      createdAt: now,
      updatedAt: now,
    }

    documents = [created, ...documents]
    return HttpResponse.json(created, { status: 201 })
  }),

  http.put('/api/documents/:id', async ({ params, request }) => {
    await delay(300)
    const payload = (await request.json()) as Partial<DocumentFormValues>
    const index = documents.findIndex((item) => item.id === params.id)

    if (index === -1) {
      return HttpResponse.json({ message: 'Document not found' }, { status: 404 })
    }

    const merged = { ...documents[index], ...payload }
    const parsed = documentFormSchema.safeParse({
      code: merged.code,
      title: merged.title,
      category: merged.category,
      status: merged.status,
    })

    if (!parsed.success) {
      return HttpResponse.json(
        { message: parsed.error.issues[0]?.message ?? 'Invalid payload' },
        { status: 400 },
      )
    }

    const duplicate = documents.some(
      (item, itemIndex) => itemIndex !== index && item.code === parsed.data.code,
    )
    if (duplicate) {
      return HttpResponse.json({ message: 'Document code already exists' }, { status: 409 })
    }

    const updated: Document = {
      ...documents[index]!,
      ...parsed.data,
      updatedAt: new Date().toISOString(),
    }

    documents[index] = updated
    return HttpResponse.json(updated)
  }),

  http.delete('/api/documents/:id', async ({ params }) => {
    await delay(250)
    const index = documents.findIndex((item) => item.id === params.id)

    if (index === -1) {
      return HttpResponse.json({ message: 'Document not found' }, { status: 404 })
    }

    documents.splice(index, 1)
    return HttpResponse.json({ success: true })
  }),

  http.post('/api/documents/bulk', async ({ request }) => {
    await delay(500)
    const body = (await request.json()) as { rows: DocumentFormValues[] }
    const rows = body.rows ?? []

    let imported = 0
    const errors: { row: number; field: string; message: string }[] = []
    const existingCodes = new Set(documents.map((item) => item.code))

    rows.forEach((row, index) => {
      const parsed = documentFormSchema.safeParse(row)
      if (!parsed.success) {
        const issue = parsed.error.issues[0]
        errors.push({
          row: index + 1,
          field: issue?.path[0]?.toString() ?? 'unknown',
          message: issue?.message ?? 'Invalid row',
        })
        return
      }

      if (existingCodes.has(parsed.data.code)) {
        errors.push({
          row: index + 1,
          field: 'code',
          message: 'Document code already exists',
        })
        return
      }

      existingCodes.add(parsed.data.code)
      const now = new Date().toISOString()
      documents.unshift({
        id: crypto.randomUUID(),
        ...parsed.data,
        createdBy: DEMO_USERS.admin.id,
        createdByName: DEMO_USERS.admin.name,
        createdAt: now,
        updatedAt: now,
      })
      imported += 1
    })

    return HttpResponse.json({
      imported,
      failed: errors.length,
      errors,
    })
  }),
]

export function resetMockDocuments() {
  documents = cloneSeedDocuments()
}
