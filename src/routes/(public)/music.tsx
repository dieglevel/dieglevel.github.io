import { createFileRoute } from '@tanstack/react-router'
import MusicPlayerPage from '@/shared/pages/music'

export const Route = createFileRoute('/(public)/music')({
  component: MusicPlayerPage,
})
