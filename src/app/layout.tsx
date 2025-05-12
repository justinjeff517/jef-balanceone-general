// app/layout.tsx
import React, { ReactNode } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { getServerSession } from 'next-auth/next'
import type { NextAuthOptions, Session } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import { Providers } from './providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

interface RootLayoutProps {
  children: ReactNode
}

export const metadata = {
  title: 'My App',
  description: 'Example Next.js + TypeScript layout',
}

export default async function RootLayout({
  children,
}: RootLayoutProps): Promise<JSX.Element> {
  const session: Session | null = await getServerSession(
    authOptions as NextAuthOptions
  )

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
