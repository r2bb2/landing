import { NextResponse } from "next/server"

export async function POST(request: Request) {
  // Dummy implementation – replace with real logic when ready
  const { name } = await request.json()

  // Create a pseudo-random 4-digit ID
  const cardId = Math.floor(1000 + Math.random() * 9000)

  return NextResponse.json({
    success: true,
    cardId,
    message: `Card for ${name ?? "Anon"} generated!`,
  })
}

// Optional: handle other HTTP verbs
export function GET() {
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 })
}
