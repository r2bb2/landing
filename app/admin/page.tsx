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
  Tag,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

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
    days: Array<{
      name: string
      time: string
      enabled: boolean
      isRestDay: boolean
      restText: string
    }>
    discordTitle: string
    discordText: string
    discordButtonText: string
    scheduleNote: string
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
  modelImages: Array<{
    type: string
    src: string
    title: string
  }>
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
    zorrid: string
  }
  etiqueta: {
    title: string
    content: string
    image1: string
    image2: string
  }
  backgroundImages: {
    hero: string
    about: string
    schedule: string
    games: string
    videos: string
    faq: string
    model: string
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
    days: [
      { name: "Monday", time: "8:00 PM ART", enabled: true, isRestDay: false, restText: "" },
      { name: "Tuesday", time: "8:00 PM ART", enabled: true, isRestDay: false, restText: "" },
      { name: "Wednesday", time: "8:00 PM ART", enabled: true, isRestDay: false, restText: "" },
      { name: "Thursday", time: "8:00 PM ART", enabled: true, isRestDay: false, restText: "" },
      { name: "Friday", time: "8:00 PM ART", enabled: true, isRestDay: false, restText: "" },
      { name: "Saturday", time: "8:00 PM ART", enabled: true, isRestDay: false, restText: "" },
      { name: "Sunday", time: "", enabled: true, isRestDay: true, restText: "Rest Day 😴" },
    ],
    discordTitle: "Stay Updated",
    discordText: "All stream announcements are made on Discord! Join our cozy community to never miss a stream! 💖",
    discordButtonText: "Join Discord Server",
    scheduleNote: "Schedule may vary - Discord is your best bet! 🦊",
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
  modelImages: [
    { type: "render", src: "/placeholder.svg?height=300&width=200", title: "Full Body Render" },
    { type: "chibi", src: "/placeholder.svg?height=200&width=200", title: "Chibi Version" },
    { type: "emote", src: "/placeholder.svg?height=150&width=150", title: "Happy Emote" },
    { type: "emote", src: "/placeholder.svg?height=150&width=150", title: "Sad Emote" },
    { type: "render", src: "/placeholder.svg?height=300&width=200", title: "Casual Outfit" },
    { type: "chibi", src: "/placeholder.svg?height=200&width=200", title: "Sleepy Chibi" },
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
    zorrid: "https://zorrid.com/creator",
  },
  etiqueta: {
    title: "Etiqueta VTuber",
    content:
      "Bienvenidos a mi página de etiqueta VTuber. Aquí encontrarás toda la información importante sobre las reglas de mi comunidad, cómo interactuar en mis streams y qué esperar de mi contenido. Mi objetivo es crear un espacio seguro y divertido para todos! 🦊✨\n\nRecuerda siempre ser respetuoso con otros viewers, evitar el spam en el chat, y sobre todo... ¡diviértete! Estoy aquí para crear momentos mágicos juntos.",
    image1: "/placeholder.svg?height=400&width=600",
    image2: "/placeholder.svg?height=400&width=600",
  },
  backgroundImages: {
    hero: "",
    about: "",
    schedule: "",
    games: "",
    videos: "",
    faq: "",
    model: "",
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

    setContentData((prev) => ({
      ...prev,
      videos: prev.videos.map((video, i) =>
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

  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem("rozu-admin-auth")
    if (auth === "authenticated") {
      setIsAuthenticated(true)
    }

    // Load saved content data
    const savedData = localStorage.getItem("rozu-content-data")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        // Migrate old data structure if needed
        if (parsedData.schedule && parsedData.schedule.days) {
          parsedData.schedule.days = parsedData.schedule.days.map((day: any) => ({
            ...day,
            isRestDay: day.isRestDay || false,
            restText: day.restText || (day.name === "Sunday" ? "Rest Day 😴" : ""),
          }))
        }
        // Add missing properties with defaults
        const migratedData = {
          ...defaultData,
          ...parsedData,
          etiqueta: {
            ...defaultData.etiqueta,
            ...parsedData.etiqueta,
          },
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
    alert("¡Contenido guardado exitosamente!")
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
      } else if (section === "modelImages" && typeof index === "number" && field === "src") {
        setContentData((prev) => ({
          ...prev,
          modelImages: prev.modelImages.map((img, i) => (i === index ? { ...img, src: result } : img)),
        }))
      } else if (section === "etiqueta" && field === "image1") {
        setContentData((prev) => ({
          ...prev,
          etiqueta: { ...prev.etiqueta, image1: result },
        }))
      } else if (section === "etiqueta" && field === "image2") {
        setContentData((prev) => ({
          ...prev,
          etiqueta: { ...prev.etiqueta, image2: result },
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
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-96 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl bg-gradient-to-r from-rozu-pink to-rozu-purple-medium bg-clip-text text-transparent">
                Admin Panel - RozuVT
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
              <Button onClick={handleLogin} className="w-full bg-rozu-pink hover:bg-rozu-pink-dark">
                Iniciar Sesión
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-rozu-pink to-rozu-purple-medium bg-clip-text text-transparent">
              Panel de Administración - RozuVT
            </h1>
            <div className="flex gap-1 lg:gap-2">
              <Button
                onClick={() => window.open("/", "_blank")}
                variant="outline"
                className="border-rozu-pink text-rozu-pink hover:bg-rozu-pink hover:text-white text-xs lg:text-sm px-2 lg:px-4"
              >
                <Eye className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Ver Landing</span>
                <span className="sm:hidden">Ver</span>
              </Button>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-xs lg:text-sm px-2 lg:px-4">
                <Save className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Guardar</span>
                <span className="sm:hidden">Save</span>
              </Button>
              <Button onClick={handleLogout} variant="destructive" className="text-xs lg:text-sm px-2 lg:px-4">
                <LogOut className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Salir</span>
                <span className="sm:hidden">Exit</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-10 gap-1 lg:gap-2 h-auto p-1 lg:p-2 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="hero" className="flex flex-col gap-1 p-2 lg:p-3">
              <User className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="text-xs">Hero</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex flex-col gap-1 p-2 lg:p-3">
              <FileText className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="text-xs">About</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex flex-col gap-1 p-2 lg:p-3">
              <Calendar className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="text-xs">Schedule</span>
            </TabsTrigger>
            <TabsTrigger value="games" className="flex flex-col gap-1 p-2 lg:p-3">
              <Gamepad2 className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="text-xs">Games</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex flex-col gap-1 p-2 lg:p-3">
              <Video className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="text-xs">Videos</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex flex-col gap-1 p-2 lg:p-3">
              <HelpCircle className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="text-xs">FAQ</span>
            </TabsTrigger>
            <TabsTrigger value="model" className="flex flex-col gap-1 p-2 lg:p-3">
              <ImageIcon className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="text-xs">Model</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex flex-col gap-1 p-2 lg:p-3">
              <Mail className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="text-xs">Contact</span>
            </TabsTrigger>
            <TabsTrigger value="etiqueta" className="flex flex-col gap-1 p-2 lg:p-3">
              <Tag className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="text-xs">Etiqueta</span>
            </TabsTrigger>
            <TabsTrigger value="backgrounds" className="flex flex-col gap-1 p-2 lg:p-3">
              <ImageIcon className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="text-xs">Fondos</span>
            </TabsTrigger>
            <TabsTrigger value="footer" className="flex flex-col gap-1 p-2 lg:p-3">
              <FileText className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="text-xs">Footer</span>
            </TabsTrigger>
          </TabsList>

          {/* Hero Section */}
          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle>Sección Hero</CardTitle>
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
                  <Label>Imagen Hero</Label>
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

          {/* About Section */}
          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>Sección About</CardTitle>
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

          {/* Videos Section */}
          <TabsContent value="videos">
            <Card>
              <CardHeader>
                <CardTitle>Sección Videos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contentData.videos.map((video, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <h3 className="font-semibold text-lg">Video {index + 1}</h3>

                    <div>
                      <Label>Importar desde URL (YouTube/Twitch)</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          placeholder="https://youtube.com/watch?v=... o https://twitch.tv/videos/..."
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
                          className="bg-rozu-purple-medium hover:bg-rozu-purple-dark"
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
                  Sección FAQ
                  <Button onClick={addFAQ} className="bg-rozu-pink hover:bg-rozu-pink-dark">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar FAQ
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

          {/* Model Images Section */}
          <TabsContent value="model">
            <Card>
              <CardHeader>
                <CardTitle>Sección Model & Referencias</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contentData.modelImages.map((image, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <h3 className="font-semibold text-lg">Imagen {index + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Título</Label>
                        <Input
                          value={image.title}
                          onChange={(e) =>
                            setContentData((prev) => ({
                              ...prev,
                              modelImages: prev.modelImages.map((img, i) =>
                                i === index ? { ...img, title: e.target.value } : img,
                              ),
                            }))
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Tipo</Label>
                        <Input
                          value={image.type}
                          onChange={(e) =>
                            setContentData((prev) => ({
                              ...prev,
                              modelImages: prev.modelImages.map((img, i) =>
                                i === index ? { ...img, type: e.target.value } : img,
                              ),
                            }))
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Imagen</Label>
                      <div className="mt-2 space-y-2">
                        <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={image.src || "/placeholder.svg"}
                            alt={image.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(file, "modelImages", index, "src")
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact & Social Links */}
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
                    <Label>ZorrID</Label>
                    <Input
                      value={contentData.socialLinks.zorrid}
                      onChange={(e) =>
                        setContentData((prev) => ({
                          ...prev,
                          socialLinks: { ...prev.socialLinks, zorrid: e.target.value },
                        }))
                      }
                      className="mt-1"
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
                  <h3 className="font-semibold text-lg mb-4">Configuración de Días</h3>
                  <div className="space-y-4">
                    {contentData.schedule.days.map((day, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-base">{day.name}</h4>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={day.enabled}
                                onChange={(e) =>
                                  setContentData((prev) => ({
                                    ...prev,
                                    schedule: {
                                      ...prev.schedule,
                                      days: prev.schedule.days.map((d, i) =>
                                        i === index ? { ...d, enabled: e.target.checked } : d,
                                      ),
                                    },
                                  }))
                                }
                                className="w-4 h-4"
                              />
                              <span className="text-sm">Mostrar</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={day.isRestDay}
                                onChange={(e) =>
                                  setContentData((prev) => ({
                                    ...prev,
                                    schedule: {
                                      ...prev.schedule,
                                      days: prev.schedule.days.map((d, i) =>
                                        i === index ? { ...d, isRestDay: e.target.checked } : d,
                                      ),
                                    },
                                  }))
                                }
                                className="w-4 h-4"
                              />
                              <span className="text-sm">Día de descanso</span>
                            </label>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Nombre del día</Label>
                            <Input
                              value={day.name}
                              onChange={(e) =>
                                setContentData((prev) => ({
                                  ...prev,
                                  schedule: {
                                    ...prev.schedule,
                                    days: prev.schedule.days.map((d, i) =>
                                      i === index ? { ...d, name: e.target.value } : d,
                                    ),
                                  },
                                }))
                              }
                              className="mt-1"
                              placeholder="Ej: Monday"
                            />
                          </div>

                          {day.isRestDay ? (
                            <div>
                              <Label>Texto de descanso</Label>
                              <Input
                                value={day.restText}
                                onChange={(e) =>
                                  setContentData((prev) => ({
                                    ...prev,
                                    schedule: {
                                      ...prev.schedule,
                                      days: prev.schedule.days.map((d, i) =>
                                        i === index ? { ...d, restText: e.target.value } : d,
                                      ),
                                    },
                                  }))
                                }
                                className="mt-1"
                                placeholder="Ej: Rest Day 😴"
                              />
                            </div>
                          ) : (
                            <div>
                              <Label>Hora de stream</Label>
                              <Input
                                value={day.time}
                                onChange={(e) =>
                                  setContentData((prev) => ({
                                    ...prev,
                                    schedule: {
                                      ...prev.schedule,
                                      days: prev.schedule.days.map((d, i) =>
                                        i === index ? { ...d, time: e.target.value } : d,
                                      ),
                                    },
                                  }))
                                }
                                className="mt-1"
                                placeholder="Ej: 8:00 PM ART"
                              />
                            </div>
                          )}
                        </div>

                        {day.isRestDay && (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                              💡 Este día se mostrará como día de descanso con el texto personalizado.
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
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

          {/* Etiqueta Section */}
          <TabsContent value="etiqueta">
            <Card>
              <CardHeader>
                <CardTitle>Página Etiqueta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Título de la página</Label>
                  <Input
                    value={contentData.etiqueta.title}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        etiqueta: { ...prev.etiqueta, title: e.target.value },
                      }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Contenido</Label>
                  <Textarea
                    value={contentData.etiqueta.content}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        etiqueta: { ...prev.etiqueta, content: e.target.value },
                      }))
                    }
                    className="mt-1"
                    rows={8}
                    placeholder="Escribe el contenido de la página Etiqueta..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Primera Imagen</Label>
                    <div className="mt-2 space-y-2">
                      <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={contentData.etiqueta.image1 || "/placeholder.svg"}
                          alt="Etiqueta Image 1"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleImageUpload(file, "etiqueta", undefined, "image1")
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Segunda Imagen</Label>
                    <div className="mt-2 space-y-2">
                      <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={contentData.etiqueta.image2 || "/placeholder.svg"}
                          alt="Etiqueta Image 2"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleImageUpload(file, "etiqueta", undefined, "image2")
                        }}
                      />
                    </div>
                  </div>
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
