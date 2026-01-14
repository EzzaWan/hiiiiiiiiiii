import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | hiiiiiiiiiii.com',
  description: 'Privacy Policy for Human Intelligence Studio Limited. Learn how we collect, use, and protect your data.',
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}






