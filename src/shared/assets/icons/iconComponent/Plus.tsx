import Icon from '@ant-design/icons'
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon'
import type { SVGProps } from 'react'

const PlusSvg = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={'1em'}
    height={'1em'}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6 12H12M12 12H18M12 12V18M12 12V6"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const IconPlus = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={PlusSvg} {...props} />
)
