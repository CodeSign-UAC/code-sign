import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout')({
  component: LoginLayout,
})

function LoginLayout() {
  return (
    <main className='container min-h-screen mx-auto'>
      <Outlet />
    </main>
  )
}
