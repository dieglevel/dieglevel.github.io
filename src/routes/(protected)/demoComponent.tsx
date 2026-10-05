import { createFileRoute } from '@tanstack/react-router'
import AntdShowcase from '@/shared/pages/demo'

export const Route = createFileRoute('/(protected)/demoComponent')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AntdShowcase />
}
