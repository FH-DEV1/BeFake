import type { Metadata } from 'next'
import './globals.css'
import { Slide, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

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
          />
          {children}
        </main>
      </body>
    </html>
  )
}
