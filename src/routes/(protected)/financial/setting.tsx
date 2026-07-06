import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/financial/setting')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(protected)/wallet/setting"!</div>
}
