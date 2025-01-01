'use client'

import clsx from 'clsx'
import { useEffect, useState } from 'react'

import logger from '@/library/misc/logger'

import { buttonClasses, inputStyles } from '../../styles/styles'
import { contactFormRequirements, ContactPOSTbody, ContactPOSTresponse } from '@/app/api/contact/route'
import { useNotifications } from '@/providers/notifications'

const formFields: Record<keyof ContactPOSTbody, string> = {
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  message: 'message',
}

export default function ContactForm() {
  const { createNotification } = useNotifications()
  const [loading, setLoading] = useState(false)
  const [responseError, setResponseError] = useState<ContactPOSTresponse['message'] | null>(null)
  const [uiError, setUiError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formReady, setFormReady] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  } as ContactPOSTbody)

  useEffect(() => {
    setFormReady(
      !loading &&
        formData.firstName.trim() !== '' &&
        formData.lastName.trim() !== '' &&
        formData.email.trim() !== '' &&
        formData.message.trim() !== '',
    )
  }, [loading, formData])

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target
    setFormData(previous => ({
      ...previous,
      [name]: value,
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setResponseError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result: ContactPOSTresponse = await response.json()

      if (!response.ok) {
        setResponseError(result.message)
        return
      }

      setSuccess(true)
      createNotification({
        title: 'Message sent successfully',
        message: `We'll get back to you as soon as we can`,
      })
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        message: '',
      })
      setFormData({ firstName: '', lastName: '', email: '', message: '' })
    } catch (error) {
      logger.error('Error sending message: ', error instanceof Error ? error.message : 'Unknown error')
      setResponseError('server error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto my-16 flex flex-col gap-y-4">
      <div className="flex justify-between items-center">
        <label htmlFor={formFields.firstName}>First name</label>
        <input
          type="text"
          id={formFields.firstName}
          name={formFields.firstName}
          value={formData.firstName}
          onChange={handleInputChange}
          required
          maxLength={contactFormRequirements.maxNameLength}
          className={inputStyles.base}
        />
      </div>

      <div className="flex justify-between items-center">
        <label htmlFor={formFields.lastName}>Last name</label>
        <input
          type="text"
          id={formFields.lastName}
          name={formFields.lastName}
          value={formData.lastName}
          onChange={handleInputChange}
          required
          maxLength={contactFormRequirements.maxNameLength}
          className={inputStyles.base}
        />
      </div>

      <div className="flex justify-between items-center">
        <label htmlFor={formFields.email}>Email</label>
        <input
          type={formFields.email}
          id={formFields.email}
          name={formFields.email}
          value={formData.email}
          onChange={handleInputChange}
          required
          className={inputStyles.base}
        />
      </div>

      <div className="flex justify-between items-center">
        <label htmlFor={formFields.message}>Message</label>
        <textarea
          id={formFields.message}
          name={formFields.message}
          value={formData.message}
          onChange={handleInputChange}
          required
          maxLength={contactFormRequirements.maxMessageLength}
          className={inputStyles.base}
        ></textarea>
      </div>

      <div className="max-w-xs mx-auto w-full">
        <button
          type="submit"
          disabled={!formReady}
          className={clsx(
            buttonClasses.primary.base,
            !formReady ? buttonClasses.disabled : buttonClasses.primary.active,
          )}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>

      {uiError && <p>{uiError}</p>}
      {success && <p>Message sent successfully</p>}
    </form>
  )
}
