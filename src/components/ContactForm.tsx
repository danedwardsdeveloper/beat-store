'use client'

import clsx from 'clsx'
import { useEffect, useState } from 'react'

import generateRandomDelay from '@/library/misc/generateRandomDelay'
import logger from '@/library/misc/logger'

import HoneyPot from '@/components/HoneyPot'

import { NotificationInterface } from '@/providers/notifications'
import { useNotifications } from '@/providers/notifications'
import { buttonClasses, formStyles } from '@/styles'
// cspell:disable
import { ContactPOSTbody, ContactPOSTresponse } from '@/types'

interface BodyWithHoneypot extends ContactPOSTbody {
  url: string
}

export default function ContactForm() {
  const { createNotification } = useNotifications()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [formDataWithHoneyPot, setFormDataWithHoneyPot] = useState({
    firstName: '',
    email: '',
    message: '',
    url: 'ToDo',
  } as BodyWithHoneypot)

  const successNotification: NotificationInterface = {
    title: 'Message sent successfully',
    message: `We'll get back to you as soon as we can`,
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target
    setFormDataWithHoneyPot(previous => ({
      ...previous,
      [name]: value,
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    if (formDataWithHoneyPot.url) {
      logger.info('Bot activity detected')
      await generateRandomDelay()
      createNotification(successNotification)
      return
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataWithHoneyPot),
      })

      const result: ContactPOSTresponse = await response.json()
      createNotification(successNotification)
      if (!response.ok) {
        return
      }
    } catch (error) {
      logger.error('Error sending message: ', error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  const formFields: Record<keyof BodyWithHoneypot, string> = {
    firstName: 'firstName',
    email: 'email',
    message: 'message',
    url: 'url',
  }
  return (
    <div className="relative isolate">
      <div className="mx-auto grid max-w-5xl grid-cols-1 lg:grid-cols-2">
        <div className="relative px-6 pb-20 pt-24 sm:pt-32 lg:static lg:px-8 lg:py-48">
          <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
            <h2 className="text-pretty text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Get in touch
            </h2>
            <p className="mt-6 text-lg/8 text-gray-300">
              Proin volutpat consequat porttitor cras nullam gravida at. Orci molestie a eu arcu. Sed ut
              tincidunt integer elementum id sem. Arcu sed malesuada et magna.
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="px-6 pb-24 sm:pb-32 lg:px-8 lg:py-48">
          <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor={formFields.firstName} className="block text-sm/6 font-semibold text-white">
                  First name
                </label>
                <div className="mt-2.5">
                  <input
                    id={formFields.firstName}
                    name={formFields.firstName}
                    type="text"
                    autoComplete="given-name"
                    value={formDataWithHoneyPot.firstName}
                    onChange={handleInputChange}
                    className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor={formFields.email} className="block text-sm/6 font-semibold text-white">
                  Email
                </label>
                <div className="mt-2.5">
                  <input
                    id={formFields.email}
                    name={formFields.email}
                    type="email"
                    autoComplete="email"
                    onChange={handleInputChange}
                    value={formDataWithHoneyPot.email}
                    className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                  />
                </div>
              </div>

              <HoneyPot value={formFields.url} onChange={handleInputChange} />

              <div className="sm:col-span-2">
                <label htmlFor={formFields.message} className="block text-sm/6 font-semibold text-white">
                  Message
                </label>
                <div className="mt-2.5">
                  <textarea
                    id={formFields.message}
                    name={formFields.message}
                    rows={4}
                    value={formDataWithHoneyPot.message}
                    onChange={handleInputChange}
                    className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <p>{errorMessage}</p>
              <button
                type="submit"
                className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Send message
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
