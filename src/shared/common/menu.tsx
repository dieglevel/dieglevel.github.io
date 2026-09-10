import { AppstoreOutlined } from '@ant-design/icons'

import {
  CalendarSync,
  CirclePlay,
  GoalIcon,
  HandCoins,
  LayoutDashboardIcon,
} from 'lucide-react'
import {
  IconArrowTopDown,
  IconCategory,
  IconCreditCard,
  IconSetting,
} from '../assets/icons'
import type { MenuItemType } from 'antd/es/menu/interface'
import type { AppPath } from '../utils/url-path'
import type { LinkProps } from '@tanstack/react-router'

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
        path: '/',
      },
      {
        key: 'temp',
        icon: <AppstoreOutlined />,
        label: 'Temp',
        path: '/',
      },
    ],
    path: '/',
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

export interface AppMenuItem {
  id: string
  label: string
  icon?: React.ReactNode
  link?: LinkProps['to']
  children?: Array<AppMenuItem>
}

export const AppMenu: Array<AppMenuItem> = [
  {
    id: 'finance',
    label: 'Finance',
    icon: <IconArrowTopDown style={{ fontSize: 18 }} />,
    children: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <LayoutDashboardIcon size={16} style={{ fontSize: 16 }} />,
        link: '/financial/dashboard',
      },
      {
        id: 'transaction',
        label: 'Transaction',
        icon: <IconArrowTopDown style={{ fontSize: 16 }} />,
        link: '/financial/transaction',
      },
      {
        id: 'category',
        label: 'Category',
        icon: <IconCategory style={{ fontSize: 16 }} />,
        link: '/financial/category',
      },
      {
        id: 'wallet',
        label: 'Wallet',
        icon: <IconCreditCard style={{ fontSize: 16 }} />,
        link: '/financial/wallet',
      },
      {
        id: 'debt',
        label: 'Debt',
        icon: <HandCoins size={16} />,
        link: '/financial/debt',
      },
      {
        id: 'goal',
        label: 'Goal',
        icon: <GoalIcon size={16} />,
        link: '/financial/goal',
      },
      {
        id: 'recurring',
        label: 'Recurring',
        icon: <CalendarSync size={16} />,
        link: '/financial/recurring',
      },
      {
        id: 'setting',
        label: 'Settings',
        icon: <IconSetting style={{ fontSize: 16 }} />,
        link: '/financial/setting',
      },
    ],
  },
  {
    id: 'random',
    label: 'Random',
    icon: <IconArrowTopDown style={{ fontSize: 18 }} />,
    children: [
      {
        id: 'music',
        label: 'Music',
        icon: <CirclePlay size={16} style={{ fontSize: 16 }} />,
        link: '/music',
      },
    ],
  },
]
