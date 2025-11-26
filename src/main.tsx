import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'
import { AuthProvider, useAuth } from './modules/auth/auth.provider'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import './styles.css'
// import reportWebVitals from './reportWebVitals.ts'

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { ...TanStackQueryProvider.getContext(), auth: undefined! },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// eslint-disable-next-line react-refresh/only-export-components
function AppComponent() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <TanStackQueryProvider.Provider>
        <AuthProvider>
          <AppComponent />
        </AuthProvider>
      </TanStackQueryProvider.Provider>
    </StrictMode>,
  )
}
