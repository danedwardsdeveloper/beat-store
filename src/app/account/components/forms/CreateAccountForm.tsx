'use client'

import clsx from 'clsx'

import CheckBox from '../CheckBox'
import FormContainer from '../FormContainer'
import { buttonClasses, formStyles } from '@/styles'

export default function CreateAccountForm() {
  return (
    <FormContainer variant="create-account">
      <form action="#" method="POST" className="space-y-6">
        <div>
          <label htmlFor="name" className={formStyles.label.main}>
            First name
          </label>
          <div className="mt-2">
            <input
              id="name"
              name="name"
              type="name"
              required
              autoComplete="given-name"
              className={formStyles.inputs}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className={formStyles.label.main}>
            Email address
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={formStyles.inputs}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className={formStyles.label.main}>
              Password
            </label>
          </div>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              className={formStyles.inputs}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex h-6 shrink-0 items-center">
            <div className="group grid size-4 grid-cols-1">
              <input id="staySignedIn" name="staySignedIn" type="checkbox" className={formStyles.checkbox} />
              <CheckBox />
            </div>
          </div>
          <label htmlFor="staySignedIn" className={formStyles.label.subtle}>
            Remember me
          </label>
        </div>

        <div className="flex gap-3">
          <div className="flex h-6 shrink-0 items-center">
            <div className="group grid size-4 grid-cols-1">
              <input
                id="marketingEmails"
                name="marketingEmails"
                type="checkbox"
                className={formStyles.checkbox}
              />
              <CheckBox />
            </div>
          </div>
          <label htmlFor="marketingEmails" className={formStyles.label.subtle}>
            Subscribe to our newsletter
          </label>
        </div>

        <div>
          <button
            type="submit"
            className={clsx(buttonClasses.base, buttonClasses.primary.base, buttonClasses.primary.active)}
          >
            Create account
          </button>
        </div>
      </form>
    </FormContainer>
  )
}
