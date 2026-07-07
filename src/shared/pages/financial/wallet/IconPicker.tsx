import { Button, Flex } from 'antd'
import { border } from '@/shared/common/design-token'

interface IconPickerProps {
  icons: Array<string>
  value: string
  color: string
  onChange: (icon: string) => void
}

export default function IconPicker({
  icons,
  value,
  color,
  onChange,
}: IconPickerProps) {
  return (
    <Flex wrap gap={8}>
      {icons.map((icon) => {
        const selected = value === icon

        return (
          <Button
            key={icon}
            type={selected ? 'primary' : 'default'}
            onClick={() => onChange(icon)}
            style={{
              width: 35,
              height: 35,
              fontSize: 20,
              background: selected ? color : undefined,
              backgroundColor: selected ? `${color}20` : undefined,
              borderColor: border.base,
              outline: selected ? `4px solid ${color}` : 'none',
              outlineOffset: selected ? '2px' : '0',
            }}
          >
            {icon}
          </Button>
        )
      })}
    </Flex>
  )
}
