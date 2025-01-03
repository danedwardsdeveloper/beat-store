import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { MenuItem } from './data'
import { useUi } from '@/providers/ui'
import { menuItemStyles } from '@/styles'

export default function MenuLink({
  menuItem,
  variant,
}: {
  menuItem: MenuItem
  variant: 'mobile' | 'desktop'
}) {
  const pathname = usePathname()
  const { setMobilePanelOpen } = useUi()
  return (
    <Link
      href={menuItem.href}
      onClick={variant === 'mobile' ? () => setMobilePanelOpen(false) : () => null}
      className={clsx(
        menuItemStyles.base,
        pathname === menuItem.href ? menuItemStyles.active : menuItemStyles.inactive,
      )}
    >
      {variant === 'desktop' ? menuItem.text.desktop : menuItem.text.mobile}
    </Link>
  )
}
