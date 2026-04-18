import { NextResponse } from "next/server"

export interface YoutubeVideo {
  id: string
  title: string
  thumbnail: string
  url: string
  publishedAt: string
  views: string
}

export async function GET() {
  const channelId = process.env.YOUTUBE_CHANNEL_ID
  if (!channelId) {
    return NextResponse.json({ error: "YOUTUBE_CHANNEL_ID no configurado en .env.local" }, { status: 500 })
  }

  try {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
    const res = await fetch(rssUrl, { next: { revalidate: 3600 } }) // cache 1h

    if (!res.ok) {
      return NextResponse.json({ error: "No se pudo obtener el feed de YouTube. ¿El Channel ID es correcto?" }, { status: 400 })
    }

    const xml = await res.text()

    // Parse manual del XML (sin dependencias)
    const entries = xml.split("<entry>").slice(1)

    const videos: YoutubeVideo[] = entries.slice(0, 6).map((entry) => {
      const getId = (tag: string) => entry.match(new RegExp(`<${tag}[^>]*>([^<]+)<\/${tag}>`))?.[1] ?? ""
      const getAttr = (tag: string, attr: string) => entry.match(new RegExp(`<${tag}[^>]*${attr}="([^"]+)"`))?.[1] ?? ""

      const videoId = entry.match(/videos\/([^<"]+)/)?.[1] ?? ""
      const title = getId("title").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "'").replace(/&quot;/g, '"')
      const published = getId("published")
      const views = getAttr("media:statistics", "views")

      return {
        id: videoId,
        title,
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        publishedAt: published,
        views: views ? Number(views).toLocaleString() : "",
      }
    })

    return NextResponse.json({ videos })
  } catch (err) {
    console.error("[youtube]", err)
    return NextResponse.json({ error: "Error interno al obtener videos de YouTube" }, { status: 500 })
  }
}
