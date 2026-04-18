"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

/* ── Tipos ───────────────────────────────────────────────────────────────────── */
interface Credit {
  id: string
  category: "arte" | "modelo" | "musica" | "overlay" | "otro"
  artistName: string
  artistHandle?: string
  artistUrl?: string
  workTitle: string
  workDescription?: string
  imageSrc?: string
  commissionDate?: string
}

interface ModelEntry {
  id: string
  name: string           // nombre del modelo (ej: "Modelo principal v1")
  imageSrc?: string      // foto/render del modelo
  designArtist?: string
  designHandle?: string
  designUrl?: string
  rigArtist?: string
  rigHandle?: string
  rigUrl?: string
  date?: string
  notes?: string
}

/* ── Datos por defecto (editables desde /admin → Modelos) ───────────────────── */
const DEFAULT_CREDITS: Credit[] = [
  {
    id: "1",
    category: "modelo",
    artistName: "Nombre del rigger",
    artistHandle: "@rigger_twitter",
    artistUrl: "https://twitter.com/rigger_twitter",
    workTitle: "Live2D Rigging — Modelo Principal",
    workDescription: "Rigging del modelo principal de Rozu. ¡Hace que las orejitas se muevan!",
    commissionDate: "Enero 2025",
  },
  {
    id: "2",
    category: "arte",
    artistName: "Nombre del artista",
    artistHandle: "@artista_twitter",
    artistUrl: "https://twitter.com/artista_twitter",
    workTitle: "Design Sheet — Modelo Principal",
    workDescription: "Diseño original del personaje Rozu, incluyendo expresiones y outfits.",
    commissionDate: "Diciembre 2024",
  },
  {
    id: "3",
    category: "overlay",
    artistName: "Nombre del diseñador",
    artistHandle: "@overlay_person",
    artistUrl: "https://twitter.com/overlay_person",
    workTitle: "Overlays y Alerts de Stream",
    workDescription: "Diseño de overlays, alertas de seguidor/sub/raid y pantallas de transición.",
    commissionDate: "Febrero 2025",
  },
  {
    id: "4",
    category: "musica",
    artistName: "Nombre del músico",
    artistHandle: "@musician_handle",
    artistUrl: "https://twitter.com/musician_handle",
    workTitle: "BGM y Jingle de Intro",
    workDescription: "Música de fondo para streams y el jingle que suena al arrancar.",
    commissionDate: "Marzo 2025",
  },
  {
    id: "5",
    category: "arte",
    artistName: "Fan Artist",
    artistHandle: "@fanartist_example",
    artistUrl: "https://twitter.com/fanartist_example",
    workTitle: "Fan Art — Rozu con Zorro",
    workDescription: "Fan art espontáneo. ¡Gracias por tanto amor! 💖",
  },
]

/* ── Modelos por defecto ─────────────────────────────────────────────────────── */
const DEFAULT_MODELS: ModelEntry[] = [
  {
    id: "m1",
    name: "Modelo Principal v1",
    imageSrc: "/placeholder.svg?height=400&width=300",
    designArtist: "Nombre del artista",
    designHandle: "@artista_twitter",
    designUrl: "https://twitter.com/artista_twitter",
    rigArtist: "Nombre del rigger",
    rigHandle: "@rigger_twitter",
    rigUrl: "https://twitter.com/rigger_twitter",
    date: "2025",
    notes: "El modelo con el que debuté. Kitsune de una cola con outfit escolar kawaii.",
  },
  {
    id: "m2",
    name: "Outfit Alternativo",
    imageSrc: "/placeholder.svg?height=400&width=300",
    designArtist: "Nombre del artista",
    designHandle: "@artista_twitter",
    designUrl: "https://twitter.com/artista_twitter",
    rigArtist: "Nombre del rigger",
    rigHandle: "@rigger_twitter",
    rigUrl: "https://twitter.com/rigger_twitter",
    date: "2025",
    notes: "Outfit casual para streams relajados.",
  },
]
/* ─────────────────────────────────────────────────────────────────────────────── */

const CATEGORY_CONFIG = {
  arte:    { label: "Arte & Diseño",      tag: "arte"    },
  modelo:  { label: "Modelo & Rigging",   tag: "modelo"  },
  musica:  { label: "Música",             tag: "música"  },
  overlay: { label: "Overlays & Assets",  tag: "overlay" },
  otro:    { label: "Otros",              tag: "otro"    },
}

const CATEGORY_ORDER: Credit["category"][] = ["modelo", "arte", "overlay", "musica", "otro"]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

type Tab = "creditos" | "modelos"

/* ── Helpers ─────────────────────────────────────────────────────────────────── */
function ArtistLink({ name, handle, url }: { name: string; handle?: string; url?: string }) {
  const inner = (
    <div className="flex items-center gap-2 group/link">
      <div className="w-7 h-7 rounded-full bg-[var(--ink)] flex items-center justify-center shrink-0">
        <span className="text-white text-xs font-black">{name.charAt(0).toUpperCase()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[var(--ink)] truncate">{name}</p>
        {handle && <p className="text-xs text-[var(--ink)]/40 truncate">{handle}</p>}
      </div>
      {url && <ExternalLink className="w-3.5 h-3.5 text-[var(--ink)]/20 group-hover/link:text-[var(--pink)] transition-colors shrink-0" />}
    </div>
  )
  if (url) return <a href={url} target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">{inner}</a>
  return <div>{inner}</div>
}

/* ── Componente principal ────────────────────────────────────────────────────── */
export default function CreditosPage() {
  const [tab, setTab]       = useState<Tab>("modelos")
  const [filter, setFilter] = useState<Credit["category"] | "todos">("todos")
  const [models, setModels] = useState<ModelEntry[]>(DEFAULT_MODELS)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("rozu-content-data")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed.models) && parsed.models.length > 0) {
          setModels(parsed.models)
        }
      }
    } catch {}
  }, [])

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const items = DEFAULT_CREDITS.filter((c) => c.category === cat && (filter === "todos" || filter === cat))
    if (items.length > 0) acc[cat] = items
    return acc
  }, {} as Partial<Record<Credit["category"], Credit[]>>)

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-[var(--cream)]/90 backdrop-blur-md border-b border-black/[0.07]"
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-black tracking-tight" style={{ color: "var(--ink)" }}>
              Rozu<span style={{ color: "var(--pink)" }}>VT</span>
            </span>
            <span className="text-xs spin-slow inline-block" style={{ color: "var(--pink)" }}>✦</span>
          </Link>
          <Link href="/">
            <motion.span
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 text-sm font-bold text-[var(--ink)]/50 hover:text-[var(--pink)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </motion.span>
          </Link>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-16 max-w-5xl">

        {/* ── Hero de la página ───────────────────────────────────────────── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-14">
          <div className="section-label mb-5">✦ con mucho amor</div>
          <h1 className="font-black text-[var(--ink)] mb-4"
            style={{ fontSize: "clamp(3rem, 8vw, 6rem)", letterSpacing: "-0.04em", lineHeight: 0.92 }}>
            Créditos
          </h1>
          <p className="text-[var(--ink)]/50 text-lg max-w-lg leading-relaxed">
            Cada parte de Rozu existe gracias a artistas increíbles. Acá les doy el reconocimiento que merecen. 🦊
          </p>
        </motion.div>

        {/* ── Tabs ────────────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show"
          transition={{ delay: 0.1 }}
          className="flex gap-1 p-1 mb-12 w-fit border border-black/[0.07] rounded-full"
          style={{ background: "white" }}
        >
          {([
            { id: "modelos",   label: "Modelos"  },
            { id: "creditos",  label: "Créditos" },
          ] as { id: Tab; label: string }[]).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-5 py-2 rounded-full text-sm font-black transition-all ${
                tab === id
                  ? "bg-[var(--ink)] text-white"
                  : "text-[var(--ink)]/40 hover:text-[var(--ink)]"
              }`}
            >
              {label}
            </button>
          ))}
        </motion.div>

        {/* ── TAB: MODELOS ────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {tab === "modelos" && (
            <motion.div
              key="modelos"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {models.map((model, i) => (
                <motion.div
                  key={model.id}
                  variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="ed-card overflow-hidden"
                >
                  <div className="grid md:grid-cols-[280px_1fr] gap-0">
                    {/* Imagen del modelo */}
                    <div
                      className="relative bg-[var(--cream)] overflow-hidden"
                      style={{ minHeight: 280 }}
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      {model.imageSrc ? (
                        <Image
                          src={model.imageSrc}
                          alt={model.name}
                          fill
                          className="object-contain img-protected"
                          draggable={false}
                          style={{ WebkitTouchCallout: "none" } as React.CSSProperties}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[var(--ink)]/10 text-6xl font-black">
                          🦊
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-8 flex flex-col gap-6">
                      <div>
                        <div className="section-label mb-2">modelo</div>
                        <h2 className="font-black text-[var(--ink)] text-2xl" style={{ letterSpacing: "-0.03em" }}>
                          {model.name}
                        </h2>
                        {model.date && (
                          <span className="text-xs text-[var(--ink)]/30 font-semibold uppercase tracking-widest mt-1 block">
                            {model.date}
                          </span>
                        )}
                        {model.notes && (
                          <p className="text-[var(--ink)]/60 text-sm mt-3 leading-relaxed">{model.notes}</p>
                        )}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        {/* Diseño */}
                        {model.designArtist && (
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--ink)]/30 mb-2">
                              Diseño del personaje
                            </p>
                            <div className="ed-card p-3">
                              <ArtistLink
                                name={model.designArtist}
                                handle={model.designHandle}
                                url={model.designUrl}
                              />
                            </div>
                          </div>
                        )}

                        {/* Rigging */}
                        {model.rigArtist && (
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--ink)]/30 mb-2">
                              Live2D Rigging
                            </p>
                            <div className="ed-card p-3">
                              <ArtistLink
                                name={model.rigArtist}
                                handle={model.rigHandle}
                                url={model.rigUrl}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* ── TAB: CRÉDITOS ───────────────────────────────────────────────── */}
          {tab === "creditos" && (
            <motion.div
              key="creditos"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              {/* Filtros */}
              <div className="flex flex-wrap gap-2 mb-10">
                {(["todos", ...CATEGORY_ORDER] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all border ${
                      filter === cat
                        ? "bg-[var(--ink)] text-white border-[var(--ink)]"
                        : "border-black/10 text-[var(--ink)]/50 hover:text-[var(--ink)] hover:border-black/20"
                    }`}
                  >
                    {cat === "todos" ? "Todos" : CATEGORY_CONFIG[cat].label}
                  </button>
                ))}
              </div>

              {/* Cards por categoría */}
              <div className="space-y-12">
                {(Object.entries(grouped) as [Credit["category"], Credit[]][]).map(([cat, items]) => (
                  <div key={cat}>
                    {/* Separador de categoría */}
                    <div className="flex items-center gap-4 mb-5">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--pink)]">
                        ✦ {CATEGORY_CONFIG[cat].label}
                      </span>
                      <div className="flex-1 h-px bg-black/[0.07]" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {items.map((credit, i) => (
                        <motion.div
                          key={credit.id}
                          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                          transition={{ delay: i * 0.07 }}
                          className="ed-card p-6"
                        >
                          {/* Cabecera */}
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div>
                              <h3 className="font-black text-[var(--ink)] leading-snug">{credit.workTitle}</h3>
                              {credit.commissionDate && (
                                <span className="text-xs text-[var(--ink)]/30 font-semibold uppercase tracking-widest mt-0.5 block">
                                  {credit.commissionDate}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full border border-black/[0.07] text-[var(--ink)]/40 shrink-0 whitespace-nowrap">
                              {CATEGORY_CONFIG[cat].tag}
                            </span>
                          </div>

                          {credit.workDescription && (
                            <p className="text-sm text-[var(--ink)]/55 leading-relaxed mb-5">
                              {credit.workDescription}
                            </p>
                          )}

                          {/* Artista */}
                          <div className="pt-4 border-t border-black/[0.06]">
                            <ArtistLink
                              name={credit.artistName}
                              handle={credit.artistHandle}
                              url={credit.artistUrl}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-20 pt-10 border-t border-black/[0.06]"
        >
          <p className="text-sm text-[var(--ink)]/30">
            ¿Sos artista y falta tu crédito? Escribime en{" "}
            <a
              href="https://twitter.com/rozu_vt"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:text-[var(--pink)] transition-colors"
              style={{ color: "var(--ink)" }}
            >
              Twitter
            </a>
            {" "}💖
          </p>
        </motion.div>

      </main>
    </div>
  )
}
