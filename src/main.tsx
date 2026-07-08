import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/app/App'
import { QueryProvider } from '@/shared/providers/QueryProvider'
import { ErrorBoundary } from '@/shared/components/ui/ErrorBoundary'
import '@/styles/tailwind-safelist'
import './index.css'

async function enableMocking() {
  const { worker } = await import('@/mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })

  // On the very first visit the SW is registered but not yet controlling the page.
  // Reloading makes the SW claim the page so it can intercept requests.
  if (!navigator.serviceWorker.controller) {
    window.location.reload()
    await new Promise(() => {})
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <QueryProvider>
          <App />
        </QueryProvider>
      </ErrorBoundary>
    </StrictMode>,
  )
})
