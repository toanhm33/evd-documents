export const IMPORT_STATUS = {
  IDLE: 'idle',
  PARSING: 'parsing',
  DONE: 'done',
  ERROR: 'error',
} as const

export type ImportStatus = (typeof IMPORT_STATUS)[keyof typeof IMPORT_STATUS]
