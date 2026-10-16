import { createFileRoute } from '@tanstack/react-router'
import TalkingDriving from '@/shared/pages/talking-driving'

export const Route = createFileRoute('/(public)/talking-driving')({
  component: RouteComponent,
})

function RouteComponent() {
  return <TalkingDriving />
}
