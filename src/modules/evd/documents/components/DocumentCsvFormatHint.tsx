export function DocumentCsvFormatHint() {
  return (
    <>
      <p className="mb-1 text-sm font-medium text-zinc-800">File format</p>
      <code className="block text-xs text-zinc-600">
        code,title,category,status
        <br />
        DOC-001,Sales Contract,CONTRACT,ACTIVE
        <br />
        DOC-002,Q3 Report,REPORT,DRAFT
      </code>
      <p className="mt-2 text-xs text-muted-foreground">
        category: CONTRACT · INVOICE · REPORT · POLICY · OTHER
        &nbsp;|&nbsp;
        status: ACTIVE · INACTIVE · DRAFT
      </p>
    </>
  )
}
