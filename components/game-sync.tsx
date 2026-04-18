"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Gamepad2, RefreshCw, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface Game {
  name: string
  logo: string
  summary: string
  color: string
}

interface Props {
  onSync: (games: Game[]) => void
}

type SyncStatus = "idle" | "loading" | "done" | "error"

export function GameSync({ onSync }: Props) {
  const [status, setStatus]   = useState<SyncStatus>("idle")
  const [error, setError]     = useState("")
  const [preview, setPreview] = useState<Game[]>([])

  const handleSync = async () => {
    setStatus("loading")
    setError("")
    setPreview([])

    try {
      const res  = await fetch("/api/games/twitch")
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Error al obtener juegos de Twitch")
        setStatus("error")
        return
      }

      const games: Game[] = (data.games ?? []).map((g: any) => ({
        name:    g.name,
        logo:    g.logo,
        summary: "",
        color:   "bg-neutral-50",
      }))

      if (games.length === 0) {
        setError("No se encontraron juegos en los VODs recientes de Twitch")
        setStatus("error")
        return
      }

      setPreview(games)
      setStatus("done")
    } catch (err) {
      console.error(err)
      setError("No se pudo conectar con el servidor")
      setStatus("error")
    }
  }

  const handleApply = () => {
    onSync(preview)
    setStatus("idle")
    setPreview([])
  }

  return (
    <div className="border border-black/[0.08] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.06] bg-neutral-50">
        <div className="flex items-center gap-3">
          <Gamepad2 className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-bold text-[var(--ink)]">Importar juegos desde Twitch</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleSync}
          disabled={status === "loading"}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-40 transition-all"
          style={{ background: "var(--ink)", color: "white" }}
        >
          {status === "loading"
            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sincronizando...</>
            : <><RefreshCw className="w-3.5 h-3.5" /> Sincronizar</>
          }
        </motion.button>
      </div>

      <div className="p-4 space-y-4">
        <p className="text-xs text-[var(--ink)]/40">
          Extrae los juegos más jugados de tus últimos VODs de Twitch (como TwitchTracker). Reemplaza la lista actual.
        </p>

        <AnimatePresence mode="wait">
          {status === "error" && (
            <motion.div key="error"
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {status === "done" && (
            <motion.div key="done"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Preview grid — box art portrait ratio */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {preview.map((g, i) => (
                  <div key={i} className="rounded-lg border border-black/[0.07] overflow-hidden bg-white">
                    {g.logo ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={g.logo} alt={g.name} className="w-full aspect-[3/4] object-cover" />
                    ) : (
                      <div className="w-full aspect-[3/4] bg-neutral-100 flex items-center justify-center text-2xl">🎮</div>
                    )}
                    <p className="text-[9px] font-bold text-[var(--ink)] p-1.5 line-clamp-2 leading-tight">{g.name}</p>
                  </div>
                ))}
              </div>

              <p className="text-xs text-[var(--ink)]/40">
                ℹ️ Podés editar el resumen de cada juego después de aplicar.
              </p>

              <button
                onClick={handleApply}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold"
                style={{ background: "var(--pink)", color: "white" }}
              >
                <CheckCircle className="w-4 h-4" />
                Aplicar {preview.length} juegos
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
