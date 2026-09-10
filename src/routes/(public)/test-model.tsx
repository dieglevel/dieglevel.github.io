import { createFileRoute } from '@tanstack/react-router'
import { StaffOfHoma } from '@/shared/components/staff-of-homa/staff-of-homa'

export const Route = createFileRoute('/(public)/test-model')({
  component: RouteComponent,
})

function RouteComponent() {
  return <StaffOfHoma />
}