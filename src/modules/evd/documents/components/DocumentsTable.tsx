import { useCallback, useState } from 'react'
import { DataTable, type ColumnDef } from '@/shared/components/ui/DataTable'
import { DisplayRow } from '@/modules/evd/documents/components/DisplayRow'
import { EditableRow } from '@/modules/evd/documents/components/EditableRow'
import type { Document } from '@/modules/evd/documents/types/document.types'

const COLUMNS: ColumnDef<Document>[] = [
  { key: 'code', header: 'Code' },
  { key: 'title', header: 'Title' },
  { key: 'category', header: 'Category' },
  { key: 'status', header: 'Status' },
  { key: 'createdByName', header: 'Created By' },
  { key: 'createdAt', header: 'Created At' },
  { key: 'actions', header: 'Actions', headerClassName: 'text-right' },
]

interface DocumentsTableProps {
  documents: Document[]
  canDelete: boolean
  onDelete: (document: Document) => void
}

export function DocumentsTable({ documents, canDelete, onDelete }: DocumentsTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleEndEdit = useCallback(() => setEditingId(null), [])

  return (
    <DataTable data={documents} columns={COLUMNS} rowKey={(d) => d.id}>
      {(doc) =>
        doc.id === editingId ? (
          <EditableRow
            key={doc.id}
            document={doc}
            onCancel={handleEndEdit}
            onSaved={handleEndEdit}
          />
        ) : (
          <DisplayRow
            key={doc.id}
            document={doc}
            canDelete={canDelete}
            onEdit={setEditingId}
            onDelete={onDelete}
          />
        )
      }
    </DataTable>
  )
}
