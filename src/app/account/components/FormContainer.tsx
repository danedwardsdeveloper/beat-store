'use client'

import clsx from 'clsx'
import Image from 'next/image'
import { ReactNode } from 'react'

import { useLocalStorage } from '@/providers/localStorage'
import { formStyles } from '@/styles'

import companyLogo80 from '@/images/icon-80.png'

const content = {
  'create-account': {
    heading: 'Create an account',
    question: 'Already a member?',
    action: 'Sign in instead',
  },
  'sign-in': {
    heading: 'Sign in to your account',
    question: 'Not a member?',
    action: 'Create an account',
  },
} as const

export default function FormContainer({
  variant,
  children,
}: {
  variant: keyof typeof content
  children: ReactNode
}) {
  const { setIsExistingUser } = useLocalStorage()
  const resolvedContent = content[variant]

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image src={companyLogo80} alt="Beat Store logo" className="size-16 rounded mx-auto" />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          {resolvedContent.heading}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {children}
        <p className="mt-10 text-center text-sm/6 text-gray-400">
          {resolvedContent.question}
          <button
            onClick={() => setIsExistingUser(variant === 'create-account')}
            className={clsx(formStyles.textButton, 'pl-2')}
          >
            {resolvedContent.action}
          </button>
        </p>
      </div>
    </div>
  )
}
