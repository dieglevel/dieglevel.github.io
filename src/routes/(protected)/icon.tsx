import { createFileRoute } from '@tanstack/react-router'
import IconGallery from '@/shared/pages/_global/icon'

export const Route = createFileRoute('/(protected)/icon')({
  component: RouteComponent,
})

function RouteComponent() {
  return <IconGallery />
}
