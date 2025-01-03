import { CheckIcon } from '@heroicons/react/20/solid'

import { marketingCopy } from '@/library/misc/marketingCopy'

import CtaButton from './CtaButton'

export default function Pricing() {
  return (
    <div data-component="Pricing" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl sm:text-center">
          <h2 className="text-pretty text-5xl font-semibold tracking-tight sm:text-balance sm:text-6xl text-zinc-100">
            {marketingCopy.pricing.titles.sectionTitle}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg font-medium sm:text-xl/8 text-zinc-400">
            {marketingCopy.pricing.intros.sectionIntro}
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none ring-zinc-700">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <h3 className="text-3xl font-semibold tracking-tight text-zinc-100">
              {marketingCopy.pricing.titles.cardTitle}
            </h3>
            <p className="mt-6 text-base/7 text-zinc-400">{marketingCopy.pricing.intros.cardIntro}</p>
            <div className="mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-sm/6 font-semibold text-indigo-500">
                {marketingCopy.pricing.whatsIncluded.title}
              </h4>
              <div className="h-px flex-auto bg-zinc-700" />
            </div>
            <ul
              role="list"
              className="mt-8 grid grid-cols-1 gap-4 text-sm/6 sm:grid-cols-2 sm:gap-6',
                'text-zinc-400"
            >
              {marketingCopy.pricing.whatsIncluded.items.map(feature => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon aria-hidden="true" className="h-6 w-5 flex-none text-indigo-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:shrink-0">
            <div className="rounded-2xl py-10 text-center ring-1 ring-inset lg:flex lg:flex-col lg:justify-center lg:py-16 ring-gray-900/5">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-zinc-400">{marketingCopy.pricing.extras[0]}</p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-semibold tracking-tight text-zinc-100">
                    {marketingCopy.pricing.usdPriceString}
                  </span>
                  <span className="text-sm/6 font-semibold tracking-wide text-zinc-400">USD</span>
                </p>
                <CtaButton variant={'primary'} classes="mt-10" />
                <p className="mt-6 text-xs/5 text-zinc-400">{marketingCopy.pricing.extras[1]}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
