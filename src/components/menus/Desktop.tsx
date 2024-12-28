'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import CtaButton from '../CtaButton'
import { iconMenuItems, menuItemsData } from './data'

export default function Desktop() {
  const pathname = usePathname()

  return (
    <nav className="bg-slate-950 flex items-center px-6 py-3 justify-between fixed w-full">
      <ul className="flex space-x-4">
        {menuItemsData.map(item => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={clsx(
                'text-xl hover:bg-slate-700 active:bg-slate-600 rounded-lg px-2 py-1 transition-all duration-300',
                pathname === item.href ? 'text-slate-300 bg-slate-800' : 'text-slate-200',
              )}
            >
              {typeof item.display === 'string' ? item.display : <item.display />}
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex items-center space-x-6">
        <CtaButton />
        <ul className="flex space-x-6">
          {iconMenuItems.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={clsx(
                  'text-xl hover:bg-slate-700 active:bg-slate-600 px-2 py-1 transition-all duration-300 rounded-lg block',
                  pathname === item.href ? 'text-slate-300 bg-slate-800' : 'text-slate-200',
                )}
              >
                {typeof item.display === 'string' ? item.display : <item.display />}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
