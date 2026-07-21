import React from 'react'
import * as LucideIcons from 'lucide-react'

interface IconRendererProps {
  iconName: string | null
  size?: number
  color?: string | null
}

export const IconRenderer: React.FC<IconRendererProps> = ({
  iconName,
  size = 20,
  color = 'currentColor',
}) => {
  const IconComponent = (LucideIcons as any)[iconName || 'X']

  if (!IconComponent) {
    return null
  }

  return <IconComponent size={size} color={color} />
}
