import type { IWallet_Category } from '@/shared/api/wallet/category/category.type'

export const COLORS: Array<string> = [
  '#5b5fef',
  '#10b981',
  '#f59e0b',
  '#e11d48',
  '#8b5cf6',
  '#3b82f6',
  '#06b6d4',
  '#ec4899',
  '#059669',
  '#92400e',
  '#6366f1',
  '#0891b2',
  '#db2777',
]

export const ICONS: Array<string> = ['🍔']

export const EMPTY_CATEGORY: Omit<IWallet_Category, 'id'> = {
  created_at: '',
  user_id: '',
  name: '',
  icon: '🍔',
  color: '#5b5fef',
  monthlyBudget: 0,
  totalSpent: 0,
  archived: false,
}
