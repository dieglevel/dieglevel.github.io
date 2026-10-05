import React from 'react'
import { AppstoreOutlined } from '@ant-design/icons'
import {
  CalendarSync,
  CircleDollarSign,
  CirclePlay,
  Gauge,
  GoalIcon,
  HandCoins,
  Key,
  LayoutDashboardIcon,
  PencilRuler,
  ToolCase,
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
import type { ParseKeys } from 'i18next'

export interface MenuItem extends MenuItemType {
  path?: AppPath
  children?: Array<MenuItem>
}

// Sử dụng ParseKeys<'common'> để autocomplete đúng các key từ common.json
type TranslationKey = ParseKeys<'common'>

export interface AppMenuItem {
  id: string
  label: TranslationKey
  icon?: React.ReactNode
  link?: LinkProps['to']
  isAuthRequired?: boolean
  children?: Array<AppMenuItem>
}

export const Menu: Array<AppMenuItem> = [
  {
    id: 'tools',
    label: 'menu.tools',
    icon: <ToolCase style={{ fontSize: 18 }} />,
    children: [
      {
        id: 'music',
        label: 'menu.music',
        icon: <CirclePlay size={16} style={{ fontSize: 16 }} />,
        link: '/music',
      },
      {
        id: 'network',
        label: 'menu.network',
        icon: <Gauge size={16} style={{ fontSize: 16 }} />,
        link: '/network',
      },
      {
        id: 'icon',
        label: 'menu.icon',
        icon: <AppstoreOutlined style={{ fontSize: 16 }} />,
        link: '/icon',
      },
      {
        id: 'demoComponent',
        label: 'menu.demo-component',
        icon: <PencilRuler size={16} style={{ fontSize: 16 }} />,
        link: '/demoComponent',
      },
      {
        id: 'hashId',
        label: 'menu.hash-id',
        icon: <Key size={16} style={{ fontSize: 16 }} />,
        link: '/hashId',
      },
    ],
  },
  {
    id: 'finance',
    label: 'menu.finance.finnance',
    icon: <CircleDollarSign style={{ fontSize: 18 }} />,
    isAuthRequired: true,
    children: [
      {
        id: 'dashboard',
        label: 'menu.finance.dashboard',
        icon: <LayoutDashboardIcon size={16} style={{ fontSize: 16 }} />,
        link: '/financial/dashboard',
      },
      {
        id: 'transaction',
        label: 'menu.finance.transaction',
        icon: <IconArrowTopDown style={{ fontSize: 16 }} />,
        link: '/financial/transaction',
      },
      {
        id: 'category',
        label: 'menu.finance.category',
        icon: <IconCategory style={{ fontSize: 16 }} />,
        link: '/financial/category',
      },
      {
        id: 'wallet',
        label: 'menu.finance.wallet',
        icon: <IconCreditCard style={{ fontSize: 16 }} />,
        link: '/financial/wallet',
      },
      {
        id: 'debt',
        label: 'menu.finance.debt',
        icon: <HandCoins size={16} />,
        link: '/financial/debt',
      },
      {
        id: 'goal',
        label: 'menu.finance.goal',
        icon: <GoalIcon size={16} />,
        link: '/financial/goal',
      },
      {
        id: 'recurring',
        label: 'menu.finance.recurring',
        icon: <CalendarSync size={16} />,
        link: '/financial/recurring',
      },
      {
        id: 'setting',
        label: 'menu.finance.settings',
        icon: <IconSetting style={{ fontSize: 16 }} />,
        link: '/financial/setting',
      },
    ],
  },
]

export function getAppMenu(isAuthenticated: boolean): Array<AppMenuItem> {
  return Menu.filter((item) => !item.isAuthRequired || isAuthenticated)
}
