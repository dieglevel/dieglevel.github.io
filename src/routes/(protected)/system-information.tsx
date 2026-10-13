import { createFileRoute } from '@tanstack/react-router'
import { Flex } from 'antd'
import { SystemInfoPage } from '@/shared/pages/system-infomation'

export const Route = createFileRoute('/(protected)/system-information')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Flex vertical justify="center" align="center" style={{ width: '100%' }}>
      <SystemInfoPage />
    </Flex>
  )
}
