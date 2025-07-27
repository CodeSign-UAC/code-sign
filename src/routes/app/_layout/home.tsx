import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/_layout/home')({
  component: DashboardPage,
})

function DashboardPage() {
  return <div>Hello "/dashboard/_layout/"!</div>
}
