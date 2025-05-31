'use client'
import { useState, useEffect } from 'react'

export default function TestPage() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    fetch('/api/test')
      .then(res => res.json())
      .then(data => setMessage(data.message))
  }, [])

  return (
    <main>
      <h1>{message}</h1>
    </main>
  )
}
