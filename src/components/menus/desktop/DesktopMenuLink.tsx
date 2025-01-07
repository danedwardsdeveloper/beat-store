import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { MenuItem } from '../data'
import { useUi } from '@/providers/ui'

export default function DesktopMenuLink({
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
        'text-xl relative group h-full flex items-center',
        'px-2 transition-all duration-300',
        'before:absolute before:inset-2 before:rounded-md',
        'hover:before:bg-slate-700/50 active:before:bg-slate-600/50',
        'before:transition-all before:duration-300 before:-z-10',
        'after:absolute after:bottom-0 after:left-2 after:right-2',
        'after:h-0.5 after:rounded-full',
        'after:transition-all after:duration-300',
        isActive
          ? ['text-zinc-300', 'after:bg-indigo-500', 'after:opacity-100']
          : ['text-zinc-200', 'after:opacity-0', 'hover:after:opacity-50'],
      )}
    >
      {isMobile ? menuItem.text.mobile : menuItem.text.desktop}
    </Link>
  )
}
