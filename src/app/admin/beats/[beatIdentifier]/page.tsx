'use client'

import { Beat, MusicalKeyLetter, Tonality } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'

import { BeatsResponseGET, BeatsResponsePATCH } from '@/app/api/admin/beats/[beatIdentifier]/route'

export default function AdminBeatPage({ params }: { params: Promise<{ beatIdentifier: string }> }) {
  const unwrappedParams = use(params)
  const router = useRouter()
  const { beatIdentifier } = unwrappedParams
  const [message, setMessage] = useState<string>('')
  const [formState, setFormState] = useState<Beat | undefined>()

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`/api/admin/beats/${beatIdentifier}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const data: BeatsResponseGET = await response.json()
        setFormState(data.beat)
      } catch (error) {
        console.error('Error fetching initial beat data:', error)
        setMessage('Error loading beat data')
      }
    }

    fetchInitialData()
  }, [beatIdentifier])

  const handleSave = async () => {
    if (!formState) return
    const { id, ...updatedData } = formState
    try {
      const response = await fetch(`/api/admin/beats/${beatIdentifier}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })
      const { message, updatedBeat }: BeatsResponsePATCH = await response.json()
      setMessage(message)
      setFormState(updatedBeat)

      if (updatedBeat?.slug) {
        router.replace(`/admin/beats/${updatedBeat?.slug}`)
      }
    } catch (error) {
      console.error('Error updating beat:', error)
      setMessage('Error saving beat data')
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormState(prev =>
      prev
        ? {
            ...prev,
            [name]: event.target.type === 'number' ? Number(value) || null : value,
          }
        : undefined,
    )
  }

  const handleDescriptionChange = (index: number, value: string) => {
    if (!formState) return

    const newDescription = [...formState.description]
    newDescription[index] = value

    setFormState({
      ...formState,
      description: newDescription,
    })
  }

  const addDescriptionLine = () => {
    if (!formState) return

    setFormState({
      ...formState,
      description: [...formState.description, ''],
    })
  }

  const removeDescriptionLine = (index: number) => {
    if (!formState) return

    const newDescription = formState.description.filter((_, i) => i !== index)
    setFormState({
      ...formState,
      description: newDescription,
    })
  }

  return (
    <>
      <h1>{formState?.title || 'Admin beat page'}</h1>

      <div>
        <span>Title</span>
        <input type="text" name="title" value={formState?.title || ''} onChange={handleInputChange} />
      </div>

      <div>
        <span>MetaTitle</span>
        <input
          type="text"
          name="metaTitle"
          value={formState?.metaTitle || ''}
          onChange={handleInputChange}
          maxLength={70}
          minLength={30}
        />
      </div>

      <div>
        <span>Slug</span>
        <input
          type="text"
          name="slug"
          value={formState?.slug || ''}
          onChange={handleInputChange}
          maxLength={70}
          minLength={30}
        />
      </div>

      <div>
        <span>Description</span>
        {formState?.description.map((descriptionLine, index) => (
          <div key={index}>
            <input
              type="text"
              value={descriptionLine}
              onChange={event => handleDescriptionChange(index, event.target.value)}
            />
            <button onClick={() => removeDescriptionLine(index)}>Remove</button>
          </div>
        ))}
        <button onClick={addDescriptionLine}>Add description line</button>
      </div>

      <div>
        <span>MetaDescription</span>
        <input
          type="text"
          name="metaDescription"
          value={formState?.metaDescription || ''}
          onChange={handleInputChange}
          minLength={70}
          maxLength={155}
        />
      </div>

      <div>
        <span>BPM</span>
        <input
          type="number"
          name="bpm"
          max={300}
          min={20}
          value={formState?.bpm || ''}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <span>Key letter</span>
        <select
          name="musicalKeyLetter"
          value={formState?.musicalKeyLetter || ''}
          onChange={event => handleInputChange(event)}
        >
          <option value="">Select letter</option>
          <option value={'A' as MusicalKeyLetter}>A</option>
          <option value={'B' as MusicalKeyLetter}>B</option>
          <option value={'C' as MusicalKeyLetter}>C</option>
          <option value={'D' as MusicalKeyLetter}>D</option>
          <option value={'E' as MusicalKeyLetter}>E</option>
          <option value={'F' as MusicalKeyLetter}>F</option>
          <option value={'G' as MusicalKeyLetter}>G</option>
        </select>
      </div>

      <div>
        <span>Tonality</span>
        <select
          name="tonality"
          value={formState?.tonality || ''}
          onChange={event => handleInputChange(event)}
        >
          <option value="">Select tonality</option>
          <option value={'major' as Tonality}>Major</option>
          <option value={'minor' as Tonality}>Minor</option>
          <option value={'modal' as Tonality}>Modal</option>
        </select>
      </div>

      <button onClick={handleSave}>Save beat information</button>

      <h2>Uploads</h2>
      <div>
        <span>Photo</span>
        <form></form>
      </div>

      {message && <p>{`Message: ${message}`}</p>}
    </>
  )
}
