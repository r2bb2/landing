import { NextResponse } from "next/server"

async function getAccessToken(clientId: string, clientSecret: string): Promise<string> {
  const res = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    { method: "POST" }
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
    return NextResponse.json({ error: "Faltan variables de entorno de Twitch en .env.local" }, { status: 500 })
  }

  try {
    const token = await getAccessToken(clientId, clientSecret)
    const userId = await getUserId(username, token, clientId)

    if (!userId) {
      return NextResponse.json({ error: `No se encontró el usuario "${username}" en Twitch` }, { status: 400 })
    }

    const headers = { Authorization: `Bearer ${token}`, "Client-Id": clientId }

    // /helix/videos no devuelve game_id — usamos clips que sí lo incluyen.
    // Además pedimos el canal para obtener el juego actual del último stream.
    const [clipsRes, channelRes] = await Promise.all([
      fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${userId}&first=20`, {
        headers, next: { revalidate: 3600 },
      }),
      fetch(`https://api.twitch.tv/helix/channels?broadcaster_id=${userId}`, {
        headers, next: { revalidate: 3600 },
      }),
    ])

    const [clipsData, channelData] = await Promise.all([clipsRes.json(), channelRes.json()])

    // Contar apariciones de cada game_id
    const gameCount: Record<string, { id: string; count: number }> = {}

    // Desde clips
    for (const clip of clipsData.data ?? []) {
      if (clip.game_id && clip.game_id !== "0") {
        if (!gameCount[clip.game_id]) gameCount[clip.game_id] = { id: clip.game_id, count: 0 }
        gameCount[clip.game_id].count++
      }
    }

    // Desde el último juego del canal (si no está ya en clips, lo agregamos con count 1)
    const channelGameId: string = channelData.data?.[0]?.game_id ?? ""
    if (channelGameId && channelGameId !== "0") {
      if (!gameCount[channelGameId]) gameCount[channelGameId] = { id: channelGameId, count: 1 }
    }

    const topGames = Object.values(gameCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)

    if (topGames.length === 0) {
      return NextResponse.json({ error: "No se encontraron juegos. Probá crear clips primero en Twitch." }, { status: 404 })
    }

    // Obtener nombre y box art de cada juego
    const gameIds = topGames.map((g) => `id=${encodeURIComponent(g.id)}`).join("&")
    const gamesRes = await fetch(`https://api.twitch.tv/helix/games?${gameIds}`, {
      headers, next: { revalidate: 3600 },
    })
    const gamesData = await gamesRes.json()

    const gameDetails: Record<string, { name: string; logo: string }> = {}
    for (const game of gamesData.data ?? []) {
      gameDetails[game.id] = {
        name: game.name,
        logo: game.box_art_url
          ?.replace("{width}", "144")
          .replace("{height}", "192") ?? "",
      }
    }

    const games = topGames
      .filter((g) => gameDetails[g.id])
      .map((g) => ({
        id:    g.id,
        name:  gameDetails[g.id].name,
        logo:  gameDetails[g.id].logo,
        count: g.count,
      }))

    return NextResponse.json({ games })
  } catch (err) {
    console.error("[twitch-games]", err)
    return NextResponse.json({ error: "Error interno al obtener juegos de Twitch" }, { status: 500 })
  }
}
