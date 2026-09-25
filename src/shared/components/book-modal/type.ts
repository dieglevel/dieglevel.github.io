import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export interface BookItem {
  key: string
  label: string
  icon?: LucideIcon
  badge?: string
  content?: ReactNode
  body?: string
}

export interface BookSection {
  key: string
  label: string
  icon: LucideIcon
  badge?: string
  title?: string
  subtitle?: string
  content?: ReactNode
  items?: Array<BookItem>
  tip?: string
}
