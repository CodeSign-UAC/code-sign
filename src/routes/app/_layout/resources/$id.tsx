import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/_layout/resources/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-4">
      <section></section>
    </div>
  )
}
