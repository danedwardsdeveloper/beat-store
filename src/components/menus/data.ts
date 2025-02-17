import { ComponentType } from 'react'

import { AccountIcon } from '../icons/definitions/AccountIcon'
import { CartIcon } from '../icons/definitions/CartIcon'

export const homeMenuItem: MenuItem = {
  text: {
    desktop: 'Home',
    mobile: 'Beat Store',
  },
  href: '/',
}

export interface MenuItem {
  text: {
    desktop: string
    mobile: string
  }
  href: string
}

export const menuItemsData: MenuItem[] = [
  { text: { desktop: 'Beats', mobile: 'Beats' }, href: '/beats' },
  { text: { desktop: 'Articles', mobile: 'Articles' }, href: '/articles' },
  { text: { desktop: 'Admin', mobile: 'Admin' }, href: '/admin' },
]

export interface MenuItemWithIcon extends MenuItem {
  icon: ComponentType
}

export const iconMenuItems: MenuItemWithIcon[] = [
  { text: { desktop: 'Account', mobile: 'Account' }, icon: AccountIcon, href: '/account' },
  { text: { desktop: 'Cart', mobile: 'Cart' }, icon: CartIcon, href: '/cart' },
]
