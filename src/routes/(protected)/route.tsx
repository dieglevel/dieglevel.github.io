import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Flex } from 'antd'
import MainLayout from '@/shared/components/layout/layout'

export const Route = createFileRoute('/(protected)')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <MainLayout>
      <Flex flex={1}>
        <Outlet />
      </Flex>
    </MainLayout>
  )
}
