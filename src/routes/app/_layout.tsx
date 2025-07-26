import { Outlet, createFileRoute } from '@tanstack/react-router'
import { useSidebar } from '@/core/providers'
import { useEffect, type JSX } from 'react'
import { Header, Sidebar } from '@/core/layout'

export const Route = createFileRoute('/app/_layout')({
  component: AppLayout,
})

function AppLayout(): JSX.Element {
  const { isSidebarOpen } = useSidebar()

  useEffect((): void => {
    console.log(`Sidebar is ${isSidebarOpen ? 'open' : 'closed'}`);
  }, [isSidebarOpen])

  return (
    <div className={`drawer ${isSidebarOpen ? 'drawer-open' : ''}`}>
      <input type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      <div className="drawer-side">
        <Sidebar />
      </div>
    </div>
  )
}
