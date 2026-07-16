import type { InputNumberProps } from 'antd'

export const InputWithComma: InputNumberProps = {
  step: 1000,
  formatter: (value) =>
    value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '',
  parser: (value) => (value ? (value.replace(/\./g, '') as any) : ''),
}
