import clsx from 'clsx'
import Link from 'next/link'

const variantData = {
  primary: {
    href: '/',
    text: 'Get your store',
  },
  secondary: {
    href: '/',
    text: 'Learn more',
  },
} as const

export default function CtaButton({
  variant,
  classes,
}: {
  variant: 'primary' | 'secondary'
  classes?: string
}) {
  const isPrimary = variant === 'primary'
  const data = variantData[variant]

  return (
    <Link
      href={data.href}
      className={clsx(
        isPrimary ? 'button-primary' : 'button-secondary', //
        'block w-full',
        classes,
      )}
    >
      {data.text}
    </Link>
  )
}
