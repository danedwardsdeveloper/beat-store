import clsx from 'clsx'
import Link from 'next/link'

import { buttonClasses } from '@/app/(front-end)/styles/styles'

export default function CtaButton() {
  return (
    <div className="max-w-xs mx-auto w-full px-8">
      <Link href="/" className={clsx(buttonClasses.primary, 'block w-full')}>
        Get your store
      </Link>
    </div>
  )
}
