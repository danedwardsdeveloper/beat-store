'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ThreeBarsIcon } from '@/components/icons'

import { homeMenuItem, iconMenuItems } from '../data'
import MobileMenuLink from './MobileMenuLink'
import Panel from './Panel'
import { useUi } from '@/providers/ui'
import { menuItemStyles } from '@/styles'

export default function MobileMenu() {
  const { mobilePanelOpen, setMobilePanelOpen, toggleMobilePanel } = useUi()
  const pathname = usePathname()

  return (
    <nav
      data-component="MobileMenu"
      className={clsx(
        'fixed md:hidden w-full top-0', //
        'bg-primary z-menu-bar',
      )}
    >
      <div
        className={clsx(
          'flex items-center px-3 py-3 justify-between w-full', //
          'z-menu-bar',
        )}
      >
        <button onClick={() => toggleMobilePanel()} className="flex items-center w-20">
          <ThreeBarsIcon />
        </button>

        <MobileMenuLink menuItem={homeMenuItem} variant={'mobile'} />

        <div className="flex space-x-4">
          {iconMenuItems.map((item, index) => (
            <Link
              href={item.href}
              key={index}
              onClick={() => setMobilePanelOpen(false)}
              className={clsx(
                'p-1 rounded transition-colors duration-300',
                pathname === item.href ? menuItemStyles.active : menuItemStyles.inactive,
              )}
            >
              <item.icon />
            </Link>
          ))}
        </div>
      </div>
      <Panel panelOpen={mobilePanelOpen} />
    </nav>
  )
}
