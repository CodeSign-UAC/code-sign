import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout')({
  component: LoginLayout,
})

function LoginLayout() {
  return (
    <main className='min-h-screen'>
      <Outlet />
    </main>
  )
}
