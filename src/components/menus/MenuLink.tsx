import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { MenuItem } from './data'
import { menuItemStyles } from '@/app/(front-end)/styles/styles'

export default function MenuLink({
  menuItem,
  variant,
}: {
  menuItem: MenuItem
  variant: 'mobile' | 'desktop'
}) {
  const pathname = usePathname()
  return (
    <Link
      href={menuItem.href}
      className={clsx(
        menuItemStyles.base,
        pathname === menuItem.href ? menuItemStyles.active : menuItemStyles.inactive,
      )}
    >
      {variant === 'desktop' ? menuItem.text.desktop : menuItem.text.mobile}
    </Link>
  )
}
