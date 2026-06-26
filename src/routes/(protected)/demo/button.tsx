import { createFileRoute } from '@tanstack/react-router'
import { Button, Flex, Typography } from 'antd'
import { IconChevronDownDouble } from '@/shared/assets/icons'

export const Route = createFileRoute('/(protected)/demo/button')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Flex gap={36} style={{ padding: 16 }}>
      <Flex vertical gap={8}>
        <Typography.Title>Button Size</Typography.Title>
        <Button size="large" icon={<IconChevronDownDouble />}>
          Click me
        </Button>
        <Button size="middle" icon={<IconChevronDownDouble />}>
          Click me
        </Button>
        <Button size="small" icon={<IconChevronDownDouble />}>
          Click me
        </Button>
      </Flex>

      <Flex vertical gap={8}>
        <Typography.Title>Button Type</Typography.Title>
        <Button type="primary" icon={<IconChevronDownDouble />}>
          Primary
        </Button>
        <Button type="dashed" icon={<IconChevronDownDouble />}>
          Dashed
        </Button>
        <Button type="default" icon={<IconChevronDownDouble />}>
          Default
        </Button>
        <Button type="link" variant="dashed" icon={<IconChevronDownDouble />}>
          Link
        </Button>
        <Button type="text" icon={<IconChevronDownDouble />}>
          Text
        </Button>
      </Flex>
    </Flex>
  )
}
