import clsx from 'clsx'

import { SvgContainer } from './SvgContainer'
import { useUi } from '@/providers/ui'

export function CartIcon() {
  const { cartCount } = useUi()
  const doubleDigits = cartCount.toString().length > 1
  const areItemsInCart = cartCount !== 0
  return (
    <div className="relative">
      {areItemsInCart && (
        <div className="absolute size-8 flex -top-2 -right-5">
          <div
            className={clsx(
              'flex justify-center items-center size-6 rounded-full bg-yellow-300 text-xs font-semibold text-black',
              doubleDigits ? 'size-7' : 'size-5',
            )}
          >
            {cartCount}
          </div>
        </div>
      )}
      <SvgContainer size="size-8">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
        />
      </SvgContainer>
    </div>
  )
}
