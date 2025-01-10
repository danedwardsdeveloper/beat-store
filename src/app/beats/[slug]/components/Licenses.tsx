'use client'

import { Radio, RadioGroup } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { LicenseType } from '@prisma/client'
import { useState } from 'react'

import { defaultPrices } from '@/library/beats/prices'
import { capitalizeFirstLetter } from '@/library/formatting/capitaliseFirstLetter'
import formatPrice from '@/library/formatting/formatPrice'

import AddToCartButton from '../../components/AddToCartButton'

import { PublicBeatWithAssets } from '@/types'

type LicenseOptions = {
  [key in LicenseType]: {
    id: number
    description: string
    price: number
  }
}

const licenseOptions: LicenseOptions = {
  [LicenseType.basic]: {
    id: 1,
    description: 'Untagged MP3',
    price: defaultPrices.basic,
  },
  [LicenseType.premium]: {
    id: 2,
    description: 'WAV file',
    price: defaultPrices.premium,
  },
  [LicenseType.unlimited]: {
    id: 3,
    description: 'WAV file & unlimited usage',
    price: defaultPrices.unlimited,
  },
  [LicenseType.exclusive]: {
    id: 4,
    description: 'WAV, stems & exclusive rights',
    price: defaultPrices.exclusive,
  },
}

export default function Licenses({ beat }: { beat: PublicBeatWithAssets }) {
  const [selectedLicenseOption, setSelectedLicenseOption] = useState<LicenseType>(LicenseType.premium)

  return (
    <>
      <div className="col-span-9 grid grid-cols-1 gap-4">
        <fieldset>
          <legend className="text-sm/6 font-semibold text-zinc-200">Select a license</legend>
          <RadioGroup
            value={licenseOptions[selectedLicenseOption]}
            onChange={option => {
              const type = Object.entries(licenseOptions).find(
                ([_, opt]) => opt === option,
              )?.[0] as LicenseType
              setSelectedLicenseOption(type)
            }}
            className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4"
          >
            {Object.entries(licenseOptions).map(([type, option]) => (
              <Radio
                key={option.id}
                value={option}
                aria-label={type}
                className="group relative flex cursor-pointer rounded-lg border border-zinc-500 bg-white/5 p-4 shadow-sm focus:outline-none data-[focus]:border-indigo-600 data-[focus]:ring-2 data-[focus]:ring-indigo-600 transition-colors duration 300"
              >
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-zinc-100">
                      {capitalizeFirstLetter(type)}
                    </span>
                    <span className="mt-1 flex items-center text-sm text-zinc-300">{option.description}</span>
                    <span className="mt-6 text-sm font-medium text-zinc-100">
                      {formatPrice(option.price)}
                    </span>
                  </span>
                </span>
                <CheckCircleIcon
                  aria-hidden="true"
                  className="size-5 text-indigo-600 group-[&:not([data-checked])]:invisible"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent group-data-[focus]:border group-data-[checked]:border-indigo-600"
                />
              </Radio>
            ))}
          </RadioGroup>
        </fieldset>
      </div>

      <div className="mt-16 max-w-sm mx-auto">
        <AddToCartButton id={beat.id} license={selectedLicenseOption} />
      </div>
    </>
  )
}
