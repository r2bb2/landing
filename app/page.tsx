"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import Link from "next/link"

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

export default function RozuLanding() {
  const [activeSection, setActiveSection] = useState("home")
  const [contentData, setContentData] = useState<ContentData | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Load content data from localStorage
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
        setContentData(parsedData)
      } catch (error) {
        console.error("Error parsing saved data:", error)
      }
    }
  }, [])

  // Default data if no saved data exists
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
        answer:
          "Yes! My emotes are available for subscribers. You can also find some free ones in my Discord server! 💖",
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

  const data = contentData || defaultData

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setActiveSection(sectionId)
    }
  }

  const getSectionStyle = (sectionName: keyof typeof data.backgroundImages) => {
    const backgroundImage = data.backgroundImages[sectionName]
    if (backgroundImage) {
      return {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    }
    return {}
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-lg z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-rozu-pink to-rozu-purple-medium bg-clip-text text-transparent">
                RozuVT
              </span>
            </motion.div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {[
                { id: "home", label: "Home" },
                { id: "about", label: "About" },
                { id: "schedule", label: "Schedule" },
                { id: "games", label: "Games" },
                { id: "videos", label: "Videos" },
                { id: "faq", label: "FAQ" },
                { id: "model", label: "Model" },
                { id: "contact", label: "Contact" },
              ].map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    activeSection === item.id ? "bg-rozu-pink-medium text-white" : "text-gray-600 hover:text-rozu-pink"
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}

              {/* Etiqueta Button */}
              <Link href="/etiqueta">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-full font-medium transition-all text-gray-600 hover:text-rozu-pink"
                >
                  Etiqueta
                </motion.button>
              </Link>

              {/* ZorrID Button - Updated to redirect internally */}
              <Link href="/zorrid">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-full font-medium transition-all text-gray-600 hover:text-rozu-pink"
                >
                  ZorrID
                </motion.button>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-rozu-pink-light/20"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`bg-rozu-pink block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${mobileMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"}`}
                ></span>
                <span
                  className={`bg-rozu-pink block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${mobileMenuOpen ? "opacity-0" : "opacity-100"}`}
                ></span>
                <span
                  className={`bg-rozu-pink block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${mobileMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"}`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden fixed top-20 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg z-40 border-t"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "home", label: "Home" },
                { id: "about", label: "About" },
                { id: "schedule", label: "Schedule" },
                { id: "games", label: "Games" },
                { id: "videos", label: "Videos" },
                { id: "faq", label: "FAQ" },
                { id: "model", label: "Model" },
                { id: "contact", label: "Contact" },
              ].map((item) => (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    scrollToSection(item.id)
                    setMobileMenuOpen(false)
                  }}
                  className={`px-4 py-3 rounded-xl font-medium transition-all text-center ${
                    activeSection === item.id
                      ? "bg-rozu-pink-medium text-white"
                      : "text-gray-600 hover:text-rozu-pink hover:bg-rozu-pink-light/20"
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}

              {/* Mobile Etiqueta Button */}
              <Link href="/etiqueta">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl font-medium transition-all text-center text-gray-600 hover:text-rozu-pink hover:bg-rozu-pink-light/20 w-full"
                >
                  Etiqueta
                </motion.button>
              </Link>

              {/* Mobile ZorrID Button - Updated to redirect internally */}
              <Link href="/zorrid">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl font-medium transition-all text-center text-gray-600 hover:text-rozu-pink hover:bg-rozu-pink-light/20 w-full"
                >
                  ZorrID
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <section id="home" className="pt-20 min-h-screen flex items-center relative" style={getSectionStyle("hero")}>
        {data.backgroundImages.hero && <div className="absolute inset-0 bg-black/20"></div>}
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4 lg:space-y-6 text-center lg:text-left order-2 lg:order-1"
            >
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black bg-gradient-to-r from-rozu-pink to-rozu-purple-medium bg-clip-text text-transparent">
                {data.hero.title}
              </h1>
              <p className="text-lg lg:text-xl text-rozu-purple-dark leading-relaxed px-4 lg:px-0">
                {data.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-4 lg:px-0">
                <motion.div whileHover={{ scale:\
