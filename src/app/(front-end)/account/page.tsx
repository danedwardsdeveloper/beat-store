'use client'

import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

import { buttonClasses, formStyles, inputStyles } from '@/app/(front-end)/styles/styles'

import companyLogo from '@/images/icon-80.png'

export default function AccountPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image src={companyLogo} alt="Beat Store logo" className="size-16 rounded mx-auto" />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form action="#" method="POST" className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-white">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className={inputStyles.base}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium text-white">
                Password
              </label>
              <div className="text-sm">
                <button onClick={() => null} className={formStyles.text.accent}>
                  Forgot password?
                </button>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className={inputStyles.base}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className={clsx(buttonClasses.base, buttonClasses.primary.base, buttonClasses.primary.active)}
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-400">
          Not a member?{' '}
          <Link href="#" className={formStyles.text.accent}>
            Start a 14 day free trial
          </Link>
        </p>
      </div>
    </div>
  )
}
