"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Plus, Trash2, Pencil, Check, X, Star, ImageIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { uploadImage, getContent, setContent } from "@/lib/supabase"

/* ── Tipos ───────────────────────────────────────────────────────────────────── */
interface Milestone {
  id: string
  date: string
  title: string
  description: string
  icon: string
  image: string
  highlight: boolean
}

interface TimelineData {
  title: string
  subtitle: string
  milestones: Milestone[]
}

/* ── Default ─────────────────────────────────────────────────────────────────── */
const DEFAULT: TimelineData = {
  title: "El Camino de Rozu",
  subtitle: "Cada hito, cada momento, cada magia. 🦊",
  milestones: [
    { id: "1", date: "Mayo 2024",      title: "Debut",              description: "El inicio de todo. Primera stream como Rozu, una kitsune de una cola que llegó a hacer magia.",   icon: "🦊", image: "", highlight: true  },
    { id: "2", date: "Junio 2024",     title: "Primera Collab",     description: "Primer stream en conjunto con otra VTuber. Chaos garantizado, risas aseguradas.",                  icon: "💫", image: "", highlight: false },
    { id: "3", date: "Agosto 2024",    title: "100 Seguidores",     description: "La comunidad empieza a crecer. Cien personas eligieron quedarse a ver el caos.",                   icon: "🌸", image: "", highlight: false },
    { id: "4", date: "Octubre 2024",   title: "Twitch Affiliate",   description: "¡Un hito enorme! El canal ya tiene emotes y sub button. La magia se hace oficial.",               icon: "⭐", image: "", highlight: true  },
    { id: "5", date: "Diciembre 2024", title: "500 Seguidores",     description: "Fin de año mágico. Quinientas personas siendo parte de esta aventura.",                            icon: "🎉", image: "", highlight: false },
    { id: "6", date: "Febrero 2025",   title: "Nuevo Modelo",       description: "Llega la segunda versión del modelo Live2D. Rozu evoluciona, más expresiva que nunca.",             icon: "✨", image: "", highlight: true  },
    { id: "7", date: "Abril 2025",     title: "1000 Seguidores",    description: "¡Cuatro dígitos! La comunidad sigue creciendo y el corazón no alcanza para tanto amor.",           icon: "💖", image: "", highlight: true  },
  ],
}

/* ── Card de hito ────────────────────────────────────────────────────────────── */
function MilestoneCard({
  milestone,
  editMode,
  onEdit,
  onDelete,
}: {
  milestone: Milestone
  editMode: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <motion.div
      className="ed-card overflow-hidden relative"
      whileHover={editMode ? {} : { y: -5, rotate: 0.3 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="p-5">
        <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "var(--pink)" }}>
          {milestone.date}
        </div>
        <h3 className="font-black text-xl mb-2 leading-tight" style={{ color: "var(--ink)", letterSpacing: "-0.03em" }}>
          {milestone.title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(30,16,37,0.6)" }}>
          {milestone.description}
        </p>
        {milestone.highlight && !editMode && (
          <div className="mt-3 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--pink)" }}>
            <Star className="w-3 h-3 fill-current" /> Destacado
          </div>
        )}
      </div>

      {editMode && (
        <div className="absolute top-3 right-3 flex gap-1.5">
          <button onClick={onEdit} className="w-8 h-8 rounded-full flex items-center justify-center shadow-md" style={{ background: "var(--ink)", color: "white" }}>
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete} className="w-8 h-8 rounded-full flex items-center justify-center shadow-md bg-red-500 text-white">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </motion.div>
  )
}

function ImagePanel({
  milestone,
  editMode,
  onImageChange,
}: {
  milestone: Milestone
  editMode: boolean
  onImageChange: (img: string) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const url = await uploadImage(file, "timeline")
      onImageChange(url)
    } catch (err) {
      console.error("Image upload failed:", err)
    }
  }

  if (milestone.image) {
    return (
      <div className="relative w-full h-full min-h-[180px] rounded overflow-hidden ed-card">
        <Image src={milestone.image} alt={milestone.title} fill className="object-cover" />
        {editMode && (
          <button
            onClick={() => onImageChange("")}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    )
  }

  if (editMode) {
    return (
      <>
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full min-h-[180px] rounded border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors"
          style={{ borderColor: "var(--pink)", color: "var(--pink)", background: "rgba(229,104,156,0.04)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(229,104,156,0.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(229,104,156,0.04)")}
        >
          <ImageIcon className="w-7 h-7" />
          <span className="text-xs font-bold uppercase tracking-wider">Agregar imagen</span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </>
    )
  }

  return null
}

/* ── Modal de edición ────────────────────────────────────────────────────────── */
function EditModal({
  draft,
  onChange,
  onSave,
  onCancel,
}: {
  draft: Milestone
  onChange: (m: Milestone) => void
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(30,16,37,0.5)", backdropFilter: "blur(4px)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="ed-card w-full max-w-md p-6 space-y-4"
        style={{ background: "var(--cream)" }}
      >
        <h3 className="font-black text-lg" style={{ color: "var(--ink)" }}>Editar hito</h3>

        <div className="flex gap-3">
          <div className="w-14">
            <label className="text-xs font-bold text-[var(--ink)]/50 block mb-1">Emoji</label>
            <input
              className="w-full text-center text-2xl rounded border border-black/10 p-1 bg-white outline-none"
              value={draft.icon}
              onChange={(e) => onChange({ ...draft, icon: e.target.value })}
            />
          </div>
          <div className="flex-1">
            <label className="text-xs font-bold text-[var(--ink)]/50 block mb-1">Fecha</label>
            <input
              className="w-full rounded border border-black/10 px-3 py-1.5 text-sm bg-white outline-none font-semibold"
              style={{ color: "var(--pink)" }}
              placeholder="Mayo 2024"
              value={draft.date}
              onChange={(e) => onChange({ ...draft, date: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-[var(--ink)]/50 block mb-1">Título</label>
          <input
            className="w-full rounded border border-black/10 px-3 py-1.5 text-sm bg-white outline-none font-black"
            style={{ color: "var(--ink)" }}
            placeholder="Título del hito"
            value={draft.title}
            onChange={(e) => onChange({ ...draft, title: e.target.value })}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[var(--ink)]/50 block mb-1">Descripción</label>
          <textarea
            className="w-full rounded border border-black/10 px-3 py-2 text-sm bg-white outline-none resize-none"
            style={{ color: "var(--ink)" }}
            rows={3}
            placeholder="Contá qué pasó..."
            value={draft.description}
            onChange={(e) => onChange({ ...draft, description: e.target.value })}
          />
        </div>

<label className="flex items-center gap-2 text-sm font-bold cursor-pointer select-none" style={{ color: "var(--ink)" }}>
          <input
            type="checkbox"
            checked={draft.highlight}
            onChange={(e) => onChange({ ...draft, highlight: e.target.checked })}
            className="w-4 h-4"
            style={{ accentColor: "var(--pink)" }}
          />
          Marcar como destacado ⭐
        </label>

        <div className="flex gap-2 pt-2">
          <button onClick={onSave} className="btn-main btn-pink flex-1 justify-center">
            <Check className="w-4 h-4" /> Guardar
          </button>
          <button onClick={onCancel} className="btn-main flex-1 justify-center">
            <X className="w-4 h-4" /> Cancelar
          </button>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Componente principal ────────────────────────────────────────────────────── */
export default function TimelinePage() {
  const [data, setData] = useState<TimelineData | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [draft, setDraft] = useState<Milestone | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    getContent<TimelineData>("timeline").then((saved) => {
      setData({ ...DEFAULT, ...(saved ?? {}) })
    })
    setIsAdmin(localStorage.getItem("rozu-admin-auth") === "authenticated")
  }, [])

  const persist = (next: TimelineData) => {
    setData(next)
    setContent("timeline", next).catch(console.error)
  }

  const openEdit = (m: Milestone) => setDraft({ ...m })

  const saveEdit = () => {
    if (!draft) return
    persist({ ...data, milestones: data.milestones.map((m) => (m.id === draft.id ? draft : m)) })
    setDraft(null)
  }

  const deleteM = (id: string) => persist({ ...data, milestones: data.milestones.filter((m) => m.id !== id) })

  const addMilestone = () => {
    const m: Milestone = {
      id: String(Date.now()),
      date: "Mes Año",
      title: "Nuevo hito",
      description: "Descripción del hito.",
      icon: "✦",
      image: "",
      highlight: false,
    }
    const next = { ...data, milestones: [...data.milestones, m] }
    persist(next)
    setDraft({ ...m })
  }

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--cream)" }}>
      <span className="spin-slow text-4xl" style={{ color: "var(--pink)" }}>✦</span>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>

      {/* ── NAV ──────────────────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-black/[0.07]"
        style={{ background: "rgba(253,246,240,0.92)" }}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-black tracking-tight" style={{ color: "var(--ink)" }}>
              Rozu<span style={{ color: "var(--pink)" }}>VT</span>
            </span>
            <span className="spin-slow inline-block text-sm" style={{ color: "var(--pink)" }}>✦</span>
          </Link>

          {isAdmin && (
            <div className="flex items-center gap-2">
              {editMode && (
                <button onClick={addMilestone} className="btn-main btn-pink" style={{ fontSize: "0.78rem", padding: "8px 16px" }}>
                  <Plus className="w-3.5 h-3.5" /> Agregar hito
                </button>
              )}
              <button
                onClick={() => setEditMode(!editMode)}
                className="btn-main"
                style={{
                  fontSize: "0.78rem",
                  padding: "8px 16px",
                  background: editMode ? "var(--pink)" : "var(--ink)",
                  boxShadow: editMode ? "3px 4px 0 var(--ink)" : "3px 4px 0 var(--pink)",
                }}
              >
                {editMode
                  ? <><Check className="w-3.5 h-3.5" /> Listo</>
                  : <><Pencil className="w-3.5 h-3.5" /> Editar</>
                }
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── ENCABEZADO ───────────────────────────────────────────────────────── */}
      <div className="pt-28 pb-12 container mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="section-label mb-4">Timeline</div>
          <h1
            className="font-black text-[var(--ink)] mb-3"
            style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)", letterSpacing: "-0.04em", lineHeight: 0.95 }}
          >
            {data.title}
          </h1>
          <p className="text-lg" style={{ color: "rgba(30,16,37,0.5)" }}>{data.subtitle}</p>
        </motion.div>
      </div>

      {/* ── TIMELINE ─────────────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 pb-24 max-w-4xl">
        <div className="relative">

          {/* Línea vertical */}
          <div
            className="absolute left-5 md:left-1/2 top-0 bottom-0 w-[2px] md:-translate-x-px"
            style={{ background: "linear-gradient(to bottom, var(--pink), var(--ink))", opacity: 0.18 }}
          />

          <div className="space-y-10 md:space-y-14">
            {data.milestones.map((milestone, i) => {
              const isLeft = i % 2 === 0
              return (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
                  className={`relative flex items-start gap-0 md:gap-8 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  {/* Lado imagen — desktop (opuesto a la card) */}
                  <div className="hidden md:flex flex-1 items-center justify-center">
                    <div className="w-full">
                      <ImagePanel
                        milestone={milestone}
                        editMode={editMode}
                        onImageChange={(img) => persist({ ...data, milestones: data.milestones.map((m) => m.id === milestone.id ? { ...m, image: img } : m) })}
                      />
                    </div>
                  </div>

                  {/* Dot en línea */}
                  <div className="relative z-10 shrink-0 flex items-center justify-center mt-5">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-xl border-2 shadow"
                      style={{
                        background: milestone.highlight ? "var(--pink)" : "white",
                        borderColor: milestone.highlight ? "var(--pink-dark)" : "rgba(30,16,37,0.12)",
                        boxShadow: milestone.highlight ? "0 0 0 5px rgba(229,104,156,0.18)" : "0 2px 8px rgba(0,0,0,0.07)",
                      }}
                    >
                      {milestone.icon}
                    </div>
                  </div>

                  {/* Card */}
                  <div className="flex-1 pl-4 md:pl-0">
                    <MilestoneCard
                      milestone={milestone}
                      editMode={editMode}
                      onEdit={() => openEdit(milestone)}
                      onDelete={() => deleteM(milestone.id)}
                    />
                    {/* Imagen en mobile — debajo de la card */}
                    {(milestone.image || editMode) && (
                      <div className="md:hidden mt-3">
                        <ImagePanel
                          milestone={milestone}
                          editMode={editMode}
                          onImageChange={(img) => persist({ ...data, milestones: data.milestones.map((m) => m.id === milestone.id ? { ...m, image: img } : m) })}
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Agregar al final */}
          {editMode && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center mt-14">
              <button
                onClick={addMilestone}
                className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-dashed font-bold text-sm transition-all"
                style={{ borderColor: "var(--pink)", color: "var(--pink)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(229,104,156,0.07)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <Plus className="w-4 h-4" /> Agregar hito
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-black/[0.07] py-6">
        <div className="container mx-auto px-4 flex items-center justify-center gap-2 text-sm" style={{ color: "rgba(30,16,37,0.3)" }}>
          <span className="font-black" style={{ color: "var(--ink)" }}>
            Rozu<span style={{ color: "var(--pink)" }}>VT</span>
          </span>
          <span className="spin-slow inline-block" style={{ color: "var(--pink)" }}>✦</span>
        </div>
      </footer>

      {/* ── MODAL EDICIÓN ────────────────────────────────────────────────────── */}
      {draft && (
        <EditModal
          draft={draft}
          onChange={setDraft}
          onSave={saveEdit}
          onCancel={() => setDraft(null)}
        />
      )}
    </div>
  )
}
