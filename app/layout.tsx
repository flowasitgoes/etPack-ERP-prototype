import type { Metadata } from 'next'
import './globals.css'
import { Navigation } from '@/components/navigation'

export const metadata: Metadata = {
  title: 'etPack ERP - 企業資源規劃系統',
  description: '包裝製造業ERP系統',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-TW">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  )
}
