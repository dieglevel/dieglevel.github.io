import React from 'react'

import { Divider, Layout } from 'antd'
import SidebarHeader from './header'
import Body from './menu'
import { SIDEBAR_WIDTH } from '@/shared/common/layout'

const { Sider } = Layout

const Sidebar: React.FC = () => {
  return (
    <Sider
      width={SIDEBAR_WIDTH}
      style={{
        background: 'var(--background-navbar, #170404)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        boxShadow: '0 16px 16px rgba(0, 0, 0, 0.45)',
        borderInlineEnd: '4px solid var(--border-color, #4B1010)',
      }}
      breakpoint="lg"
      collapsible
      trigger={null}
    >
      <SidebarHeader />

      <Divider style={{ margin: 0 }} size="small" />

      <Body />
      <Divider style={{ margin: 0 }} size="small" />
      {/* <Footer /> */}
    </Sider>
  )
}

export default Sidebar
