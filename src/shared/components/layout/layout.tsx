import React from 'react'

import { Flex, Layout } from 'antd'
import Menu from './menu/menu'
import { background } from '@/shared/common/design-token'

const { Content } = Layout

interface Props {
  children: React.ReactNode
}

const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <Layout
      style={{
        minHeight: '100vh',
        height: '100%',
      }}
    >
      <Menu />
      <Layout
        className="hide-scrollbar
      "
        style={{
          overflowY: 'auto',
          height: '100vh',
        }}
      >
        <Content
          style={{
            overflow: 'initial',
          }}
        >
          <Flex
            flex={1}
            style={{
              minHeight: '100vh',
              background: background.layout,
            }}
          >
            {children}
          </Flex>
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
