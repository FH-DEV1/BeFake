import type { Metadata } from 'next'
import './globals.css'
import { Slide, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { FeedProvider } from '@/components/FeedContext';

export const metadata: Metadata = {
  manifest: "/manifest.json",
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
      <body className="bg-black text-white">
        <main>
          <FeedProvider>
          <SpeedInsights/>
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
