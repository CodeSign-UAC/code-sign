import { Outlet, createFileRoute } from '@tanstack/react-router'
import { useEffect, type JSX } from 'react'
import { AppSidebar, Header } from '@/core/layout'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export const Route = createFileRoute('/app/_layout')({
  component: AppLayout,
})

function AppLayout(): JSX.Element {
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
    </>
  )
}
