# Contact form

- Button is disabled but says 'Send message'
- Fill out form...
- Live feedback about illegal characters

contactFormState: 'disabled' | 'ready' | 'loading' | 'success' | 'error'
errorMessage: string | null

'disabled' | 'ready' | 'error': 'Send message'
'success': 'Message sent (tick)'
'loading': <Spinner />

Inputs: Can they be disabled?
