import { Outlet, createFileRoute } from '@tanstack/react-router'
import { AppSidebar, Header } from '@/core/layout'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AuthProvider } from '@/core/providers'

export const Route = createFileRoute('/app/_layout')({
  component: AppLayout,
})

function AppLayout(): React.JSX.Element {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-col">
            <Header />
            <main className="flex-1 p-6">
              <Outlet />
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  )
}
