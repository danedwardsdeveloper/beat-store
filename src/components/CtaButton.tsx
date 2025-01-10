'use client'

import clsx from 'clsx'

import { useNotifications } from '@/providers/notifications'

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
  const { createNotification } = useNotifications()
  const isPrimary = variant === 'primary'
  const data = variantData[variant]

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    createNotification({
      title: 'Work in progress',
      message: `I haven't made that part of the site yet!`,
      level: 'info',
    })
  }

  return (
    <button
      onClick={handleClick}
      className={clsx(
        isPrimary ? 'button-primary' : 'button-secondary', //
        'block w-full',
        classes,
      )}
    >
      {data.text}
    </button>
  )
}
