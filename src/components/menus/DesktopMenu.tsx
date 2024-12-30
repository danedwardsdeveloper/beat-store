'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import CtaButton from '../CtaButton'
import { homeMenuItem, iconMenuItems, menuItemsData } from './data'
import MenuLink from './MenuLink'
import { menuItemStyles } from '@/app/(front-end)/styles/styles'

export default function DesktopMenu() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex bg-slate-950  items-center px-6 py-3 justify-between w-full">
      <ul className="flex space-x-4">
        {[homeMenuItem, ...menuItemsData].map(item => (
          <li key={item.href}>
            <MenuLink menuItem={item} variant="desktop" />
          </li>
        ))}
      </ul>
      <div className="flex items-center space-x-4">
        <CtaButton />
        <ul className="flex space-x-4">
          {iconMenuItems.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={clsx(
                  menuItemStyles.base,
                  pathname === item.href ? menuItemStyles.active : menuItemStyles.inactive,
                )}
              >
                {<item.icon />}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
