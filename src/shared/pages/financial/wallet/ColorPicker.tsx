import { Button, Flex } from 'antd'

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
              width: 42,
              height: 42,
              padding: 0,
              fontSize: 22,
              background: selected ? color : undefined,
              borderColor: selected ? color : undefined,
            }}
          >
            {icon}
          </Button>
        )
      })}
    </Flex>
  )
}
