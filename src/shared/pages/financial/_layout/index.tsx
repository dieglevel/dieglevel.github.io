import { Flex } from 'antd'
import FloatingMenu from './floating-menu'

interface WalletLayoutProps {
  children: React.ReactNode
}

export default function WalletLayout({ children }: WalletLayoutProps) {
  console.log(children)
  return (
    <Flex flex={1}>
      {children}
      <FloatingMenu />
    </Flex>
  )
}
