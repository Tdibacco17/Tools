import './globals.css'
import FooterComponent from '@/components/FooterComponent/FooterComponent'
import { roboto } from '@/utils/Fonts'
import GoogleProvider from './Provider'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cerro motor',
  description: 'Cerro motor',
  applicationName: 'Cerro motor',
  viewport: 'width=device-width, initial-scale=1',
  colorScheme: 'light',
  themeColor: '#000000',
  authors: {
    name: '25Watts',
    url: 'https://25watts.com.ar/'
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <GoogleProvider>
          {children}
          <FooterComponent />
        </GoogleProvider>
      </body>
    </html>
  )
}
