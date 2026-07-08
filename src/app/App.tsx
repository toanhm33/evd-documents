import { AppHeader } from '@/app/layout/AppHeader'
import { DocumentsPage } from '@/modules/evd/documents'
import { ErrorBoundary } from '@/shared/components/ui/ErrorBoundary'

function App() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <AppHeader />
      <ErrorBoundary>
        <DocumentsPage />
      </ErrorBoundary>
    </div>
  )
}

export default App
