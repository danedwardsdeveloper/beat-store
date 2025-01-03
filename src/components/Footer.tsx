'use client'

import Link from 'next/link'

import { footerIcons } from '@/components/icons'

export default function Footer() {
  return (
    <footer className="bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center gap-x-6 md:order-2">
          {footerIcons.map(item => (
            <Link
              key={item.name}
              href={item.href}
              onClick={event => event.preventDefault()}
              className="text-zinc-400 hover:text-zinc-300 active:text-zinc-200 transition-colors duration-300"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon aria-hidden="true" className="size-6" />
            </Link>
          ))}
        </div>
        <p className="mt-8 text-center text-sm/6 text-zinc-400 md:order-1 md:mt-0">
          © {new Date().getFullYear()}{' '}
          <Link href="https://danedwardsdeveloper.com" className="text-zinc-300 hover:text-zinc-200">
            Dan Edwards
          </Link>
          . All rights reserved.
        </p>
      </div>
    </footer>
  )
}
