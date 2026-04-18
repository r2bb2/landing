import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import "./globals.css"
import { Poppins } from "next/font/google"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
})

// ── Cambiá estas variables con tus datos reales ──────────────────────────────
const SITE_URL = "https://rozuvt.com"           // tu dominio real
const SITE_NAME = "RozuVT"
const TWITTER_HANDLE = "@rozu_vt"
const OG_IMAGE = `${SITE_URL}/og-image.png`    // imagen 1200×630px en /public/
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "RozuVT — Kitsune VTuber from Argentina 🦊",
    template: "%s · RozuVT",
  },
  description:
    "Soy Rozu, una kitsune VTuber argentina. Streams de gaming cozy, arte y muchísima magia rosa. ¡Únete a la manada! 🌸✨",
  keywords: [
    "RozuVT",
    "Rozu VTuber",
    "VTuber Argentina",
    "kitsune vtuber",
    "vtuber español",
    "streaming twitch argentina",
    "vtuber latina",
  ],
  authors: [{ name: "RozuVT", url: SITE_URL }],
  creator: "RozuVT",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "RozuVT — Kitsune VTuber from Argentina 🦊",
    description:
      "Soy Rozu, una kitsune VTuber argentina. Streams de gaming cozy, arte y muchísima magia rosa. ¡Únete a la manada! 🌸✨",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "RozuVT — Kitsune VTuber Argentina",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: "RozuVT — Kitsune VTuber from Argentina 🦊",
    description:
      "Soy Rozu, una kitsune VTuber argentina. Streams de gaming cozy, arte y muchísima magia rosa. ¡Únete a la manada!",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: SITE_URL,
  },
  // Elimina el "generator: v0.dev" que estaba antes — no debe estar en producción
}

// JSON-LD structured data — ayuda a Google a entender que esto es una página de creador
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "RozuVT",
  alternateName: "Rozu",
  description:
    "Kitsune VTuber argentina. Streaming de gaming cozy, arte y magia rosa.",
  url: SITE_URL,
  image: OG_IMAGE,
  sameAs: [
    "https://twitch.tv/rozuVT",
    "https://twitter.com/rozu_vt",
    "https://youtube.com/@rozuvt",
  ],
  jobTitle: "Content Creator / VTuber",
  nationality: "Argentine",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${poppins.variable} font-poppins`}>
      <head>
        {/* Favicon — agregá estos archivos en /public/ */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#e5689c" />
      </head>
      <body>
        {children}
        {/* JSON-LD structured data */}
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  )
}
