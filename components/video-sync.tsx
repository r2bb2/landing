"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tv, RefreshCw, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface Video {
  title: string
  thumbnail: string
  views: string
  url: string
  platform: "youtube" | "twitch"
  videoId: string
  type?: string
  duration?: string
}

interface Props {
  onSync: (videos: Video[]) => void
}

type SyncStatus = "idle" | "loading" | "done" | "error"

export function VideoSync({ onSync }: Props) {
  const [status, setStatus]   = useState<SyncStatus>("idle")
  const [error, setError]     = useState("")
  const [preview, setPreview] = useState<Video[]>([])
  const [counts, setCounts]   = useState({ youtube: 0, clips: 0, vods: 0 })

  const handleSync = async () => {
    setStatus("loading")
    setError("")
    setPreview([])

    try {
        const twRes  = await fetch("/api/videos/twitch")
      const twData = await twRes.json()

      if (!twRes.ok) {
        setError(twData.error ?? "Error al obtener VODs de Twitch")
        setStatus("error")
        return
      }

      const vods: Video[] = (twData.vods ?? []).slice(0, 6).map((v: any) => ({
        title:    v.title,
        thumbnail: v.thumbnail,
        views:    v.views,
        url:      v.url,
        platform: "twitch" as const,
        videoId:  v.id,
        type:     "vod",
        duration: v.duration,
      }))

      setCounts({ youtube: 0, clips: 0, vods: vods.length })
      setPreview(vods)
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
          <Tv className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-bold text-[var(--ink)]">Sincronizar VODs de Twitch</span>
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
          Trae automáticamente los últimos VODs de Twitch.
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
              {/* Stats */}
              <div className="flex gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/[0.07] text-xs font-bold">
                  <Tv className="w-3.5 h-3.5 text-purple-500" />
                  <span className="text-[var(--ink)]/60">VODs</span>
                  <span className="text-[var(--ink)]">{counts.vods}</span>
                </div>
              </div>

              {error && (
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                  ⚠ {error}
                </p>
              )}

              {/* Preview grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {preview.map((v, i) => (
                  <div key={i} className="rounded-lg border border-black/[0.07] overflow-hidden bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={v.thumbnail} alt={v.title} className="w-full aspect-video object-cover" />
                    <div className="px-2 py-1.5">
                      <p className="text-[10px] font-bold text-[var(--ink)] line-clamp-1">{v.title}</p>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className={`text-[9px] font-black uppercase tracking-wider ${v.platform === "youtube" ? "text-red-500" : "text-purple-500"}`}>
                          {v.platform === "youtube" ? "YouTube" : v.type === "clip" ? "Clip" : "VOD"}
                        </span>
                        {v.views && <span className="text-[9px] text-[var(--ink)]/30">{v.views} views</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleApply}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold"
                style={{ background: "var(--pink)", color: "white" }}
              >
                <CheckCircle className="w-4 h-4" />
                Aplicar {preview.length} videos
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
