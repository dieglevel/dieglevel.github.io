import React from 'react'
import * as LucideIcons from 'lucide-react'

interface IconRendererProps {
  iconName?: string | null
  size?: number
  color?: string
}

// Convert kebab-case hoặc snake_case sang PascalCase
// VD: "arrow-right" -> "ArrowRight", "user" -> "User"
const toPascalCase = (str: string) => {
  return str
    .replace(/[-_]([a-z])/g, (_, letter) => letter.toUpperCase())
    .replace(/^[a-z]/, (firstLetter) => firstLetter.toUpperCase())
}

export const IconRenderer: React.FC<IconRendererProps> = ({
  iconName,
  size = 20,
  color = 'currentColor',
}) => {
  if (iconName === null || iconName === undefined) {
    return <>-</>
  }

  const formattedName = toPascalCase(iconName)
  const IconComponent = (LucideIcons as any)[formattedName]

  return <IconComponent size={size} color={color || 'currentColor'} />
}
