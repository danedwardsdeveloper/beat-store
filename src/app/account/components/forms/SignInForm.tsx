import clsx from 'clsx'
import { useState } from 'react'

import generateRandomDelay from '@/library/misc/generateRandomDelay'
import logger from '@/library/misc/logger'

import Honeypot from '@/components/HoneyPot'

import CheckBox from '../CheckBox'
import FormContainer from '../FormContainer'
import { SignInPOSTbody, SignInPOSTresponse } from '@/app/api/auth/sign-in/route'
import { useLocalStorage } from '@/providers/localStorage'
import { useUi } from '@/providers/ui'
import { formStyles } from '@/styles'

type FormDataWithHoneyPot = SignInPOSTbody & {
  website: string
}

export default function SignInForm() {
  const { setUiSignedIn } = useUi()
  const { prefersStaySignedIn, setPrefersStaySignedIn } = useLocalStorage()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorCount, setErrorCount] = useState(0)

  const [bodyWithHoneyPot, setBodyWithHoneyPot] = useState<FormDataWithHoneyPot>({
    email: 'daniel.edwards96@yahoo.com',
    password: 'securePassword',
    staySignedIn: prefersStaySignedIn,
    website: '',
  })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setIsLoading(true)

      if (bodyWithHoneyPot.website) {
        logger.info('Potential spam submission detected')
        await generateRandomDelay()
        return
      }

      const { website, ...requestWithoutHoneyPot } = bodyWithHoneyPot

      const response = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestWithoutHoneyPot),
      })

      const data: SignInPOSTresponse = await response.json()

      if (!response.ok) {
        setUiSignedIn(false)
        let baseErrorMessage: string

        switch (data.message) {
          case 'email missing':
            baseErrorMessage = 'Please enter your email'
            break
          case 'password missing':
            baseErrorMessage = 'Please enter your password'
            break
          case 'invalid credentials':
            baseErrorMessage = 'Incorrect email or password'
            break
          default:
            baseErrorMessage = 'An error occurred. Please try again'
        }

        const newCount = baseErrorMessage === error?.replace(/ \(\d+\)$/, '') ? errorCount + 1 : 1

        setError(newCount > 1 ? `${baseErrorMessage} (${newCount})` : baseErrorMessage)
        setErrorCount(newCount)
      } else {
        setUiSignedIn(true)
        setError(null)
        setErrorCount(0)
      }
    } finally {
      setIsLoading(false)
    }
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    setBodyWithHoneyPot(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target
    setBodyWithHoneyPot(prev => ({
      ...prev,
      staySignedIn: checked,
    }))
    setPrefersStaySignedIn(checked)
  }

  function handleForgotPasswordClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    // handle forgotten password
  }

  return (
    <FormContainer variant="sign-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className={formStyles.label.main}>
            Email address
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className={formStyles.inputs}
              value={bodyWithHoneyPot.email}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className={formStyles.label.main}>
            Password
          </label>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className={formStyles.inputs}
              value={bodyWithHoneyPot.password}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <div className="flex h-6 shrink-0 items-center">
              <div className="group grid size-4 grid-cols-1">
                <input
                  id="staySignedIn"
                  name="staySignedIn"
                  type="checkbox"
                  className={formStyles.checkbox}
                  checked={bodyWithHoneyPot.staySignedIn}
                  onChange={handleCheckboxChange}
                />
                <CheckBox />
              </div>
            </div>
            <label htmlFor="staySignedIn" className={formStyles.label.subtle}>
              Stay signed in
            </label>
          </div>

          <div className="text-sm/6">
            <button onClick={handleForgotPasswordClick} className={formStyles.textButton}>
              Forgot password?
            </button>
          </div>
        </div>

        <Honeypot value={bodyWithHoneyPot.website} onChange={handleInputChange} />

        <div>
          <button type="submit" className="button-primary w-full">
            {isLoading ? 'Loading...' : 'Sign in'}
          </button>
        </div>

        {error && (
          <div>
            <span className="text-red-400">{error}</span>
          </div>
        )}
      </form>
    </FormContainer>
  )
}
