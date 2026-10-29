import { createFileRoute } from '@tanstack/react-router'
import ChangePassword from '@/shared/pages/auth/change-password'

export const Route = createFileRoute('/(protected)/(auth)/change-password')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ChangePassword />
}
