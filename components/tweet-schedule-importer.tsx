"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Twitter, Loader2, CheckCircle, AlertCircle, RotateCcw } from "lucide-react"

interface Props {
  onImport: (tweetUrl: string, images: string[]) => void
}

type Status = "idle" | "loading" | "preview" | "error"

export function TweetScheduleImporter({ onImport }: Props) {
  const [url, setUrl]       = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [images, setImages] = useState<string[]>([])
  const [error, setError]   = useState("")

  const handleFetch = async () => {
    if (!url.trim()) return
    setStatus("loading")
    setError("")

    try {
      const res = await fetch("/api/tweet-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Error desconocido")
        setStatus("error")
        return
      }

      setImages(data.images ?? [])
      setStatus("preview")
    } catch {
      setError("No se pudo conectar con el servidor")
      setStatus("error")
    }
  }

  const handleReset = () => {
    setStatus("idle")
    setError("")
    setImages([])
  }

  const handleApply = () => {
    onImport(url.trim(), images)
    handleReset()
  }

  return (
    <div className="border border-black/[0.08] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-black/[0.06] bg-neutral-50">
        <Twitter className="w-4 h-4 text-sky-500" />
        <span className="text-sm font-bold text-[var(--ink)]">Importar schedule desde tweet</span>
      </div>

      <div className="p-4 space-y-4">
        <p className="text-xs text-[var(--ink)]/40">
          Pegá el link del tweet con la imagen del schedule. Se mostrará en la landing directo.
        </p>

        {/* Input URL */}
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && status !== "preview" && handleFetch()}
            placeholder="https://twitter.com/rozu_vt/status/..."
            disabled={status === "loading" || status === "preview"}
            className="flex-1 px-3 py-2 text-sm border border-black/10 rounded-lg outline-none focus:border-[var(--pink)] transition-colors disabled:opacity-40 bg-white"
          />
          <button
            onClick={status === "preview" ? handleReset : handleFetch}
            disabled={status === "loading" || (!url.trim() && status !== "preview")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-40 shrink-0"
            style={{ background: "var(--ink)", color: "white" }}
          >
            {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
            {status === "preview" && <RotateCcw className="w-4 h-4" />}
            {status === "loading" ? "..." : status === "preview" ? "Otro tweet" : "Cargar"}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}

          {status === "preview" && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Preview de la imagen */}
              {images.length > 0 ? (
                <div className="space-y-2">
                  {images.map((src, i) => (
                    <div key={i} className="w-full rounded-lg overflow-hidden border border-black/[0.07]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`Schedule ${i + 1}`}
                        className="w-full object-contain bg-neutral-50"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full rounded-lg border border-dashed border-black/10 bg-neutral-50 flex items-center justify-center py-10 text-sm text-[var(--ink)]/30">
                  Sin imágenes en el tweet
                </div>
              )}

              <button
                onClick={handleApply}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold"
                style={{ background: "var(--pink)", color: "white" }}
              >
                <CheckCircle className="w-4 h-4" />
                Aplicar al schedule
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
