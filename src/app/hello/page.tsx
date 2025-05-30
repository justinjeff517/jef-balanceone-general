'use client'
import { useState, useEffect } from 'react'

export default function HelloPage() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message))
  }, [])

  return (
    <main>
      <h1>{message}</h1>
    </main>
  )
}
