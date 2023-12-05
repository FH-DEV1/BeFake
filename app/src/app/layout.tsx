import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="fr">
      <link rel="apple-touch-icon" href="/icon.png"/>
      <meta name="apple-mobile-web-app-capable" content="yes"/>
      <meta name="theme-color" content="#000"/>
      <body className="bg-black text-white">
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}
