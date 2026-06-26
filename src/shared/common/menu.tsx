import { AppstoreOutlined } from '@ant-design/icons'

import type { AppPath } from '../utils/url-path'
import type { MenuItemType } from 'antd/es/menu/interface'

export interface MenuItem extends MenuItemType {
  path?: AppPath
  children?: Array<MenuItem>
}

export const menuItems: Array<MenuItem> = [
  {
    key: 'dashboardDad',
    icon: <AppstoreOutlined />,
    label: 'Tổng quan',
    children: [
      {
        key: 'dashboard',
        icon: <AppstoreOutlined />,
        label: 'Tổng quan',
        path: '/dashboard',
      },
      {
        key: 'temp',
        icon: <AppstoreOutlined />,
        label: 'Temp',
        path: '/dashboard',
      },
    ],
    path: '/dashboard',
  },
  {
    key: 'hashId',
    icon: <AppstoreOutlined />,
    label: 'HashId',
    path: '/hashId',
  },
  {
    key: 'hanbiroTask',
    icon: <AppstoreOutlined />,
    label: 'Hanbiro Task',
    path: '/hanbiroTask',
  },
]
