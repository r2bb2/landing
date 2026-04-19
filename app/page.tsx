"use client"

import { useState, useEffect } from "react"
import { getContent } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, ChevronDown, Star, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

/* ── Iconos de marca ─────────────────────────────────────────────────────────── */
const IconTwitch = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
  </svg>
)

const IconTwitterX = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const IconYoutube = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const IconDiscord = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.055a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
)

const IconKick = ({ className }: { className?: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src="https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/videos/kick-logo-48b2ofql4rwqwlx1qulvcc.png/kick-logo-vayn7nqy3wsujkj0mqe6lk.png?_a=DATAiZAAZAA0" alt="Kick" className={className} style={{ objectFit: "contain" }} />
)

const IconTikTok = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.2 8.2 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
  </svg>
)

const IconPayPal = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.26-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.477z"/>
  </svg>
)

const IconKofi = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"/>
  </svg>
)

const IconThrone = ({ className }: { className?: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src="https://upload.wikimedia.org/wikipedia/commons/9/92/Throne_Icon_-_Single_%28Gradient%29.png" alt="Throne" className={className} style={{ objectFit: "contain" }} />
)

const IconStreamloots = ({ className }: { className?: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src="https://static-cdn.jtvnw.net/jtv_user_pictures/eac78b89-4bdd-4c3c-829f-c82c5f64a5b4-profile_image-300x300.png" alt="Streamloots" className={className} style={{ objectFit: "contain", borderRadius: "4px" }} />
)

/* ── Tipos ───────────────────────────────────────────────────────────────────── */
interface ContentData {
  hero: { title: string; subtitle: string; heroImage: string }
  about: { title: string; description: string }
  schedule: {
    title: string; subtitle: string
    discordTitle: string; discordText: string; discordButtonText: string; scheduleNote: string
    tweetUrl: string; scheduleImages: string[]
  }
  games: Array<{ name: string; logo: string; summary: string; color: string }>
  videos: Array<{ title: string; thumbnail: string; views: string; url: string; platform: "youtube" | "twitch"; videoId: string }>
  faqs: Array<{ question: string; answer: string; icon: string }>
  contact: { title: string; subtitle: string }
  footer: { brandText: string; copyrightText: string }
  socialLinks: { twitch: string; twitter: string; youtube: string; discord: string; kick: string; tiktok: string }
  support: { paypal: string; kofi: string; throne: string; streamloots: string }
  backgroundImages: { hero: string; about: string; schedule: string; games: string; videos: string; faq: string; contact: string }
}

/* ── Default data ────────────────────────────────────────────────────────────── */
const DEFAULT: ContentData = {
  hero: { title: "¡Hola!\nI'm Rozu", subtitle: "A magical kitsune VTuber from Argentina. Join me for cozy gaming sessions, chaotic adventures, and lots of kawaii moments!", heroImage: "/rozu-avatar.png" },
  about: { title: "About Me", description: "I'm a one-tailed kitsune (for now!) who loves spreading magic and chaos in equal measure. When I'm not streaming, you can find me sipping white wine and planning my next kawaii adventure! My goal is to make your day a little more pink and a lot more magical! ✨" },
  schedule: {
    title: "Stream Schedule", subtitle: "",
    discordTitle: "Stay Updated", discordText: "All stream announcements are made on Discord! Join our cozy community to never miss a stream! 💖", discordButtonText: "Join Discord", scheduleNote: "Schedule may vary — Discord is your best bet! 🦊",
    tweetUrl: "", scheduleImages: [],
  },
  games: [
    { name: "Stardew Valley",  logo: "/placeholder.svg?height=64&width=64", summary: "Cozy farming sim where I build my dream farm and make friends! 🌱",     color: "bg-emerald-50" },
    { name: "Genshin Impact",  logo: "/placeholder.svg?height=64&width=64", summary: "Epic RPG with gorgeous worlds to explore and characters to pull! ⚔️",    color: "bg-sky-50"     },
    { name: "Minecraft",       logo: "/placeholder.svg?height=64&width=64", summary: "Building kawaii houses and surviving absolutely nothing scary. 🧱",       color: "bg-lime-50"    },
    { name: "Animal Crossing", logo: "/placeholder.svg?height=64&width=64", summary: "Decorating my island and hanging out with adorable villagers! 🏝️",       color: "bg-yellow-50"  },
    { name: "Valorant",        logo: "/placeholder.svg?height=64&width=64", summary: "Tactical FPS. I try my best. Emphasis on try. 🎯",                        color: "bg-red-50"     },
    { name: "League of Legends", logo: "/placeholder.svg?height=64&width=64", summary: "Support main. I keep everyone alive and happy. Usually. ⚡",            color: "bg-violet-50"  },
  ],
  videos: [
    { title: "First Stream Highlights", thumbnail: "/placeholder.svg?height=200&width=300", views: "12K", url: "", platform: "twitch",  videoId: "" },
    { title: "Cooking with Rozu",       thumbnail: "/placeholder.svg?height=200&width=300", views: "8.5K", url: "", platform: "youtube", videoId: "" },
    { title: "Minecraft Build Tour",    thumbnail: "/placeholder.svg?height=200&width=300", views: "15K", url: "", platform: "youtube", videoId: "" },
    { title: "Q&A Session",             thumbnail: "/placeholder.svg?height=200&width=300", views: "6.2K", url: "", platform: "twitch",  videoId: "" },
    { title: "Genshin Gacha Pulls",     thumbnail: "/placeholder.svg?height=200&width=300", views: "20K", url: "", platform: "youtube", videoId: "" },
    { title: "Singing Stream",          thumbnail: "/placeholder.svg?height=200&width=300", views: "9.8K", url: "", platform: "twitch",  videoId: "" },
  ],
  faqs: [
    { question: "When do you stream?",      answer: "Monday to Saturday at 8 PM ART! Always announced on Discord first. 🦊",                                            icon: "📅" },
    { question: "What games do you play?",  answer: "Mostly cozy games — Stardew, Animal Crossing, Minecraft. But I also do Genshin and the occasional chaos. ✨",       icon: "🎮" },
    { question: "Can I use your emotes?",   answer: "Yes! Subscriber emotes on Twitch, plus some free ones in the Discord server! 💖",                                    icon: "😊" },
    { question: "How can I support you?",   answer: "Follow on socials, sub on Twitch, and chat during streams. That already means the world to me! 🌸",                 icon: "💝" },
  ],
  contact:  { title: "Get in Touch", subtitle: "Have a question or want to collab? Find me here." },
  footer:   { brandText: "RozuVT", copyrightText: "© 2025 RozuVT — Made with magic, wine, and lots of love 🦊💖" },
  socialLinks: { twitch: "https://twitch.tv/rozuVT", twitter: "https://twitter.com/rozu_vt", youtube: "https://youtube.com/@rozuvt", discord: "https://discord.gg/rozuvt", kick: "https://kick.com/rozuvt", tiktok: "https://tiktok.com/@rozuvt" },
  support: { paypal: "", kofi: "", throne: "", streamloots: "" },
  backgroundImages: { hero: "", about: "", schedule: "", games: "", videos: "", faq: "", contact: "" },
}

/* ── Helpers ─────────────────────────────────────────────────────────────────── */
const SectionLabel = ({ n, label }: { n: string; label: string }) => (
  <div className="section-label mb-6">{n} — {label}</div>
)

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const TICKER_ITEMS = ["✦ RozuVT", "🦊 Kitsune", "✦ Argentina", "🌸 Chaos stream", "✦ Gaming", "🍷 Wine fan", "💖 Join us"]

/* ── Componente principal ────────────────────────────────────────────────────── */
export default function RozuLanding() {
  const [data, setData] = useState<ContentData | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    getContent<ContentData>("home").then((saved) => {
      setData({
        ...DEFAULT,
        ...(saved ?? {}),
        schedule:         { ...DEFAULT.schedule,         ...saved?.schedule },
        contact:          { ...DEFAULT.contact,           ...saved?.contact },
        footer:           { ...DEFAULT.footer,            ...saved?.footer },
        socialLinks:      { ...DEFAULT.socialLinks,       ...saved?.socialLinks },
        support:          { ...DEFAULT.support,           ...saved?.support },
        backgroundImages: { ...DEFAULT.backgroundImages,  ...saved?.backgroundImages },
      })
    })
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id) }),
      { threshold: 0.25 }
    )
    document.querySelectorAll("section[id]").forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  const navItems = ["home", "about", "schedule", "games", "videos", "faq", "support", "contact"]

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setActiveSection(id)
    setMobileOpen(false)
  }

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--cream)" }}>
      <span className="spin-slow text-4xl" style={{ color: "var(--pink)" }}>✦</span>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>

      {/* ── NAV ──────────────────────────────────────────────────────────────── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[var(--cream)]/90 backdrop-blur-md border-b border-black/[0.07]"
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => scrollTo("home")} className="flex items-center gap-2 group">
            <span className="text-lg font-black tracking-tight" style={{ color: "var(--ink)" }}>
              Rozu<span style={{ color: "var(--pink)" }}>VT</span>
            </span>
            <span className="text-xs spin-slow inline-block" style={{ color: "var(--pink)" }}>✦</span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((id) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-all capitalize ${
                  activeSection === id
                    ? "bg-[var(--ink)] text-white"
                    : "text-[var(--ink)]/60 hover:text-[var(--ink)]"
                }`}
              >
                {id}
              </button>
            ))}
            <div className="w-px h-4 bg-black/10 mx-1" />
            <Link href="/timeline">
              <span className="px-3 py-1.5 text-sm font-semibold text-[var(--ink)]/60 hover:text-[var(--pink)] transition-colors">Timeline</span>
            </Link>
            <Link href="/creditos">
              <span className="px-3 py-1.5 text-sm font-semibold text-[var(--ink)]/60 hover:text-[var(--pink)] transition-colors">Créditos</span>
            </Link>
          </nav>

          {/* Hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-full border border-black/10">
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block h-0.5 bg-[var(--ink)] rounded transition-all ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`block h-0.5 bg-[var(--ink)] rounded transition-all ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 bg-[var(--ink)] rounded transition-all ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </div>
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden fixed top-[57px] left-0 right-0 z-40 bg-[var(--cream)] border-b border-black/[0.07] py-4"
          >
            <div className="container mx-auto px-4 flex flex-col gap-1">
              {navItems.map((id) => (
                <button key={id} onClick={() => scrollTo(id)}
                  className="text-left px-4 py-2.5 rounded-xl font-semibold capitalize text-[var(--ink)] hover:bg-[var(--pink-light)]/40 transition-colors">
                  {id}
                </button>
              ))}
              <div className="h-px bg-black/5 my-1" />
              <Link href="/timeline" onClick={() => setMobileOpen(false)}>
                <span className="block px-4 py-2.5 rounded-xl font-semibold text-[var(--ink)]/60 hover:text-[var(--pink)] hover:bg-[var(--pink-light)]/40 transition-colors">Timeline</span>
              </Link>
              <Link href="/creditos" onClick={() => setMobileOpen(false)}>
                <span className="block px-4 py-2.5 rounded-xl font-semibold text-[var(--ink)]/60 hover:text-[var(--pink)] hover:bg-[var(--pink-light)]/40 transition-colors">Créditos</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section id="home" className="pt-20 min-h-screen flex flex-col justify-center relative overflow-hidden">

        {/* Decoración fondo */}
        <div className="absolute top-24 right-8 text-[var(--pink-light)] text-8xl font-black opacity-30 select-none pointer-events-none rotate-12">✦</div>
        <div className="absolute bottom-32 left-4 text-[var(--pink-light)] text-5xl font-black opacity-20 select-none pointer-events-none -rotate-6">★</div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-[1fr_420px] gap-8 lg:gap-12 items-center">

            {/* Texto */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="space-y-5 order-2 lg:order-1 text-center lg:text-left">
              <div className="sticker w-fit mx-auto lg:mx-0">🦊 VTuber Argentina</div>

              <h1 className="display-heading text-[var(--ink)]">
                {(() => {
                  const lines = data.hero.title.split("\n")
                  if (lines.length >= 2) {
                    return lines.map((line, i) => (
                      <span key={i} className="block">
                        {i === 1
                          ? <><span style={{ color: "var(--pink)" }}>{line.split(" ")[0]} </span>{line.split(" ").slice(1).join(" ")}</>
                          : line}
                      </span>
                    ))
                  }
                  // Sin salto de línea: colorear "I'm" donde aparezca
                  const words = data.hero.title.split(" ")
                  return (
                    <span className="block">
                      {words.map((w, i) => (
                        <span key={i} style={w === "I'm" ? { color: "var(--pink)" } : {}}>{w}{i < words.length - 1 ? " " : ""}</span>
                      ))}
                    </span>
                  )
                })()}
              </h1>

              <p className="text-lg text-[var(--ink)]/70 max-w-md leading-relaxed mx-auto lg:mx-0">
                {data.hero.subtitle}
              </p>

              <div className="flex flex-wrap gap-3 pt-2 justify-center lg:justify-start">
                <a href={data.socialLinks.twitch} target="_blank" rel="noopener noreferrer">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="btn-main btn-pink">
                    <IconTwitch className="w-4 h-4" /> Watch on Twitch
                  </motion.button>
                </a>
                <a href={data.socialLinks.discord} target="_blank" rel="noopener noreferrer">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="btn-main">
                    <IconDiscord className="w-4 h-4" /> Discord
                  </motion.button>
                </a>
              </div>

              {/* Social links */}
              <div className="flex items-center gap-2 pt-1 justify-center lg:justify-start">
                {[
                  { href: data.socialLinks.twitter, Icon: IconTwitterX },
                  { href: data.socialLinks.youtube, Icon: IconYoutube },
                ].map(({ href, Icon }, i) => (
                  <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center text-[var(--ink)]/50 hover:text-[var(--pink)] hover:border-[var(--pink)] transition-all">
                    <Icon className="w-4 h-4 fill-current" />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center order-1 lg:order-2"
            >
              {/* Marco editorial rotado */}
              <div className="relative" style={{ transform: "rotate(2deg)" }}>
                <div className="absolute -inset-3 border-2 border-[var(--pink)] rounded-sm opacity-40" style={{ transform: "rotate(-2deg)" }} />
                <div className="relative w-56 h-72 sm:w-64 sm:h-80 md:w-80 md:h-96 overflow-hidden rounded-sm bg-[var(--pink-light)]/30">
                  <Image src={data.hero.heroImage} alt="RozuVT" fill className="object-contain float-slow" priority />
                </div>
                {/* Sticker — oculto en mobile para evitar overflow */}
                <div className="absolute -bottom-4 -left-4 sm:-left-6 sticker-outline bg-[var(--cream)] text-[10px] sm:text-xs hidden sm:inline-flex">
                  one-tailed kitsune ✦
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[var(--ink)]/30 text-xs"
        >
          <span className="tracking-widest uppercase text-[10px]">scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* ── TICKER ───────────────────────────────────────────────────────────── */}
      <div className="border-y border-black/[0.07] bg-[var(--pink)] py-2.5 overflow-hidden">
        <div className="marquee-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="text-white font-black text-sm tracking-widest uppercase px-8 whitespace-nowrap">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── ABOUT ────────────────────────────────────────────────────────────── */}
      <section id="about" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <SectionLabel n="01" label="About me" />
          </motion.div>

          <div className="grid lg:grid-cols-[1fr_1fr] gap-16 items-start">
            {/* Pull quote */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <h2 className="font-black text-[var(--ink)] leading-[0.95] mb-8"
                style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.04em" }}>
                Caos, cringe<br />& vinito blanco.
              </h2>
              <div className="border-l-4 border-[var(--pink)] pl-6 mb-8">
                <p className="text-[var(--ink)]/70 text-lg leading-relaxed">
                  {data.about.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["🦊 Kitsune", "🌸 Chaos streams", "🎮 Gamer", "🍷 Wine fan", "🇦🇷 Argentina"].map((tag) => (
                  <span key={tag} className="px-3 py-1 text-sm font-semibold border border-black/10 rounded-full text-[var(--ink)]/70">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Stats grid */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { n: "?",    label: "streams / semana" },
                { n: "1",    label: "tail (por ahora)" },
                { n: "∞",    label: "rosa" },
                { n: "-100", label: "años" },
              ].map((s, i) => (
                <div key={i} className={`ed-card p-6 ${i % 2 !== 0 ? "md:mt-6" : ""}`}>
                  <div className="text-4xl font-black text-[var(--pink)] mb-1" style={{ letterSpacing: "-0.04em" }}>
                    {s.n}
                  </div>
                  <div className="text-xs font-semibold text-[var(--ink)]/50 uppercase tracking-widest">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Separador ────────────────────────────────────────────────────────── */}
      <div className="divider" />

      {/* ── SCHEDULE ─────────────────────────────────────────────────────────── */}
      <section id="schedule" className="py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <SectionLabel n="02" label="Schedule" />
            <h2 className="font-black text-[var(--ink)] mb-12"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.04em", lineHeight: 0.95 }}>
              {data.schedule.title}
            </h2>
          </motion.div>

          {/* Imagen del schedule (del tweet) */}
          {data.schedule.scheduleImages && data.schedule.scheduleImages.length > 0 && (
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="mb-10"
            >
              <div className="flex flex-col gap-3">
                {data.schedule.scheduleImages.map((src, i) => (
                  <div key={i} className="relative ed-card overflow-hidden w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt="Schedule semanal"
                      className="w-full h-auto object-cover img-protected"
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                      style={{ WebkitTouchCallout: "none" } as React.CSSProperties}
                    />
                  </div>
                ))}
                {data.schedule.tweetUrl && (
                  <a
                    href={data.schedule.tweetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-bold text-[var(--ink)]/40 hover:text-[var(--pink)] transition-colors w-fit"
                  >
                    <IconTwitterX className="w-4 h-4" />
                    Ver tweet original
                  </a>
                )}
              </div>
            </motion.div>
          )}

          {/* Discord CTA — bloque de color sólido */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="rounded-sm p-10 flex flex-col md:flex-row items-center justify-between gap-6"
            style={{ background: "var(--ink)", color: "white" }}
          >
            <div>
              <div className="text-[var(--pink)] text-xs font-black uppercase tracking-widest mb-2">✦ {data.schedule.discordTitle}</div>
              <p className="text-white/80 max-w-sm">{data.schedule.discordText}</p>
            </div>
            <a href={data.socialLinks.discord} target="_blank" rel="noopener noreferrer" className="shrink-0">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="btn-main btn-pink">
                <IconDiscord className="w-4 h-4" /> {data.schedule.discordButtonText}
              </motion.button>
            </a>
          </motion.div>

          {data.schedule.scheduleNote && (
            <p className="text-center text-xs text-[var(--ink)]/30 mt-4 tracking-wide">{data.schedule.scheduleNote}</p>
          )}
        </div>
      </section>

      <div className="divider" />

      {/* ── GAMES ────────────────────────────────────────────────────────────── */}
      <section id="games" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <SectionLabel n="03" label="Games" />
            <h2 className="font-black text-[var(--ink)] mb-12"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.04em", lineHeight: 0.95 }}>
              What I play
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.games.map((game, i) => (
              <motion.div
                key={game.name}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`ed-card p-6 ${game.color}`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-sm overflow-hidden bg-white/60 flex items-center justify-center shrink-0">
                    <Image src={game.logo} alt={game.name} width={48} height={48} className="object-cover" />
                  </div>
                  <h3 className="font-black text-[var(--ink)] text-lg leading-tight">{game.name}</h3>
                </div>
                <p className="text-sm text-[var(--ink)]/60 leading-relaxed">{game.summary}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── VIDEOS ───────────────────────────────────────────────────────────── */}
      <section id="videos" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <SectionLabel n="04" label="Videos" />
            <h2 className="font-black text-[var(--ink)] mb-12"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.04em", lineHeight: 0.95 }}>
              Highlights
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.videos.map((video, i) => (
              <motion.div
                key={i}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="ed-card overflow-hidden group"
              >
                <div className="relative aspect-video bg-[var(--pink-light)]/20 overflow-hidden">
                  <Image src={video.thumbnail} alt={video.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/25">
                    <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center">
                      <IconTwitch className="w-4 h-4 text-[var(--pink)]" />
                    </div>
                  </div>
                  <span className="absolute top-2 left-2 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-purple-600 text-white">
                    {(video as any).type === "vod" ? "VOD" : "Twitch"}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[var(--ink)] line-clamp-2 text-sm mb-1">{video.title}</h3>
                  <span className="text-xs text-[var(--ink)]/40 font-semibold">{video.views} views</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 justify-center mt-10">
            <a href={data.socialLinks.twitch} target="_blank" rel="noopener noreferrer">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="btn-main btn-pink">
                <IconTwitch className="w-4 h-4" /> Ver en Twitch
              </motion.button>
            </a>
            {data.socialLinks.kick && (
              <a href={data.socialLinks.kick} target="_blank" rel="noopener noreferrer">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="btn-main"
                  style={{ background: "#53fc18", color: "#000" }}>
                  <IconKick className="w-4 h-4" /> Kick
                </motion.button>
              </a>
            )}
            {data.socialLinks.tiktok && (
              <a href={data.socialLinks.tiktok} target="_blank" rel="noopener noreferrer">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="btn-main"
                  style={{ background: "#010101", color: "white" }}>
                  ✦ TikTok
                </motion.button>
              </a>
            )}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <SectionLabel n="05" label="FAQ" />
            <h2 className="font-black text-[var(--ink)] mb-12"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.04em", lineHeight: 0.95 }}>
              Questions
            </h2>
          </motion.div>

          <div className="space-y-0">
            {data.faqs.map((faq, i) => (
              <motion.div
                key={i}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="border-b border-black/[0.07]"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left gap-4"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xl w-8 text-center">{faq.icon}</span>
                    <span className="font-bold text-[var(--ink)]">{faq.question}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-[var(--pink)] shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 pl-12 text-[var(--ink)]/60 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── SUPPORT ──────────────────────────────────────────────────────────── */}
      <section id="support" className="py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-14">
            <SectionLabel n="06" label="Apoyame" />
            <h2 className="font-black text-[var(--ink)]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.04em", lineHeight: 0.95 }}>
              Support Rozu 💖
            </h2>
            <p className="text-[var(--ink)]/50 mt-4 text-lg max-w-lg">
              El apoyo de la comunidad hace posible seguir creando contenido. ¡Gracias por tanto!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                href: data.support.paypal,
                Icon: IconPayPal,
                label: "PayPal",
                description: "Donación directa, única o recurrente.",
                iconBg: "#003087",
                iconColor: "#ffffff",
                tag: "Donación",
              },
              {
                href: data.support.kofi,
                Icon: IconKofi,
                label: "Ko-fi",
                description: "Invitame un café y accedé al Ko-fi exclusivo de donors.",
                iconBg: "#FF5E5B",
                iconColor: "#ffffff",
                tag: "Donors",
              },
              {
                href: data.support.throne,
                Icon: IconThrone,
                label: "Throne",
                description: "Regalame algo de mi wishlist. Cada detalle importa 🫶",
                iconBg: "#ffffff",
                iconColor: "#000000",
                tag: "Wishlist",
              },
              {
                href: data.support.streamloots,
                Icon: IconStreamloots,
                label: "Streamloots",
                description: "Comprá cofres y usá cartas durante el stream.",
                iconBg: "#6c4de6",
                iconColor: "#ffffff",
                tag: "Cartas",
              },
            ].filter(s => s.href).map(({ href, Icon, label, description, iconBg, iconColor, tag }, i) => (
              <motion.a
                key={label}
                href={href} target="_blank" rel="noopener noreferrer"
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -3 }}
                className="ed-card p-6 flex items-start gap-5 group hover:border-[var(--pink)] transition-all"
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 text-xl font-black"
                  style={{ background: iconBg, color: iconColor }}>
                  <Icon className="w-7 h-7" style={{ color: iconColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-black text-[var(--ink)] text-lg leading-none">{label}</p>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-black/[0.07] text-[var(--ink)]/40">
                      {tag}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--ink)]/50 leading-relaxed">{description}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-[var(--ink)]/20 group-hover:text-[var(--pink)] transition-colors shrink-0 mt-1" />
              </motion.a>
            ))}
          </div>

          {/* Mensaje si ningún link está cargado */}
          {!data.support.paypal && !data.support.kofi && !data.support.throne && !data.support.streamloots && (
            <p className="text-center text-[var(--ink)]/20 text-sm mt-8">Links de soporte próximamente.</p>
          )}
        </div>
      </section>

      <div className="divider" />

      {/* ── CONTACT — bloque oscuro full-width ───────────────────────────────── */}
      <section id="contact" style={{ background: "var(--ink)" }} className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <div className="section-label mb-6" style={{ color: "var(--pink)" }}>✦ 07 — {data.contact.title}</div>
            <h2 className="font-black text-white mb-4"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.04em", lineHeight: 0.95 }}>
              Let's talk.
            </h2>
            <p className="text-white/50 mb-12 text-lg">{data.contact.subtitle}</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { href: data.socialLinks.twitter, Icon: IconTwitterX, label: "Twitter / X", handle: "@rozu_vt",    color: "#000000", bg: "#ffffff" },
              { href: data.socialLinks.discord, Icon: IconDiscord,  label: "Discord",     handle: "Join server", color: "#ffffff", bg: "#5865F2" },
              { href: data.socialLinks.twitch,  Icon: IconTwitch,   label: "Twitch",      handle: "/rozuVT",     color: "#ffffff", bg: "#9146FF" },
              { href: data.socialLinks.youtube, Icon: IconYoutube,  label: "YouTube",     handle: "@rozuvt",     color: "#ffffff", bg: "#FF0000" },
              { href: data.socialLinks.kick,    Icon: IconKick,     label: "Kick",        handle: "/rozuvt",     color: "#000000", bg: "#53FC18" },
              { href: data.socialLinks.tiktok,  Icon: IconTikTok,   label: "TikTok",      handle: "@rozuvt",     color: "#ffffff", bg: "#000000" },
            ].filter(s => s.href).map(({ href, Icon, label, handle, color, bg }, i) => (
              <motion.a
                key={label}
                href={href} target="_blank" rel="noopener noreferrer"
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-4 p-5 rounded-sm border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: bg }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white text-sm">{label}</p>
                  <p className="text-xs text-white/30">{handle}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
              </motion.a>
            ))}
          </div>

          <p className="text-white/20 text-sm mt-10 text-center">
            Para collabs y business: Twitter DM 💖
          </p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-black/[0.07] py-8">
        <div className="container mx-auto px-4 flex flex-col items-center gap-4 text-sm text-[var(--ink)]/40 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-2 font-black text-[var(--ink)]">
            Rozu<span style={{ color: "var(--pink)" }}>VT</span>
            <span className="spin-slow inline-block text-[var(--pink)]">✦</span>
          </div>
          <p>{data.footer.copyrightText}</p>
          <div className="flex gap-4">

            <Link href="/creditos" className="hover:text-[var(--pink)] transition-colors">Créditos</Link>

          </div>
        </div>
      </footer>

    </div>
  )
}
