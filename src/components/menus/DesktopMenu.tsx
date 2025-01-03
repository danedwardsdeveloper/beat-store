'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import CtaButton from '../CtaButton'
import { homeMenuItem, iconMenuItems, menuItemsData } from './data'
import MenuLink from './MenuLink'
import { backgroundClasses, menuBorderStyles, menuItemStyles, zIndexStyles } from '@/styles'

export default function DesktopMenu() {
  const pathname = usePathname()

  return (
    <nav
      data-component="DesktopMenu"
      className={clsx(
        'fixed top-0',
        'hidden md:flex items-center px-6 py-3 justify-between w-full',
        menuBorderStyles,
        backgroundClasses.primary,
        zIndexStyles.menuBars,
      )}
    >
      <ul className="flex space-x-4">
        {[homeMenuItem, ...menuItemsData].map(item => (
          <li key={item.href}>
            <MenuLink menuItem={item} variant="desktop" />
          </li>
        ))}
      </ul>
      <div className="flex items-center space-x-4">
        <CtaButton variant="primary" />
        <ul className="flex gap-x-4">
          {iconMenuItems.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={clsx(
                  menuItemStyles.base,
                  'flex items-center',
                  'p-1',
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
