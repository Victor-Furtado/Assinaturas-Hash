import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Plataforma de Assinatura Digital',
  description: 'Fluxo simples de assinatura digital (admin e usuário final).',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
