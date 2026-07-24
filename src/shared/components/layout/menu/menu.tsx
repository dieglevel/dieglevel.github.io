import { Flex, Grid, Input, Typography } from 'antd'
import { Brand } from '@/shared/assets/images'
import './menu.css'

const { useBreakpoint } = Grid

export default function Menu() {
  const screen = useBreakpoint()

  return (
    <Flex
      style={{
        display: screen.xs ? 'none' : 'flex',
        background: '#3D1F10',
        padding: 12,
      }}
      justify="space-between"
      align="center"
    >
      <Flex align="center" justify="center" gap={12}>
        <img
          src={Brand}
          alt="Brand"
          style={{
            width: 40,
            height: 40,
            background: '#B74C36',
            borderRadius: 8,
          }}
        />
        <Typography className="sidebar-title">Blossom</Typography>
      </Flex>
      <Flex></Flex>
      {/* Right */}
      <Flex gap={8}>
        <Input
          placeholder="Search..."
          style={{
            width: 200,
          }}
        />

        <img
          src={Brand}
          alt="Brand"
          style={{
            width: 30,
            height: 30,
            background: '#B74C36',
            borderRadius: 999,
          }}
        />
      </Flex>
    </Flex>
  )
}
