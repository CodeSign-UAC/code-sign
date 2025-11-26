import { Outlet, createFileRoute } from '@tanstack/react-router'
import { AppSidebar, Header } from '@/core/layout'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'

export const Route = createFileRoute('/app/_layout')({
  component: AppLayout,
})

function AppLayout(): React.JSX.Element {
  return (
    <>
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
      <Toaster />
    </>
  )
}
