import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Neon Lab — Cyberpunk Audio Visualizer',
  description: 'An interactive cyberpunk particle sandbox and synthesized audio visualizer by Harish Malviya.',
  generator: 'v0.dev',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#050611',
  userScalable: true,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
