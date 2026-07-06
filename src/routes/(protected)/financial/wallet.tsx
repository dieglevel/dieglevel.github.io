import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/financial/wallet')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(protected)/financial/wallet"!</div>
}
