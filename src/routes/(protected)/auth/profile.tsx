import { createFileRoute } from '@tanstack/react-router'
import { ProfileForm } from '@/shared/pages/auth/profile'

export const Route = createFileRoute('/(protected)/auth/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ProfileForm />
}
