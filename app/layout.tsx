import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'hiiiiiiiiiii.com | Human Intelligence Labs',
  description: 'The most artificial Human Intelligence on the web. We build cool sh*t using the robots you fear.',
  keywords: ['AI', 'Human Intelligence', 'Software Development', 'Cyberpunk', 'Studio Labs'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="crt-screen">
        {children}
      </body>
    </html>
  )
}

