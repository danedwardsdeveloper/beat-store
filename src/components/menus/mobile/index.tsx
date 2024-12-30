'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { homeMenuItem, iconMenuItems } from '../data'
import MenuIcon from './MenuIcon'
import Panel from './Panel'
import { menuItemStyles } from '@/app/(front-end)/styles/styles'
import { useLayout } from '@/providers/layout'

export default function MobileMenu() {
  const pathname = usePathname()
  const { mobilePanelOpen, toggleMobilePanel } = useLayout()

  return (
    <nav className="md:hidden">
      <div className=" flex bg-slate-950  items-center px-3 py-3 justify-between w-full">
        <div className="flex space-x-4">
          {iconMenuItems.map((item, index) => (
            <Link href={item.href} key={index}>
              <item.icon />
            </Link>
          ))}
        </div>
        <Link
          href={homeMenuItem.href}
          className={clsx(
            menuItemStyles.base,
            pathname === homeMenuItem.href ? menuItemStyles.active : menuItemStyles.inactive,
          )}
        >
          {homeMenuItem.text.mobile}
        </Link>
        <button onClick={() => toggleMobilePanel()}>
          <MenuIcon menuOpen={true} />
        </button>
      </div>
      <Panel panelOpen={mobilePanelOpen} />
    </nav>
  )
}
