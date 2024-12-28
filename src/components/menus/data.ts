import { ComponentType } from 'react'

import { AccountIcon, ShoppingIcon } from './Icons'

interface MenuItemData {
  display: string | ComponentType
  href: string
}

export const menuItemsData: MenuItemData[] = [
  { display: 'Home', href: '/' },
  { display: 'Beats', href: '/beats' },
  { display: 'Articles', href: '/articles' },
  { display: 'Admin', href: '/admin' },
]

export const iconMenuItems: MenuItemData[] = [
  { display: AccountIcon, href: '/account' },
  { display: ShoppingIcon, href: '/cart' },
]
