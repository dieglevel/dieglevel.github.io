export interface Category {
  id: string
  name: string
  icon: string
  color: string
  monthlyBudget: number
  totalSpent: number
  archived: boolean
}
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

export const ICONS = [
  '🍔',
  '☕',
  '💧',
  '🚗',
  '🏠',
  '💡',
  '🛒',
  '🎮',
  '💻',
  '❤️',
  '📚',
  '✈️',
  '🎁',
  '💰',
  '🍕',
  '🍜',
  '🎵',
  '🏋️',
  '🎨',
  '📱',
  '🏪',
  '⚽',
  '🎪',
  '🌮',
]

export const EMPTY_CATEGORY: Omit<Category, 'id'> = {
  name: '',
  icon: '🍔',
  color: '#5b5fef',
  monthlyBudget: 0,
  totalSpent: 0,
  archived: false,
}
