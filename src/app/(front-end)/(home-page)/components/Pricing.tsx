import { CheckIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

import { backgroundClasses, buttonClasses } from '../../styles/styles'

const includedFeatures = [
  'Private forum access',
  'Member resources',
  'Entry to annual conference',
  'Official member t-shirt',
]

const textBrightestClasses = 'text-zinc-100'
const textSecondBrightestClasses = 'text-gray-400'
const subtleRingClasses = 'ring-gray-700'

const moreTextClasses = 'text-gray-400'
const grayOneHundredClasses = 'bg-gray-100'
const accentClasses = 'text-indigo-400'
const secondaryBackgroundClasses = 'bg-black/20'
const ringTwoClasses = 'ring-gray-900/5'

// cspell:disable
export default function Pricing() {
  return (
    <div className={clsx('py-24 sm:py-32', backgroundClasses.secondary)}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl sm:text-center">
          <h2
            className={clsx(
              'text-pretty text-5xl font-semibold tracking-tight sm:text-balance sm:text-6xl',
              textBrightestClasses,
            )}
          >
            Simple no-tricks pricing
          </h2>
          <p
            className={clsx(
              'mx-auto mt-6 max-w-2xl text-pretty text-lg font-medium sm:text-xl/8',
              textSecondBrightestClasses,
            )}
          >
            Distinctio et nulla eum soluta et neque labore quibusdam. Saepe et quasi iusto modi velit ut non
            voluptas in. Explicabo id ut laborum.
          </p>
        </div>
        <div
          className={clsx(
            'mx-auto mt-16 max-w-2xl rounded-3xl ring-1 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none',
            subtleRingClasses,
          )}
        >
          <div className="p-8 sm:p-10 lg:flex-auto">
            <h3 className={clsx('text-3xl font-semibold tracking-tight', textBrightestClasses)}>
              Lifetime membership
            </h3>
            <p className={clsx('mt-6 text-base/7 ', moreTextClasses)}>
              Lorem ipsum dolor sit amet consect etur adipisicing elit. Itaque amet indis perferendis
              blanditiis repellendus etur quidem assumenda.
            </p>
            <div className="mt-10 flex items-center gap-x-4">
              <h4
                className={clsx('flex-none text-sm/6 font-semibold', accentClasses)}
              >{`What's included`}</h4>
              <div className={clsx('h-px flex-auto', grayOneHundredClasses)} />
            </div>
            <ul
              role="list"
              className={clsx(
                'mt-8 grid grid-cols-1 gap-4 text-sm/6 sm:grid-cols-2 sm:gap-6',
                moreTextClasses,
              )}
            >
              {includedFeatures.map(feature => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon aria-hidden="true" className={clsx('h-6 w-5 flex-none', accentClasses)} />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:shrink-0">
            <div
              className={clsx(
                'rounded-2xl py-10 text-center ring-1 ring-inset lg:flex lg:flex-col lg:justify-center lg:py-16',
                secondaryBackgroundClasses,
                ringTwoClasses,
              )}
            >
              <div className="mx-auto max-w-xs px-8">
                <p className={clsx('text-base font-semibold', moreTextClasses)}>Pay once, own it forever</p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className={clsx('text-5xl font-semibold tracking-tight', textBrightestClasses)}>
                    $649
                  </span>
                  <span className={clsx('text-sm/6 font-semibold tracking-wide', moreTextClasses)}>USD</span>
                </p>
                <a href="#" className={clsx('mt-10 block w-full', buttonClasses.primary)}>
                  Get your store
                </a>
                <p className={clsx('mt-6 text-xs/5', moreTextClasses)}>
                  Invoices and receipts available for easy company reimbursement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
