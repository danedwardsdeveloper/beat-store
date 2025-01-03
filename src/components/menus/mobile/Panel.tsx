import clsx from 'clsx'

import CtaButton from '@/components/CtaButton'

import { menuItemsData } from '../data'
import MenuLink from '../MenuLink'
import { menuBorderStyles, zIndexStyles } from '@/styles'

export default function Panel({ panelOpen = false }: { panelOpen: boolean }) {
  return (
    <div
      data-component="MobilePanel"
      className={clsx(
        'absolute flex flex-col w-full bg-slate-900 overflow-hidden transition-all duration-500 ease-in-out',
        zIndexStyles.menuBars,
        menuBorderStyles,
        panelOpen ? 'h-52' : 'h-0',
      )}
    >
      <ul className="flex flex-col gap-y-4 p-4">
        {menuItemsData.map((item, index) => (
          <li key={index}>
            <MenuLink menuItem={item} variant={'mobile'} />
          </li>
        ))}
        <li>
          <CtaButton variant="primary" />
        </li>
      </ul>
    </div>
  )
}
