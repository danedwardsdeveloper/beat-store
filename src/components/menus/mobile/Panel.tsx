import clsx from 'clsx'
import Link from 'next/link'

import { menuItemsData } from '../data'
import { buttonClasses } from '@/app/(front-end)/styles/styles'

export default function Panel({ panelOpen = false }: { panelOpen: boolean }) {
  return (
    <div
      className={clsx(
        'absolute flex flex-col w-full bg-slate-800 overflow-hidden transition-all duration-500 ease-in-out',
        panelOpen ? 'h-auto' : 'h-0',
      )}
    >
      {menuItemsData.map((item, index) => (
        <Link key={index} href={item.href} className={buttonClasses.primary.base}>
          {item.text.desktop}
        </Link>
      ))}
    </div>
  )
}
