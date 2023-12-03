import type { Metadata } from 'next'
import './globals.css'
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'FH.Dev - BeFake',
  description: "BeReal but you don't need to post to see others BeReal",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <link rel="apple-touch-icon" href="/icon.png"/>
      <meta name="apple-mobile-web-app-capable" content="yes"/>
      <meta name="theme-color" content="#000"/>
      <body className="bg-black text-white">
        <main className={roboto.className}>
          {children}
        </main>
      </body>
    </html>
  )
}
