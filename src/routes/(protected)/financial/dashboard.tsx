import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/financial/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(protected)/financial/dashboard"!</div>
}
