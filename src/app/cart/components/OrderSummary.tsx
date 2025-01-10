import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

import CheckoutButton from './CheckoutButton'

export default function OrderSummary() {
  return (
    <section
      aria-labelledby="summary-heading"
      className={clsx(
        'mt-16 rounded-lg px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8', //
        'bg-secondary',
      )}
    >
      <h2 id="summary-heading" className="text-lg font-medium text-white">
        Order summary
      </h2>

      <dl className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <dt className="text-sm text-zinc-400">Subtotal</dt>
          <dd className="text-sm font-medium text-white">$99.00</dd>
        </div>
        <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
          <dt className="flex items-center text-sm text-zinc-400">
            <span>Shipping estimate</span>
            <a href="#" className="ml-2 shrink-0 text-zinc-500 hover:text-zinc-400">
              <span className="sr-only">Learn more about how shipping is calculated</span>
              <QuestionMarkCircleIcon aria-hidden="true" className="size-5" />
            </a>
          </dt>
          <dd className="text-sm font-medium text-white">$5.00</dd>
        </div>
        <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
          <dt className="flex text-sm text-zinc-400">
            <span>Tax estimate</span>
            <a href="#" className="ml-2 shrink-0 text-zinc-500 hover:text-zinc-400">
              <span className="sr-only">Learn more about how tax is calculated</span>
              <QuestionMarkCircleIcon aria-hidden="true" className="size-5" />
            </a>
          </dt>
          <dd className="text-sm font-medium text-white">$8.32</dd>
        </div>
        <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
          <dt className="text-base font-medium text-white">Order total</dt>
          <dd className="text-base font-medium text-white">$112.32</dd>
        </div>
      </dl>

      <div className="mt-6">
        <CheckoutButton />
      </div>
    </section>
  )
}
