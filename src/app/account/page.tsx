'use client'

import { useEffect } from 'react'

import CreateAccountForm from './components/forms/CreateAccountForm'
import SignInForm from './components/forms/SignInForm'
import SignedInAccountPage from './components/SignedInAccountPage'

import { useLocalStorage } from '@/providers/localStorage'
import { useUi } from '@/providers/ui'

export default function AccountPage() {
  const { uiSignedIn } = useUi()
  const { isExistingUser } = useLocalStorage()

  useEffect(() => {
    if (uiSignedIn) {
      document.title = 'Account | Beat Store'
    } else if (isExistingUser) {
      document.title = 'Sign in | Beat Store'
    } else {
      document.title = 'Create an account | Beat Store'
    }
  }, [uiSignedIn, isExistingUser])

  if (uiSignedIn) {
    return <SignedInAccountPage />
  }

  if (isExistingUser) {
    return <SignInForm />
  }

  return <CreateAccountForm />
}
