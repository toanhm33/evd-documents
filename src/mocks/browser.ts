import { setupWorker } from 'msw/browser'
import { documentHandlers } from '@/modules/evd/documents/mocks/documents.handlers'

export const handlers = [...documentHandlers]

export const worker = setupWorker(...handlers)
