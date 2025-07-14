'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RegistrationPage() {
  const router = useRouter()

  // Redirect to the first step of registration
  useEffect(() => {
    router.push('/register/email')
  }, [router])

  return null // This will redirect immediately
}