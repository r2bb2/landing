import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Nunito } from "next/font/google"

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
})

export const metadata: Metadata = {
  title: "RozuVT - Kitsune VTuber from Argentina",
  description: "Turning your world pink with magic and mischief 🌸",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${nunito.variable} font-nunito`}>
      <body>{children}</body>
    </html>
  )
}
