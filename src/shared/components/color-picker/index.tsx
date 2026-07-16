import { Button, ColorPicker as ColorPickerAntd, Flex } from 'antd'
import { COLORS as DEFAULT_COLORS } from './colors'
import { border } from '@/shared/common/design-token'
import { IconPlus } from '@/shared/assets/icons'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <Flex wrap gap={8}>
      {DEFAULT_COLORS.map((c) => {
        const selected = value === c

        return (
          <Button
            key={c}
            type={selected ? 'primary' : 'default'}
            shape="circle"
            onClick={() => onChange(c)}
            style={{
              width: 20,
              minWidth: 20,
              height: 20,
              minHeight: 20,
              background: c,
              border: 'none',
              outline: selected ? `4px solid ${c}` : 'none',
              outlineOffset: selected ? '2px' : '0',
              transition: 'outline 0.2s ease-in-out',
            }}
          ></Button>
        )
      })}
      <ColorPickerAntd
        value={value}
        defaultFormat="hex"
        onChangeComplete={(valueColor) => onChange(valueColor.toHexString())}
        style={{
          width: 20,
          minWidth: 20,
          height: 20,
          minHeight: 20,
        }}
        allowClear
      >
        <div
          style={{
            width: 20,
            height: 20,
            background: !DEFAULT_COLORS.includes(value) ? value : undefined,
            borderRadius: 9999,
            outline: !DEFAULT_COLORS.includes(value)
              ? `4px solid ${value}`
              : 'none',
            outlineOffset: '2px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'outline 0.2s ease-in-out',
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: border.base,
          }}
        >
          {DEFAULT_COLORS.includes(value) && (
            <IconPlus style={{ fontSize: 20 }} />
          )}
        </div>
      </ColorPickerAntd>
    </Flex>
  )
}
