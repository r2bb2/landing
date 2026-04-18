import { NextResponse } from "next/server"

// fxtwitter es una API pública gratuita que devuelve datos estructurados de tweets
// incluyendo las imágenes, sin necesidad de API key.
// Docs: https://github.com/FixTweet/FxTwitter

function extractTweetId(url: string): string | null {
  const match = url.match(/(?:twitter\.com|x\.com)\/[^/]+\/status\/(\d+)/)
  return match ? match[1] : null
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL inválida" }, { status: 400 })
    }

    const tweetId = extractTweetId(url)
    if (!tweetId) {
      return NextResponse.json({ error: "No pude encontrar el ID del tweet en esa URL" }, { status: 400 })
    }

    // fxtwitter devuelve JSON con texto, imágenes, etc.
    const res = await fetch(`https://api.fxtwitter.com/i/status/${tweetId}`, {
      headers: { "User-Agent": "RozuVT-Admin/1.0" },
      next: { revalidate: 0 },
    })

    if (!res.ok) {
      return NextResponse.json({ error: "No se pudo obtener el tweet. ¿Es público?" }, { status: 400 })
    }

    const data = await res.json()
    const tweet = data?.tweet

    if (!tweet) {
      return NextResponse.json({ error: "Respuesta inesperada de la API" }, { status: 500 })
    }

    const text: string = tweet.text ?? ""
    const photos: { url: string; width: number; height: number }[] =
      tweet.media?.photos ?? []

    return NextResponse.json({
      text,
      images: photos.map((p) => p.url),
    })
  } catch (err) {
    console.error("[tweet-schedule]", err)
    return NextResponse.json({ error: "Error interno al procesar el tweet" }, { status: 500 })
  }
}
