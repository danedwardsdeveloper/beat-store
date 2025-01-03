import clsx from 'clsx'
import Link from 'next/link'

import { buttonClasses } from '@/styles'

const variantData = {
  primary: {
    // href: 'https://www.upwork.com/',
    href: '/',
    text: 'Get your store',
    classes: clsx(buttonClasses.base, buttonClasses.primary.base, buttonClasses.primary.active),
  },
  secondary: {
    // href: '/articles/learn-more',
    href: '/',
    text: 'Learn more',
    classes: clsx(buttonClasses.base, buttonClasses.secondary.base, buttonClasses.secondary.active),
  },
} as const

export default function CtaButton({
  variant,
  classes,
}: {
  variant: 'primary' | 'secondary'
  classes?: string
}) {
  const data = variantData[variant]

  return (
    <Link href={data.href} className={clsx(data.classes, 'block w-full', classes)}>
      {data.text}
    </Link>
  )
}
