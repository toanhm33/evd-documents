import { useCallback, useEffect, useRef, useState } from 'react'
import { IMPORT_STATUS, type ImportStatus } from '@/shared/constants/import.constants'

export interface WorkerValidRow {
  rowNumber: number
  data: unknown
}

export interface WorkerInvalidRow {
  rowNumber: number
  errors: string[]
}

export interface WorkerResult {
  valid: WorkerValidRow[]
  invalid: WorkerInvalidRow[]
  totalRows: number
}

interface ImportWorkerState {
  status: ImportStatus
  result: WorkerResult | null
  errorMessage: string | null
}

export function useImportWorker(createWorker: () => Worker) {
  const workerRef = useRef<Worker | null>(null)
  const [state, setState] = useState<ImportWorkerState>({
    status: IMPORT_STATUS.IDLE,
    result: null,
    errorMessage: null,
  })

  useEffect(() => {
    return () => { workerRef.current?.terminate() }
  }, [])

  const parse = useCallback((data: string | ArrayBuffer) => {
    workerRef.current?.terminate()

    const worker = createWorker()
    workerRef.current = worker

    setState({ status: IMPORT_STATUS.PARSING, result: null, errorMessage: null })

    worker.onmessage = (event: MessageEvent<WorkerResult>) => {
      setState({ status: IMPORT_STATUS.DONE, result: event.data, errorMessage: null })
      worker.terminate()
      workerRef.current = null
    }

    worker.onerror = (err) => {
      setState({
        status: IMPORT_STATUS.ERROR,
        result: null,
        errorMessage: err.message ?? 'Worker error',
      })
      worker.terminate()
      workerRef.current = null
    }

    worker.postMessage(data)
  }, [createWorker])

  const reset = useCallback(() => {
    workerRef.current?.terminate()
    workerRef.current = null
    setState({ status: IMPORT_STATUS.IDLE, result: null, errorMessage: null })
  }, [])

  return {
    parse,
    reset,
    status: state.status,
    result: state.result,
    errorMessage: state.errorMessage,
    isParsing: state.status === IMPORT_STATUS.PARSING,
    isDone: state.status === IMPORT_STATUS.DONE,
  }
}
