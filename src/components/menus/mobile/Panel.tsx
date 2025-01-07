import clsx from 'clsx'

import CtaButton from '@/components/CtaButton'

import { menuItemsData } from '../data'
import MobileMenuLink from './MobileMenuLink'

export default function Panel({ panelOpen = false }: { panelOpen: boolean }) {
  return (
    <div
      data-component="MobilePanel"
      className={clsx(
        'absolute flex flex-col w-full border-b overflow-hidden transition-all duration-500 ease-in-out',
        'z-menu-bar bg-secondary border-primary',
        panelOpen ? 'h-52' : 'h-0',
      )}
    >
      <ul className="flex flex-col gap-y-4 p-4">
        {menuItemsData.map((item, index) => (
          <li key={index}>
            <MobileMenuLink menuItem={item} variant={'mobile'} />
          </li>
        ))}
        <li>
          <CtaButton variant="primary" />
        </li>
      </ul>
    </div>
  )
}
