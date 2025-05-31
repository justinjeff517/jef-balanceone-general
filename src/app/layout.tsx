// app/layout.tsx
import React, { ReactNode } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
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


  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      
          {children}
    
      </body>
    </html>
  )
}
