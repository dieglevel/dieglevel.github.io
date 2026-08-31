import { createFileRoute } from '@tanstack/react-router'
import { Dashboard } from '@/shared/pages/financial/dashboard'

export const Route = createFileRoute('/(protected)/financial/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Dashboard />
}
