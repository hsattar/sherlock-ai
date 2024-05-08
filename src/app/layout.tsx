import type { Metadata } from "next"
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css"

export const metadata: Metadata = {
  title: "Sherlock AI",
  description: "Sherlock AI Coach",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
    <html lang="en" data-theme="light">
      <body>{children}</body>
    </html>
    </ClerkProvider>
  )
}