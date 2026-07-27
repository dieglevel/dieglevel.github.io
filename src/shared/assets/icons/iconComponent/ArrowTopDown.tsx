import Icon from '@ant-design/icons'
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon'
import type { SVGProps } from 'react'

const ArrowTopDownSVG = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M5 16L8 19L11 16M8 19V5M19 8L16 5L13 8M16 5V19"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const IconArrowTopDown = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={ArrowTopDownSVG} {...props} />
)
