'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { homeMenuItem, iconMenuItems } from '../data'
import MenuIcon from './MenuIcon'
import Panel from './Panel'
import { buttonClasses } from '@/app/(front-end)/styles/styles'

export default function MobileMenu() {
  const pathname = usePathname()
  const [panelOpen, setPanelOpen] = useState(false)

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
        <Link href={homeMenuItem.href} className={buttonClasses.primary.base}>
          {homeMenuItem.text.mobile}
        </Link>
        <button onClick={() => setPanelOpen(!panelOpen)}>
          <MenuIcon menuOpen={true} />
        </button>
      </div>
      <Panel panelOpen={panelOpen} />
    </nav>
  )
}
