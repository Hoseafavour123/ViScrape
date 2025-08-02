import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AppProviders from '@/components/providers/AppProviders'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ViScrape',
  description: 'AI powered web scraping tool',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/sign-in">
      <html lang="en">
        <body className={inter.className}>
          <AppProviders>{children}</AppProviders>
        </body>
      </html>
    </ClerkProvider>
  )
}
