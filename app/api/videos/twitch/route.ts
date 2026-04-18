import { NextResponse } from "next/server"

export interface TwitchVideo {
  id: string
  title: string
  thumbnail: string
  url: string
  publishedAt: string
  views: string
  type: "clip" | "vod"
  duration?: string
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.TWITCH_CLIENT_ID!
  const clientSecret = process.env.TWITCH_CLIENT_SECRET!

  const res = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    { method: "POST", next: { revalidate: 3600 * 24 } }
  )

  if (!res.ok) throw new Error("No se pudo obtener el token de Twitch")
  const data = await res.json()
  return data.access_token
}

async function getUserId(username: string, token: string, clientId: string): Promise<string> {
  const res = await fetch(`https://api.twitch.tv/helix/users?login=${username}`, {
    headers: { Authorization: `Bearer ${token}`, "Client-Id": clientId },
    next: { revalidate: 3600 * 24 },
  })
  const data = await res.json()
  return data.data?.[0]?.id ?? ""
}

export async function GET() {
  const clientId = process.env.TWITCH_CLIENT_ID
  const clientSecret = process.env.TWITCH_CLIENT_SECRET
  const username = process.env.TWITCH_USERNAME

  if (!clientId || !clientSecret || !username) {
    return NextResponse.json(
      { error: "Faltan variables de entorno de Twitch en .env.local" },
      { status: 500 }
    )
  }

  try {
    const token = await getAccessToken()
    const userId = await getUserId(username, token, clientId)

    if (!userId) {
      return NextResponse.json({ error: `No se encontró el usuario "${username}" en Twitch` }, { status: 400 })
    }

    const headers = { Authorization: `Bearer ${token}`, "Client-Id": clientId }

    // Clips y VODs en paralelo
    const [clipsRes, vodsRes] = await Promise.all([
      fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${userId}&first=6`, {
        headers, next: { revalidate: 3600 },
      }),
      fetch(`https://api.twitch.tv/helix/videos?user_id=${userId}&first=6&type=archive`, {
        headers, next: { revalidate: 3600 },
      }),
    ])

    const [clipsData, vodsData] = await Promise.all([clipsRes.json(), vodsRes.json()])

    const clips: TwitchVideo[] = (clipsData.data ?? []).map((c: any) => ({
      id: c.id,
      title: c.title,
      thumbnail: c.thumbnail_url,
      url: c.url,
      publishedAt: c.created_at,
      views: Number(c.view_count).toLocaleString(),
      type: "clip" as const,
      duration: `${c.duration}s`,
    }))

    const vods: TwitchVideo[] = (vodsData.data ?? []).map((v: any) => ({
      id: v.id,
      title: v.title,
      thumbnail: v.thumbnail_url?.replace("%{width}", "640").replace("%{height}", "360") ?? "",
      url: v.url,
      publishedAt: v.published_at,
      views: Number(v.view_count).toLocaleString(),
      type: "vod" as const,
      duration: v.duration,
    }))

    return NextResponse.json({ clips, vods })
  } catch (err) {
    console.error("[twitch]", err)
    return NextResponse.json({ error: "Error interno al obtener videos de Twitch" }, { status: 500 })
  }
}
