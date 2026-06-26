import { Flex, Typography } from 'antd'
import { IconBrand } from '@/shared/assets/icons/iconComponent/Brand'

export default function SidebarHeader() {
  return (
    <Flex align="center" gap={8} justify="center" vertical>
      <Flex
        align="center"
        gap={12}
        justify="center"
        style={{
          margin: '12px 0px',
        }}
      >
        <IconBrand style={{ fontSize: 40 }} />
        <Typography.Title level={4} style={{ margin: 0 }}>
          Dieglevel
        </Typography.Title>
      </Flex>
    </Flex>
  )
}
