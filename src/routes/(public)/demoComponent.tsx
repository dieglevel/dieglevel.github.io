import { createFileRoute } from '@tanstack/react-router'
import AntdShowcase from '@/shared/pages/demo'

export const Route = createFileRoute('/(public)/demoComponent')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AntdShowcase />
}
