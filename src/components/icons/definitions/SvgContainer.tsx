import { ReactNode } from 'react'

export type IconSizes = 'size-14' | 'size-8'

export function SvgContainer({ children, size = 'size-8' }: { children: ReactNode; size?: IconSizes }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={size}
    >
      {children}
    </svg>
  )
}
