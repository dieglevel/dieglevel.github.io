import React from 'react'

import { Layout } from 'antd'
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
            background: background.layout,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
