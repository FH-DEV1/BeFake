import type { Metadata } from 'next'
import './globals.css'
import { Slide, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { GoogleAnalytics } from '@next/third-parties/google'
import { FeedProvider } from '@/components/FeedContext';
import { dir } from 'i18next'
import { languages } from '../i18n/settings'

export const metadata: Metadata = {
  manifest: "/public/manifest.json",
  title: 'FH.Dev - BeFake',
  description: "BeReal but you don't need to post to see others BeReal",
  themeColor: "#000",
}

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}

export default function RootLayout({
  children,
  params: {
    lng
  }
}: {
  children: React.ReactNode,
  params: { lng: string }
}) {
  return (
    <html lang={lng} dir={dir(lng)}>
      <head>
        <meta name="theme-color" content="#000" />
      </head>
      <body className="bg-black text-white">
        <main>
          <FeedProvider>
          <GoogleAnalytics gaId="G-D65HGX91EP" />
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
            pauseOnHover={false}
            theme="dark"
            transition={Slide}
            stacked
          />
          {children}
          </FeedProvider>
        </main>
      </body>
    </html>
  )
}
