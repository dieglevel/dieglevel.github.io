import { createFileRoute } from '@tanstack/react-router'
import MotionDetector from '@/shared/pages/motion-detector'

export const Route = createFileRoute('/(public)/motion-detector')({
  component: RouteComponent,
})

function RouteComponent() {
  return <MotionDetector />
}
