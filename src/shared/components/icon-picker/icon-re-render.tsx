import React from 'react'
import * as LucideIcons from 'lucide-react'

interface IconRendererProps {
  iconName: string
  size?: number
  color?: string
}

export const IconRenderer: React.FC<IconRendererProps> = ({
  iconName,
  size = 20,
  color = 'currentColor',
}) => {
  const IconComponent = (LucideIcons as any)[iconName]

  if (!IconComponent) {
    return null
  }

  return <IconComponent size={size} color={color} />
}
