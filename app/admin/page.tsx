"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import {
  Save,
  Eye,
  LogOut,
  ImageIcon,
  FileText,
  Calendar,
  Gamepad2,
  Video,
  HelpCircle,
  User,
  Mail,
  Plus,
  Trash2,
  Star,
  Clock,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { TweetScheduleImporter } from "@/components/tweet-schedule-importer"
import { VideoSync } from "@/components/video-sync"
import { GameSync } from "@/components/game-sync"

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

const defaultTimeline: TimelineData = {
  title: "El Camino de Rozu",
  subtitle: "Cada hito, cada momento, cada magia. 🦊",
  milestones: [
    { id: "1", date: "Mayo 2024",      title: "Debut",            description: "El inicio de todo. Primera stream como Rozu, una kitsune de una cola que llegó a hacer magia.",   icon: "🦊", image: "", highlight: true  },
    { id: "2", date: "Junio 2024",     title: "Primera Collab",   description: "Primer stream en conjunto con otra VTuber. Chaos garantizado, risas aseguradas.",                  icon: "💫", image: "", highlight: false },
    { id: "3", date: "Agosto 2024",    title: "100 Seguidores",   description: "La comunidad empieza a crecer. Cien personas eligieron quedarse a ver el caos.",                   icon: "🌸", image: "", highlight: false },
    { id: "4", date: "Octubre 2024",   title: "Twitch Affiliate", description: "¡Un hito enorme! El canal ya tiene emotes y sub button. La magia se hace oficial.",               icon: "⭐", image: "", highlight: true  },
    { id: "5", date: "Diciembre 2024", title: "500 Seguidores",   description: "Fin de año mágico. Quinientas personas siendo parte de esta aventura.",                            icon: "🎉", image: "", highlight: false },
    { id: "6", date: "Febrero 2025",   title: "Nuevo Modelo",     description: "Llega la segunda versión del modelo Live2D. Rozu evoluciona, más expresiva que nunca.",             icon: "✨", image: "", highlight: true  },
    { id: "7", date: "Abril 2025",     title: "1000 Seguidores",  description: "¡Cuatro dígitos! La comunidad sigue creciendo y el corazón no alcanza para tanto amor.",           icon: "💖", image: "", highlight: true  },
  ],
}

interface ModelEntry {
  id: string
  name: string
  imageSrc?: string
  designArtist?: string
  designHandle?: string
  designUrl?: string
  rigArtist?: string
  rigHandle?: string
  rigUrl?: string
  date?: string
  notes?: string
}

interface ContentData {
  hero: {
    title: string
    subtitle: string
    heroImage: string
  }
  about: {
    title: string
    description: string
  }
  schedule: {
    title: string
    subtitle: string
    discordTitle: string
    discordText: string
    discordButtonText: string
    scheduleNote: string
    tweetUrl: string
    scheduleImages: string[]
  }
  games: Array<{
    name: string
    logo: string
    summary: string
    color: string
  }>
  videos: Array<{
    title: string
    thumbnail: string
    views: string
    url: string
    platform: "youtube" | "twitch"
    videoId: string
  }>
  faqs: Array<{
    question: string
    answer: string
    icon: string
  }>
  models: ModelEntry[]
  contact: {
    title: string
    subtitle: string
  }
  footer: {
    brandText: string
    copyrightText: string
  }
  socialLinks: {
    twitch: string
    twitter: string
    youtube: string
    discord: string
    kick: string
    tiktok: string
  }
  support: {
    paypal: string
    kofi: string
    throne: string
    streamloots: string
  }
  backgroundImages: {
    hero: string
    about: string
    schedule: string
    games: string
    videos: string
    faq: string
    contact: string
  }
}

const defaultData: ContentData = {
  hero: {
    title: "¡Hola! I'm Rozu",
    subtitle:
      "A magical kitsune VTuber from Argentina. Join me for cozy gaming sessions, chaotic adventures, and lots of kawaii moments! Let's turn your world pink together!",
    heroImage: "/placeholder.svg?height=400&width=600",
  },
  about: {
    title: "About Me",
    description:
      "I'm a one-tailed kitsune (for now!) who loves spreading magic and chaos in equal measure. When I'm not streaming, you can find me sipping white wine and planning my next kawaii adventure! My goal is to make your day a little more pink and a lot more magical! ✨",
  },
  schedule: {
    title: "Stream Schedule",
    subtitle: "",
    discordTitle: "Stay Updated",
    discordText: "All stream announcements are made on Discord! Join our cozy community to never miss a stream! 💖",
    discordButtonText: "Join Discord Server",
    scheduleNote: "Schedule may vary - Discord is your best bet! 🦊",
    tweetUrl: "",
    scheduleImages: [],
  },
  games: [
    {
      name: "Stardew Valley",
      logo: "/placeholder.svg?height=64&width=64",
      summary: "Cozy farming simulator where I build my dream farm and make friends with the townspeople! 🌱",
      color: "from-rozu-pink-light to-rozu-pink-medium",
    },
    {
      name: "Genshin Impact",
      logo: "/placeholder.svg?height=64&width=64",
      summary: "Epic adventure RPG with beautiful worlds to explore and characters to collect! ⚔️",
      color: "from-rozu-blue-light to-rozu-purple-medium",
    },
    {
      name: "Minecraft",
      logo: "/placeholder.svg?height=64&width=64",
      summary: "Creative building game where I construct kawaii houses and explore endless worlds! 🧱",
      color: "from-rozu-pink-medium to-rozu-pink",
    },
    {
      name: "Animal Crossing",
      logo: "/placeholder.svg?height=64&width=64",
      summary: "Relaxing life sim where I decorate my island and hang out with adorable villagers! 🏝️",
      color: "from-rozu-purple-medium to-rozu-purple-dark",
    },
    {
      name: "Valorant",
      logo: "/placeholder.svg?height=64&width=64",
      summary: "Tactical FPS where I try my best to aim and work with my team (emphasis on try)! 🎯",
      color: "from-rozu-pink to-rozu-pink-dark",
    },
    {
      name: "League of Legends",
      logo: "/placeholder.svg?height=64&width=64",
      summary: "MOBA game where I play support and try to keep everyone alive and happy! ⚡",
      color: "from-rozu-blue-light to-rozu-pink-light",
    },
  ],
  videos: [
    {
      title: "First Stream Highlights",
      thumbnail: "/placeholder.svg?height=200&width=300",
      views: "12K",
      url: "",
      platform: "twitch",
      videoId: "",
    },
    {
      title: "Cooking with Rozu",
      thumbnail: "/placeholder.svg?height=200&width=300",
      views: "8.5K",
      url: "",
      platform: "youtube",
      videoId: "",
    },
    {
      title: "Minecraft Build Tour",
      thumbnail: "/placeholder.svg?height=200&width=300",
      views: "15K",
      url: "",
      platform: "youtube",
      videoId: "",
    },
    {
      title: "Q&A Session",
      thumbnail: "/placeholder.svg?height=200&width=300",
      views: "6.2K",
      url: "",
      platform: "twitch",
      videoId: "",
    },
    {
      title: "Genshin Gacha Pulls",
      thumbnail: "/placeholder.svg?height=200&width=300",
      views: "20K",
      url: "",
      platform: "youtube",
      videoId: "",
    },
    {
      title: "Singing Stream",
      thumbnail: "/placeholder.svg?height=200&width=300",
      views: "9.8K",
      url: "",
      platform: "twitch",
      videoId: "",
    },
  ],
  faqs: [
    {
      question: "When do you stream?",
      answer:
        "I stream Monday to Saturday! Check my schedule section for exact times. I always announce streams on Discord too! 🦊",
      icon: "📅",
    },
    {
      question: "What games do you play?",
      answer:
        "I love cozy games like Stardew Valley and Animal Crossing, but I also enjoy Genshin Impact and Minecraft! I'm always open to suggestions! ✨",
      icon: "🎮",
    },
    {
      question: "Can I use your emotes?",
      answer: "Yes! My emotes are available for subscribers. You can also find some free ones in my Discord server! 💖",
      icon: "😊",
    },
    {
      question: "How can I support you?",
      answer:
        "Following me on social media, subscribing on Twitch, and just chatting in stream means the world to me! 🌸",
      icon: "💝",
    },
  ],
  models: [
    {
      id: "m1",
      name: "Modelo Principal v1",
      imageSrc: "",
      designArtist: "Nombre del artista",
      designHandle: "@artista_twitter",
      designUrl: "https://twitter.com/artista_twitter",
      rigArtist: "Nombre del rigger",
      rigHandle: "@rigger_twitter",
      rigUrl: "https://twitter.com/rigger_twitter",
      date: "2025",
      notes: "El modelo con el que debuté.",
    },
  ],
  contact: {
    title: "Get in Touch",
    subtitle: "Have a question or want to collaborate? Send me a message!",
  },
  footer: {
    brandText: "RozuVT",
    copyrightText: "© 2025 RozuVT - Made with magic, wine, and lots of love 🦊💖",
  },
  socialLinks: {
    twitch: "https://twitch.tv/rozuVT",
    twitter: "https://twitter.com/rozu_vt",
    youtube: "https://youtube.com/@rozuvt",
    discord: "https://discord.gg/rozuvt",

    kick: "https://kick.com/rozuvt",
    tiktok: "https://tiktok.com/@rozuvt",
  },
  support: {
    paypal: "",
    kofi: "",
    throne: "",
    streamloots: "",
  },
  backgroundImages: {
    hero: "",
    about: "",
    schedule: "",
    games: "",
    videos: "",
    faq: "",
    contact: "",
  },
}

const extractYouTubeId = (url: string): string => {
  const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : ""
}

const extractTwitchId = (url: string): string => {
  const regex = /(?:twitch\.tv\/videos\/|clips\.twitch\.tv\/)([a-zA-Z0-9_-]+)/
  const match = url.match(regex)
  return match ? match[1] : ""
}

const importVideoFromURL = async (url: string, index: number, setContentData: any) => {
  try {
    let platform: "youtube" | "twitch" = "youtube"
    let videoId = ""
    let thumbnail = ""

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      platform = "youtube"
      videoId = extractYouTubeId(url)
      thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    } else if (url.includes("twitch.tv")) {
      platform = "twitch"
      videoId = extractTwitchId(url)
      // Para Twitch necesitarías la API, por ahora usamos placeholder
      thumbnail = "/placeholder.svg?height=200&width=300"
    }

    setContentData((prev: ContentData) => ({
      ...prev,
      videos: prev.videos.map((video: ContentData["videos"][number], i: number) =>
        i === index
          ? {
              ...video,
              url,
              platform,
              videoId,
              thumbnail: thumbnail || video.thumbnail,
            }
          : video,
      ),
    }))

    alert(`Video importado exitosamente desde ${platform}!`)
  } catch (error) {
    alert("Error al importar el video. Verifica la URL.")
  }
}

export default function AdminPanel() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [activeTab, setActiveTab] = useState("hero")
  const [contentData, setContentData] = useState<ContentData>(defaultData)
  const [timelineData, setTimelineData] = useState<TimelineData>(defaultTimeline)

  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem("rozu-admin-auth")
    if (auth === "authenticated") {
      setIsAuthenticated(true)
    }

    // Load timeline data
    const savedTimeline = localStorage.getItem("rozu-timeline-v2")
    if (savedTimeline) {
      try { setTimelineData({ ...defaultTimeline, ...JSON.parse(savedTimeline) }) } catch {}
    }

    // Load saved content data
    const savedData = localStorage.getItem("rozu-content-data")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        // Add missing properties with defaults
        const migratedData = {
          ...defaultData,
          ...parsedData,
          models: parsedData.models ?? defaultData.models,
          support: { ...defaultData.support, ...parsedData.support },
          backgroundImages: {
            ...defaultData.backgroundImages,
            ...parsedData.backgroundImages,
          },
        }
        setContentData(migratedData)
      } catch (error) {
        console.error("Error parsing saved data:", error)
        setContentData(defaultData)
      }
    }
  }, [])

  const handleLogin = () => {
    // Simple password check - in production, use proper authentication
    if (password === "RozuAdmin2025!") {
      setIsAuthenticated(true)
      localStorage.setItem("rozu-admin-auth", "authenticated")
    } else {
      alert("Contraseña incorrecta")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("rozu-admin-auth")
    router.push("/")
  }

  const handleSave = () => {
    localStorage.setItem("rozu-content-data", JSON.stringify(contentData))
    localStorage.setItem("rozu-timeline-v2", JSON.stringify(timelineData))
    alert("¡Contenido guardado exitosamente!")
  }

  const addMilestone = () => {
    setTimelineData((prev) => ({
      ...prev,
      milestones: [...prev.milestones, { id: String(Date.now()), date: "Mes Año", title: "Nuevo hito", description: "Descripción del hito.", icon: "✦", image: "", highlight: false }],
    }))
  }

  const removeMilestone = (id: string) => {
    setTimelineData((prev) => ({ ...prev, milestones: prev.milestones.filter((m) => m.id !== id) }))
  }

  const updateMilestone = (id: string, patch: Partial<Milestone>) => {
    setTimelineData((prev) => ({ ...prev, milestones: prev.milestones.map((m) => m.id === id ? { ...m, ...patch } : m) }))
  }

  const handleMilestoneImage = (file: File, id: string) => {
    const reader = new FileReader()
    reader.onload = (e) => updateMilestone(id, { image: e.target?.result as string })
    reader.readAsDataURL(file)
  }

  const handleImageUpload = (file: File, section: string, index?: number, field?: string) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string

      if (section === "hero" && field === "heroImage") {
        setContentData((prev) => ({
          ...prev,
          hero: { ...prev.hero, heroImage: result },
        }))
      } else if (section === "games" && typeof index === "number" && field === "logo") {
        setContentData((prev) => ({
          ...prev,
          games: prev.games.map((game, i) => (i === index ? { ...game, logo: result } : game)),
        }))
      } else if (section === "videos" && typeof index === "number" && field === "thumbnail") {
        setContentData((prev) => ({
          ...prev,
          videos: prev.videos.map((video, i) => (i === index ? { ...video, thumbnail: result } : video)),
        }))
      } else if (section === "models" && typeof index === "number" && field === "imageSrc") {
        setContentData((prev) => ({
          ...prev,
          models: prev.models.map((m, i) => (i === index ? { ...m, imageSrc: result } : m)),
        }))
      } else if (section === "backgrounds" && field) {
        setContentData((prev) => ({
          ...prev,
          backgroundImages: { ...prev.backgroundImages, [field]: result },
        }))
      }
    }
    reader.readAsDataURL(file)
  }

  const addModel = () => {
    setContentData((prev) => ({
      ...prev,
      models: [
        ...prev.models,
        {
          id: `m${Date.now()}`,
          name: "Nuevo modelo",
          imageSrc: "",
          designArtist: "",
          designHandle: "",
          designUrl: "",
          rigArtist: "",
          rigHandle: "",
          rigUrl: "",
          date: "",
          notes: "",
        },
      ],
    }))
  }

  const removeModel = (index: number) => {
    setContentData((prev) => ({
      ...prev,
      models: prev.models.filter((_, i) => i !== index),
    }))
  }

  const addFAQ = () => {
    setContentData((prev) => ({
      ...prev,
      faqs: [
        ...prev.faqs,
        {
          question: "Nueva pregunta",
          answer: "Nueva respuesta",
          icon: "❓",
        },
      ],
    }))
  }

  const removeFAQ = (index: number) => {
    setContentData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }))
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--cream)" }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-96 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl" style={{ color: "var(--pink)" }}>
                Panel Admin — RozuVT
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  className="mt-1"
                />
              </div>
              <Button onClick={handleLogin} className="w-full" style={{ background: "var(--pink)", color: "white" }}>
                Iniciar Sesión
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-black/[0.07]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg lg:text-2xl font-black" style={{ color: "var(--ink)" }}>
              Panel Admin — <span style={{ color: "var(--pink)" }}>RozuVT</span>
            </h1>
            <div className="flex gap-1 lg:gap-2">
              <Button
                onClick={() => window.open("/", "_blank")}
                variant="outline"
                className="text-xs lg:text-sm px-2 lg:px-4"
                style={{ borderColor: "var(--pink)", color: "var(--pink)" }}
              >
                <Eye className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Ver Landing</span>
                <span className="sm:hidden">Ver</span>
              </Button>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-xs lg:text-sm px-2 lg:px-4">
                <Save className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Guardar</span>
                <span className="sm:hidden">Guardar</span>
              </Button>
              <Button onClick={handleLogout} variant="destructive" className="text-xs lg:text-sm px-2 lg:px-4">
                <LogOut className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Salir</span>
                <span className="sm:hidden">Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-1 lg:gap-2 h-auto p-1 lg:p-2 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="hero" className="flex flex-col gap-1 p-2 lg:p-3">
              <User className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="text-xs">Inicio</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex flex-col gap-1 p-2 lg:p-3">
              <FileText className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="text-xs">Sobre mí</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex flex-col gap-1 p-2 lg:p-3">
              <Calendar className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="text-xs">Horario</span>
            </TabsTrigger>
            <TabsTrigger value="games" className="flex flex-col gap-1 p-2 lg:p-3">
              <Gamepad2 className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="text-xs">Juegos</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex flex-col gap-1 p-2 lg:p-3">
              <Video className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="text-xs">Videos</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex flex-col gap-1 p-2 lg:p-3">
              <HelpCircle className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="text-xs">FAQ</span>
            </TabsTrigger>
            <TabsTrigger value="modelos" className="flex flex-col gap-1 p-2 lg:p-3">
              <ImageIcon className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="text-xs">Modelos</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="flex flex-col gap-1 p-2 lg:p-3">
              <Star className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="text-xs">Apoyame</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex flex-col gap-1 p-2 lg:p-3">
              <Mail className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="text-xs">Contacto</span>
            </TabsTrigger>
            <TabsTrigger value="backgrounds" className="flex flex-col gap-1 p-2 lg:p-3">
              <ImageIcon className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="text-xs">Fondos</span>
            </TabsTrigger>
            <TabsTrigger value="footer" className="flex flex-col gap-1 p-2 lg:p-3">
              <FileText className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="text-xs">Footer</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex flex-col gap-1 p-2 lg:p-3">
              <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="text-xs">Timeline</span>
            </TabsTrigger>
          </TabsList>

          {/* Sección Inicio */}
          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle>Sección Inicio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="hero-title">Título Principal</Label>
                  <Input
                    id="hero-title"
                    value={contentData.hero.title}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, title: e.target.value },
                      }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="hero-subtitle">Subtítulo</Label>
                  <Textarea
                    id="hero-subtitle"
                    value={contentData.hero.subtitle}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, subtitle: e.target.value },
                      }))
                    }
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Imagen de Portada</Label>
                  <div className="mt-2 space-y-2">
                    <div className="relative w-32 h-20 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={contentData.hero.heroImage || "/placeholder.svg"}
                        alt="Hero"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file, "hero", undefined, "heroImage")
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sección Sobre mí */}
          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>Sección Sobre mí</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="about-title">Título</Label>
                  <Input
                    id="about-title"
                    value={contentData.about.title}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        about: { ...prev.about, title: e.target.value },
                      }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="about-description">Descripción</Label>
                  <Textarea
                    id="about-description"
                    value={contentData.about.description}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        about: { ...prev.about, description: e.target.value },
                      }))
                    }
                    className="mt-1"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Games Section */}
          <TabsContent value="games">
            <Card>
              <CardHeader>
                <CardTitle>Sección Juegos Favoritos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <GameSync
                  onSync={(games) =>
                    setContentData((prev) => ({ ...prev, games }))
                  }
                />
                {contentData.games.map((game, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <h3 className="font-semibold text-lg">Juego {index + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nombre del Juego</Label>
                        <Input
                          value={game.name}
                          onChange={(e) =>
                            setContentData((prev) => ({
                              ...prev,
                              games: prev.games.map((g, i) => (i === index ? { ...g, name: e.target.value } : g)),
                            }))
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Color del Gradiente</Label>
                        <Input
                          value={game.color}
                          onChange={(e) =>
                            setContentData((prev) => ({
                              ...prev,
                              games: prev.games.map((g, i) => (i === index ? { ...g, color: e.target.value } : g)),
                            }))
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Resumen</Label>
                      <Textarea
                        value={game.summary}
                        onChange={(e) =>
                          setContentData((prev) => ({
                            ...prev,
                            games: prev.games.map((g, i) => (i === index ? { ...g, summary: e.target.value } : g)),
                          }))
                        }
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>Logo del Juego</Label>
                      <div className="mt-2 space-y-2">
                        <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          <Image src={game.logo || "/placeholder.svg"} alt={game.name} fill className="object-cover" />
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(file, "games", index, "logo")
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sección Videos */}
          <TabsContent value="videos">
            <Card>
              <CardHeader>
                <CardTitle>Sección Videos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <VideoSync
                  onSync={(videos) =>
                    setContentData((prev: ContentData) => ({ ...prev, videos }))
                  }
                />
                {contentData.videos.map((video, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <h3 className="font-semibold text-lg">Video {index + 1}</h3>

                    <div>
                      <Label>Importar desde URL (YouTube/Twitch)</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          placeholder="https://youtube.com/watch?v=... ó https://twitch.tv/videos/..."
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              const url = (e.target as HTMLInputElement).value
                              if (url) {
                                importVideoFromURL(url, index, setContentData)
                                ;(e.target as HTMLInputElement).value = ""
                              }
                            }
                          }}
                        />
                        <Button
                          onClick={() => {
                            const input = document.querySelector('input[placeholder*="youtube"]') as HTMLInputElement
                            const url = input?.value
                            if (url) {
                              importVideoFromURL(url, index, setContentData)
                              input.value = ""
                            }
                          }}
                          style={{ background: "var(--purple)", color: "white" }}
                        >
                          Importar
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Título del Video</Label>
                        <Input
                          value={video.title}
                          onChange={(e) =>
                            setContentData((prev) => ({
                              ...prev,
                              videos: prev.videos.map((v, i) => (i === index ? { ...v, title: e.target.value } : v)),
                            }))
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Vistas</Label>
                        <Input
                          value={video.views}
                          onChange={(e) =>
                            setContentData((prev) => ({
                              ...prev,
                              videos: prev.videos.map((v, i) => (i === index ? { ...v, views: e.target.value } : v)),
                            }))
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Plataforma</Label>
                        <select
                          value={video.platform}
                          onChange={(e) =>
                            setContentData((prev) => ({
                              ...prev,
                              videos: prev.videos.map((v, i) =>
                                i === index ? { ...v, platform: e.target.value as "youtube" | "twitch" } : v,
                              ),
                            }))
                          }
                          className="mt-1 w-full p-2 border rounded-md"
                        >
                          <option value="youtube">YouTube</option>
                          <option value="twitch">Twitch</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label>URL del Video</Label>
                      <Input
                        value={video.url}
                        onChange={(e) =>
                          setContentData((prev) => ({
                            ...prev,
                            videos: prev.videos.map((v, i) => (i === index ? { ...v, url: e.target.value } : v)),
                          }))
                        }
                        className="mt-1"
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <Label>Thumbnail</Label>
                      <div className="mt-2 space-y-2">
                        <div className="relative w-32 h-20 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={video.thumbnail || "/placeholder.svg"}
                            alt={video.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(file, "videos", index, "thumbnail")
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ Section */}
          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Preguntas Frecuentes (FAQ)
                  <Button onClick={addFAQ} style={{ background: "var(--pink)", color: "white" }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar pregunta
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contentData.faqs.map((faq, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">FAQ {index + 1}</h3>
                      <Button onClick={() => removeFAQ(index)} variant="destructive" size="sm" className="h-8 w-8 p-0">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Pregunta</Label>
                        <Input
                          value={faq.question}
                          onChange={(e) =>
                            setContentData((prev) => ({
                              ...prev,
                              faqs: prev.faqs.map((f, i) => (i === index ? { ...f, question: e.target.value } : f)),
                            }))
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Emoji/Icono</Label>
                        <Input
                          value={faq.icon}
                          onChange={(e) =>
                            setContentData((prev) => ({
                              ...prev,
                              faqs: prev.faqs.map((f, i) => (i === index ? { ...f, icon: e.target.value } : f)),
                            }))
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Respuesta</Label>
                      <Textarea
                        value={faq.answer}
                        onChange={(e) =>
                          setContentData((prev) => ({
                            ...prev,
                            faqs: prev.faqs.map((f, i) => (i === index ? { ...f, answer: e.target.value } : f)),
                          }))
                        }
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sección Modelos */}
          <TabsContent value="modelos">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Modelos VTuber
                  <button
                    onClick={addModel}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                    style={{ background: "var(--ink)", color: "white" }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Agregar modelo
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <p className="text-sm text-[var(--ink)]/50">
                  Los modelos se muestran en la página <strong>/creditos</strong> → tab "Modelos".
                </p>

                {contentData.models.map((model, index) => (
                  <div key={model.id} className="p-6 border border-black/[0.08] rounded-lg space-y-6">
                    {/* Cabecera del modelo */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-[var(--ink)]">Modelo {index + 1}</h3>
                      <button
                        onClick={() => removeModel(index)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Eliminar
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
                      {/* Imagen */}
                      <div className="space-y-2">
                        <Label>Imagen del modelo</Label>
                        <div
                          className="relative w-full aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden border border-black/[0.07]"
                        >
                          {model.imageSrc ? (
                            <Image
                              src={model.imageSrc}
                              alt={model.name}
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-4xl">🦊</div>
                          )}
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(file, "models", index, "imageSrc")
                          }}
                        />
                        {model.imageSrc && (
                          <button
                            onClick={() =>
                              setContentData((prev) => ({
                                ...prev,
                                models: prev.models.map((m, i) => (i === index ? { ...m, imageSrc: "" } : m)),
                              }))
                            }
                            className="text-xs text-red-500 hover:underline"
                          >
                            Quitar imagen
                          </button>
                        )}
                      </div>

                      {/* Campos de texto */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label>Nombre del modelo</Label>
                            <Input
                              value={model.name}
                              onChange={(e) =>
                                setContentData((prev) => ({
                                  ...prev,
                                  models: prev.models.map((m, i) =>
                                    i === index ? { ...m, name: e.target.value } : m
                                  ),
                                }))
                              }
                              className="mt-1"
                              placeholder="Ej: Modelo Principal v1"
                            />
                          </div>
                          <div>
                            <Label>Año</Label>
                            <Input
                              value={model.date ?? ""}
                              onChange={(e) =>
                                setContentData((prev) => ({
                                  ...prev,
                                  models: prev.models.map((m, i) =>
                                    i === index ? { ...m, date: e.target.value } : m
                                  ),
                                }))
                              }
                              className="mt-1"
                              placeholder="Ej: 2025"
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Notas</Label>
                          <Textarea
                            value={model.notes ?? ""}
                            onChange={(e) =>
                              setContentData((prev) => ({
                                ...prev,
                                models: prev.models.map((m, i) =>
                                  i === index ? { ...m, notes: e.target.value } : m
                                ),
                              }))
                            }
                            className="mt-1"
                            rows={2}
                            placeholder="Descripción breve del modelo..."
                          />
                        </div>

                        {/* Artista de diseño */}
                        <div className="pt-2 border-t border-black/[0.06]">
                          <p className="text-xs font-black uppercase tracking-widest text-[var(--ink)]/30 mb-3">
                            Diseño del personaje
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <Label>Nombre del artista</Label>
                              <Input
                                value={model.designArtist ?? ""}
                                onChange={(e) =>
                                  setContentData((prev) => ({
                                    ...prev,
                                    models: prev.models.map((m, i) =>
                                      i === index ? { ...m, designArtist: e.target.value } : m
                                    ),
                                  }))
                                }
                                className="mt-1"
                                placeholder="Nombre"
                              />
                            </div>
                            <div>
                              <Label>Handle (@)</Label>
                              <Input
                                value={model.designHandle ?? ""}
                                onChange={(e) =>
                                  setContentData((prev) => ({
                                    ...prev,
                                    models: prev.models.map((m, i) =>
                                      i === index ? { ...m, designHandle: e.target.value } : m
                                    ),
                                  }))
                                }
                                className="mt-1"
                                placeholder="@artista"
                              />
                            </div>
                            <div>
                              <Label>URL</Label>
                              <Input
                                value={model.designUrl ?? ""}
                                onChange={(e) =>
                                  setContentData((prev) => ({
                                    ...prev,
                                    models: prev.models.map((m, i) =>
                                      i === index ? { ...m, designUrl: e.target.value } : m
                                    ),
                                  }))
                                }
                                className="mt-1"
                                placeholder="https://twitter.com/..."
                              />
                            </div>
                          </div>
                        </div>

                        {/* Rigger */}
                        <div className="pt-2 border-t border-black/[0.06]">
                          <p className="text-xs font-black uppercase tracking-widest text-[var(--ink)]/30 mb-3">
                            Live2D Rigging
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <Label>Nombre del rigger</Label>
                              <Input
                                value={model.rigArtist ?? ""}
                                onChange={(e) =>
                                  setContentData((prev) => ({
                                    ...prev,
                                    models: prev.models.map((m, i) =>
                                      i === index ? { ...m, rigArtist: e.target.value } : m
                                    ),
                                  }))
                                }
                                className="mt-1"
                                placeholder="Nombre"
                              />
                            </div>
                            <div>
                              <Label>Handle (@)</Label>
                              <Input
                                value={model.rigHandle ?? ""}
                                onChange={(e) =>
                                  setContentData((prev) => ({
                                    ...prev,
                                    models: prev.models.map((m, i) =>
                                      i === index ? { ...m, rigHandle: e.target.value } : m
                                    ),
                                  }))
                                }
                                className="mt-1"
                                placeholder="@rigger"
                              />
                            </div>
                            <div>
                              <Label>URL</Label>
                              <Input
                                value={model.rigUrl ?? ""}
                                onChange={(e) =>
                                  setContentData((prev) => ({
                                    ...prev,
                                    models: prev.models.map((m, i) =>
                                      i === index ? { ...m, rigUrl: e.target.value } : m
                                    ),
                                  }))
                                }
                                className="mt-1"
                                placeholder="https://twitter.com/..."
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {contentData.models.length === 0 && (
                  <div className="text-center py-12 text-[var(--ink)]/30">
                    <p className="text-4xl mb-3">🦊</p>
                    <p className="font-semibold">No hay modelos cargados aún.</p>
                    <p className="text-sm mt-1">Hacé clic en "Agregar modelo" para empezar.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Apoyame */}
          <TabsContent value="support">
            <Card>
              <CardHeader>
                <CardTitle>Apoyame — Links de soporte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-[var(--ink)]/50">
                  Dejá vacío cualquier campo que no uses — no aparecerá en la landing.
                </p>
                {[
                  { key: "paypal",      label: "PayPal",       placeholder: "https://paypal.me/..." },
                  { key: "kofi",        label: "Ko-fi",        placeholder: "https://ko-fi.com/..." },
                  { key: "throne",      label: "Throne",       placeholder: "https://throne.com/..." },
                  { key: "streamloots", label: "Streamloots",  placeholder: "https://www.streamloots.com/..." },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <Label>{label}</Label>
                    <Input
                      value={contentData.support[key as keyof typeof contentData.support]}
                      onChange={(e) =>
                        setContentData((prev) => ({
                          ...prev,
                          support: { ...prev.support, [key]: e.target.value },
                        }))
                      }
                      className="mt-1"
                      placeholder={placeholder}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contacto & Redes Sociales */}
          <TabsContent value="contact">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sección Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Título</Label>
                    <Input
                      value={contentData.contact.title}
                      onChange={(e) =>
                        setContentData((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, title: e.target.value },
                        }))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Subtítulo</Label>
                    <Input
                      value={contentData.contact.subtitle}
                      onChange={(e) =>
                        setContentData((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, subtitle: e.target.value },
                        }))
                      }
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Enlaces Sociales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Twitch</Label>
                    <Input
                      value={contentData.socialLinks.twitch}
                      onChange={(e) =>
                        setContentData((prev) => ({
                          ...prev,
                          socialLinks: { ...prev.socialLinks, twitch: e.target.value },
                        }))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Twitter</Label>
                    <Input
                      value={contentData.socialLinks.twitter}
                      onChange={(e) =>
                        setContentData((prev) => ({
                          ...prev,
                          socialLinks: { ...prev.socialLinks, twitter: e.target.value },
                        }))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>YouTube</Label>
                    <Input
                      value={contentData.socialLinks.youtube}
                      onChange={(e) =>
                        setContentData((prev) => ({
                          ...prev,
                          socialLinks: { ...prev.socialLinks, youtube: e.target.value },
                        }))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Discord</Label>
                    <Input
                      value={contentData.socialLinks.discord}
                      onChange={(e) =>
                        setContentData((prev) => ({
                          ...prev,
                          socialLinks: { ...prev.socialLinks, discord: e.target.value },
                        }))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Kick</Label>
                    <Input
                      value={contentData.socialLinks.kick}
                      onChange={(e) =>
                        setContentData((prev) => ({
                          ...prev,
                          socialLinks: { ...prev.socialLinks, kick: e.target.value },
                        }))
                      }
                      className="mt-1"
                      placeholder="https://kick.com/rozuvt"
                    />
                  </div>
                  <div>
                    <Label>TikTok</Label>
                    <Input
                      value={contentData.socialLinks.tiktok}
                      onChange={(e) =>
                        setContentData((prev) => ({
                          ...prev,
                          socialLinks: { ...prev.socialLinks, tiktok: e.target.value },
                        }))
                      }
                      className="mt-1"
                      placeholder="https://tiktok.com/@rozuvt"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Sección Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* ── Importar desde tweet ─────────────────────────────────── */}
                <TweetScheduleImporter
                  onImport={(tweetUrl, scheduleImages) =>
                    setContentData((prev) => ({
                      ...prev,
                      schedule: { ...prev.schedule, tweetUrl, scheduleImages },
                    }))
                  }
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Título Principal</Label>
                    <Input
                      value={contentData.schedule.title}
                      onChange={(e) =>
                        setContentData((prev) => ({
                          ...prev,
                          schedule: { ...prev.schedule, title: e.target.value },
                        }))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Subtítulo (opcional)</Label>
                    <Input
                      value={contentData.schedule.subtitle}
                      onChange={(e) =>
                        setContentData((prev) => ({
                          ...prev,
                          schedule: { ...prev.schedule, subtitle: e.target.value },
                        }))
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Título Discord</Label>
                  <Input
                    value={contentData.schedule.discordTitle}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        schedule: { ...prev.schedule, discordTitle: e.target.value },
                      }))
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Texto Discord</Label>
                  <Textarea
                    value={contentData.schedule.discordText}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        schedule: { ...prev.schedule, discordText: e.target.value },
                      }))
                    }
                    className="mt-1"
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Texto del Botón Discord</Label>
                  <Input
                    value={contentData.schedule.discordButtonText}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        schedule: { ...prev.schedule, discordButtonText: e.target.value },
                      }))
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Nota del Schedule</Label>
                  <Input
                    value={contentData.schedule.scheduleNote}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        schedule: { ...prev.schedule, scheduleNote: e.target.value },
                      }))
                    }
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Background Images Section */}
          <TabsContent value="backgrounds">
            <Card>
              <CardHeader>
                <CardTitle>Imágenes de Fondo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(contentData.backgroundImages).map(([section, image]) => (
                  <div key={section} className="p-4 border rounded-lg space-y-4">
                    <h3 className="font-semibold text-lg capitalize">Sección {section}</h3>
                    <div>
                      <Label>Imagen de fondo</Label>
                      <div className="mt-2 space-y-2">
                        <div className="relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`${section} background`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(file, "backgrounds", undefined, section)
                          }}
                        />
                        {image && (
                          <Button
                            onClick={() =>
                              setContentData((prev) => ({
                                ...prev,
                                backgroundImages: { ...prev.backgroundImages, [section]: "" },
                              }))
                            }
                            variant="outline"
                            size="sm"
                          >
                            Remover fondo
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline */}
          <TabsContent value="timeline">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Encabezado del Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Título</Label>
                    <Input
                      value={timelineData.title}
                      onChange={(e) => setTimelineData((prev) => ({ ...prev, title: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Subtítulo</Label>
                    <Input
                      value={timelineData.subtitle}
                      onChange={(e) => setTimelineData((prev) => ({ ...prev, subtitle: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Hitos
                    <Button onClick={addMilestone} style={{ background: "var(--pink)", color: "white" }}>
                      <Plus className="w-4 h-4 mr-2" /> Agregar hito
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {timelineData.milestones.map((m, index) => (
                    <div key={m.id} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Hito {index + 1}</h3>
                        <Button onClick={() => removeMilestone(m.id)} variant="destructive" size="sm" className="h-8 w-8 p-0">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <Label>Emoji</Label>
                          <Input value={m.icon} onChange={(e) => updateMilestone(m.id, { icon: e.target.value })} className="mt-1 text-center text-xl" />
                        </div>
                        <div className="col-span-1 md:col-span-3">
                          <Label>Fecha</Label>
                          <Input value={m.date} onChange={(e) => updateMilestone(m.id, { date: e.target.value })} className="mt-1" placeholder="Mayo 2024" />
                        </div>
                      </div>

                      <div>
                        <Label>Título</Label>
                        <Input value={m.title} onChange={(e) => updateMilestone(m.id, { title: e.target.value })} className="mt-1" />
                      </div>

                      <div>
                        <Label>Descripción</Label>
                        <Textarea value={m.description} onChange={(e) => updateMilestone(m.id, { description: e.target.value })} className="mt-1" rows={2} />
                      </div>

                      <div>
                        <Label>Imagen (opcional)</Label>
                        <div className="mt-2 space-y-2">
                          {m.image && (
                            <div className="relative w-full h-28 rounded-lg overflow-hidden bg-gray-100">
                              <Image src={m.image} alt={m.title} fill className="object-cover" />
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleMilestoneImage(f, m.id) }}
                            />
                            {m.image && (
                              <Button onClick={() => updateMilestone(m.id, { image: "" })} variant="outline" size="sm">
                                Quitar
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={m.highlight}
                          onChange={(e) => updateMilestone(m.id, { highlight: e.target.checked })}
                          className="w-4 h-4"
                          style={{ accentColor: "var(--pink)" }}
                        />
                        Destacar este hito ⭐
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="footer">
            <Card>
              <CardHeader>
                <CardTitle>Sección Footer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Texto de Marca</Label>
                  <Input
                    value={contentData.footer.brandText}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        footer: { ...prev.footer, brandText: e.target.value },
                      }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Texto de Copyright</Label>
                  <Input
                    value={contentData.footer.copyrightText}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        footer: { ...prev.footer, copyrightText: e.target.value },
                      }))
                    }
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
