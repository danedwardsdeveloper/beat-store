'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import CtaButton from '../../CtaButton'
import CurrencyOptions from '../CurrencyOptions'
import { homeMenuItem, iconMenuItems, menuItemsData } from '../data'
import DesktopMenuLink from './DesktopMenuLink'
import { menuItemStyles } from '@/styles'

export default function DesktopMenu() {
  const pathname = usePathname()

  return (
    <nav
      data-component="DesktopMenu"
      className={clsx(
        'fixed top-0 h-14',
        'hidden md:flex items-center px-6 justify-between w-full border-b',
        'bg-primary border-primary z-menu-bar',
      )}
    >
      <ul className="flex space-x-4 h-full">
        {[homeMenuItem, ...menuItemsData].map(item => (
          <li key={item.href} className="h-full">
            <DesktopMenuLink menuItem={item} variant="desktop" />
          </li>
        ))}
      </ul>
      <div className="flex items-center space-x-4">
        <CtaButton variant="primary" />
        <ul className="flex gap-x-4">
          <li>
            <CurrencyOptions />
          </li>
          {iconMenuItems.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={clsx(
                  menuItemStyles.base,
                  'text-xl relative group p-1 rounded-md',
                  'flex items-center',
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
