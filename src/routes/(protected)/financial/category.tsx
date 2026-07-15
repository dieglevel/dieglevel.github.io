import { createFileRoute } from '@tanstack/react-router'
import Categories from '@/shared/pages/financial/category'

export const Route = createFileRoute('/(protected)/financial/category')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Categories />
}
