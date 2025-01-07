import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { MenuItem } from '../data'
import { useUi } from '@/providers/ui'

export default function MobileMenuLink({
  menuItem,
  variant,
}: {
  menuItem: MenuItem
  variant: 'mobile' | 'desktop'
}) {
  const pathname = usePathname()
  const { setMobilePanelOpen } = useUi()
  const isActive = pathname === menuItem.href
  const isMobile = variant === 'mobile'
  return (
    <Link
      href={menuItem.href}
      onClick={isMobile ? () => setMobilePanelOpen(false) : () => null}
      className={clsx(
        'text-xl',
        'px-3 py-2 transition-all duration-300 rounded',
        ' active:bg-slate-600/50',
        isActive ? ['text-indigo-400 bg-white/10'] : ['text-zinc-200'],
      )}
    >
      {isMobile ? menuItem.text.mobile : menuItem.text.desktop}
    </Link>
  )
}
