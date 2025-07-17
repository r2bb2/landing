"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Heart, Sparkles, Calendar, Play, Mail, Twitch, Twitter, Youtube, MessageCircle, Clock } from "lucide-react"
import Image from "next/image"
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
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href={data.socialLinks.twitch} target="_blank">
                    <Button className="bg-[#413447] hover:bg-rozu-purple-dark text-white px-6 py-3 rounded-full w-full sm:w-auto">
                      <Twitch className="w-5 h-5 mr-2" />
                      Twitch
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href={data.socialLinks.twitter} target="_blank">
                    <Button className="bg-rozu-purple-medium hover:bg-rozu-purple-dark text-white px-6 py-3 rounded-full w-full sm:w-auto">
                      <Twitter className="w-5 h-5 mr-2" />
                      Twitter
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href={data.socialLinks.youtube} target="_blank">
                    <Button className="bg-rozu-pink hover:bg-rozu-pink-dark text-white px-6 py-3 rounded-full w-full sm:w-auto">
                      <Youtube className="w-5 h-5 mr-2" />
                      YouTube
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative order-1 lg:order-2 px-4 lg:px-0"
            >
              <div className="relative w-full h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-pink-200 to-purple-300 rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={data.hero.heroImage || "/placeholder.svg"}
                  alt="Rozu Hero Banner"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent" />
              </div>
              {/* Floating elements - hide on mobile for cleaner look */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                className="hidden sm:block absolute -top-4 -right-4 w-12 h-12 bg-rozu-pink rounded-full flex items-center justify-center shadow-lg"
              >
                <Heart className="w-6 h-6 text-white" />
              </motion.div>
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
                className="hidden sm:block absolute -bottom-4 -left-4 w-10 h-10 bg-rozu-purple-medium rounded-full flex items-center justify-center shadow-lg"
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 lg:py-20 px-4 lg:px-0 relative" style={getSectionStyle("about")}>
        {data.backgroundImages.about && <div className="absolute inset-0 bg-black/20"></div>}
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-rozu-pink to-rozu-purple-medium bg-clip-text text-transparent mb-4">
              {data.about.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">{data.about.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Schedule Section */}
      <section
        id="schedule"
        className="py-12 lg:py-20 px-4 lg:px-0 bg-gradient-to-r from-rozu-pink-light to-rozu-blue-light relative"
        style={getSectionStyle("schedule")}
      >
        {data.backgroundImages.schedule && <div className="absolute inset-0 bg-black/20"></div>}
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-rozu-pink to-rozu-pink-medium bg-clip-text text-transparent mb-4">
              {data.schedule.title}
            </h2>
            {data.schedule.subtitle && <p className="text-lg text-gray-600">{data.schedule.subtitle}</p>}
          </motion.div>

          <div className="space-y-8 max-w-6xl mx-auto">
            {/* Weekly Schedule - Horizontal */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Calendar className="w-8 h-8 text-rozu-pink" />
                    <h3 className="text-2xl font-bold text-gray-800">Weekly Schedule</h3>
                  </div>

                  {/* Horizontal days layout */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 lg:gap-4">
                    {data.schedule.days
                      .filter((day) => day.enabled)
                      .map((day) => (
                        <div
                          key={day.name}
                          className={`flex flex-col items-center p-3 lg:p-4 rounded-xl text-center ${
                            day.isRestDay ? "bg-gray-100" : "bg-rozu-pink-light/30"
                          }`}
                        >
                          <span
                            className={`font-semibold text-sm lg:text-base mb-2 ${
                              day.isRestDay ? "text-gray-500" : "text-gray-700"
                            }`}
                          >
                            {day.name}
                          </span>
                          {day.isRestDay ? (
                            <span className="text-gray-400 text-xs lg:text-sm">{day.restText}</span>
                          ) : (
                            <div className="flex flex-col items-center gap-1">
                              <Clock className="w-4 h-4 text-rozu-pink" />
                              <span className="text-rozu-pink font-medium text-xs lg:text-sm">{day.time}</span>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stay Updated - Horizontal */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Left side - Title and description */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <MessageCircle className="w-8 h-8 text-rozu-purple-medium" />
                        <h3 className="text-2xl font-bold text-gray-800">{data.schedule.discordTitle}</h3>
                      </div>
                      <p className="text-gray-600 mb-4 lg:mb-0">{data.schedule.discordText}</p>
                      <div className="text-sm text-gray-500 lg:hidden">{data.schedule.scheduleNote}</div>
                    </div>

                    {/* Right side - Button and note */}
                    <div className="flex flex-col items-center lg:items-end gap-3 lg:min-w-[280px]">
                      <Link href={data.socialLinks.discord} target="_blank">
                        <Button className="bg-rozu-purple-medium hover:bg-rozu-blue-light text-white px-6 py-3 rounded-xl w-full lg:w-auto">
                          <MessageCircle className="w-5 h-5 mr-2" />
                          {data.schedule.discordButtonText}
                        </Button>
                      </Link>
                      <div className="hidden lg:block text-center text-sm text-gray-500">
                        {data.schedule.scheduleNote}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section id="games" className="py-12 lg:py-20 px-4 lg:px-0 relative" style={getSectionStyle("games")}>
        {data.backgroundImages.games && <div className="absolute inset-0 bg-black/20"></div>}
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-rozu-pink to-rozu-purple-medium bg-clip-text text-transparent mb-4">
              Favorite Games
            </h2>
            <p className="text-lg text-gray-600">From cozy farming to epic adventures - here are my go-to games!</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-6xl mx-auto">
            {data.games.map((game, index) => (
              <motion.div
                key={game.name}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center mb-4">
                      <div
                        className={`w-16 h-16 bg-gradient-to-r ${game.color} rounded-2xl flex items-center justify-center p-2`}
                      >
                        <Image
                          src={game.logo || "/placeholder.svg"}
                          alt={`${game.name} logo`}
                          width={48}
                          height={48}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-center text-gray-800 mb-3">{game.name}</h3>
                    <p className="text-sm text-gray-600 text-center leading-relaxed">{game.summary}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section
        id="videos"
        className="py-12 lg:py-20 px-4 lg:px-0 bg-gradient-to-r from-rozu-purple-medium/20 to-rozu-pink-light/50 relative"
        style={getSectionStyle("videos")}
      >
        {data.backgroundImages.videos && <div className="absolute inset-0 bg-black/20"></div>}
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-rozu-purple-medium to-rozu-pink bg-clip-text text-transparent mb-4">
              Latest Videos
            </h2>
            <p className="text-lg text-gray-600">Check out my latest stream highlights and special content!</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-6xl mx-auto">
            {data.videos.map((video, index) => (
              <motion.div
                key={video.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                  <Link href={video.url || "#"} target={video.url ? "_blank" : "_self"}>
                    <div className="relative">
                      <Image
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                        <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      </div>
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-sm">
                        {video.views} views
                      </div>
                      {video.platform && (
                        <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                          {video.platform === "youtube" ? "📺" : "🎮"} {video.platform}
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-gray-800 line-clamp-2">{video.title}</h3>
                    </CardContent>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 lg:py-20 px-4 lg:px-0 relative" style={getSectionStyle("faq")}>
        {data.backgroundImages.faq && <div className="absolute inset-0 bg-black/20"></div>}
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-rozu-pink to-rozu-purple-medium bg-clip-text text-transparent mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">Got questions? I've got answers! 🦊</p>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Accordion type="single" collapsible className="space-y-4">
              {data.faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-0">
                  <Card className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{faq.icon}</span>
                        <span className="font-semibold text-left">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <p className="text-gray-600">{faq.answer}</p>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Model & Reference Section */}
      <section
        id="model"
        className="py-12 lg:py-20 px-4 lg:px-0 bg-gradient-to-r from-rozu-pink-light/50 to-rozu-blue-light/50 relative"
        style={getSectionStyle("model")}
      >
        {data.backgroundImages.model && <div className="absolute inset-0 bg-black/20"></div>}
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-rozu-pink to-rozu-pink-medium bg-clip-text text-transparent mb-4">
              Model & References
            </h2>
            <p className="text-lg text-gray-600">Check out my kawaii model and adorable emotes!</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-6xl mx-auto mb-8 lg:mb-12">
            {data.modelImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <div className="relative">
                    <Image
                      src={image.src || "/placeholder.svg"}
                      alt={image.title}
                      width={200}
                      height={image.type === "render" ? 300 : 200}
                      className="w-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-center text-gray-800">{image.title}</h3>
                    <Button className="w-full mt-2 bg-rozu-pink-medium hover:bg-rozu-pink text-white rounded-xl">
                      View Full Size
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* ZorrID Creator Button - Updated to redirect internally */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <motion.div whileHover={{ scale: 1.1, y: -5 }} whileTap={{ scale: 0.95 }} className="relative">
              <Link href="/zorrid" rel="noopener noreferrer">
                <Button className="bg-rozu-pink-medium hover:bg-rozu-purple-medium text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-2xl relative overflow-hidden">
                  {/* Fox ears decoration */}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <div className="flex gap-1">
                      <div className="w-3 h-3 bg-pink-300 rounded-full transform rotate-45"></div>
                      <div className="w-3 h-3 bg-pink-300 rounded-full transform rotate-45"></div>
                    </div>
                  </div>
                  <Sparkles className="w-6 h-6 mr-2" />
                  ZorrID Creator
                  <Sparkles className="w-6 h-6 ml-2" />
                </Button>
              </Link>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl blur-xl opacity-30 -z-10"></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 lg:py-20 px-4 lg:px-0 relative" style={getSectionStyle("contact")}>
        {data.backgroundImages.contact && <div className="absolute inset-0 bg-black/20"></div>}
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-rozu-pink to-rozu-purple-medium bg-clip-text text-transparent mb-4">
              {data.contact.title}
            </h2>
            <p className="text-lg text-gray-600">{data.contact.subtitle}</p>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <Card className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <Input
                        className="rounded-xl border-rozu-pink-light focus:border-rozu-pink"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <Input
                        className="rounded-xl border-rozu-pink-light focus:border-rozu-pink"
                        placeholder="your@email.com"
                        type="email"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <Input
                      className="rounded-xl border-rozu-pink-light focus:border-rozu-pink"
                      placeholder="What's this about?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <Textarea
                      className="rounded-xl border-rozu-pink-light focus:border-rozu-pink min-h-32"
                      placeholder="Tell me everything! 🦊"
                    />
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full bg-rozu-pink hover:bg-rozu-pink-medium text-white py-3 rounded-xl text-lg font-semibold">
                      <Mail className="w-5 h-5 mr-2" />
                      Send Message ✨
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gradient-to-r from-rozu-pink to-rozu-purple-medium text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center gap-2 text-2xl font-bold">
              <Sparkles className="w-6 h-6" />
              {data.footer.brandText}
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-rozu-pink-light">{data.footer.copyrightText}</p>
            <div className="flex justify-center gap-6 lg:gap-4">
              <Link href={data.socialLinks.twitch} target="_blank">
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Twitch className="w-6 h-6 text-rozu-pink-light hover:text-white transition-colors" />
                </motion.div>
              </Link>
              <Link href={data.socialLinks.twitter} target="_blank">
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Twitter className="w-6 h-6 text-rozu-pink-light hover:text-white transition-colors" />
                </motion.div>
              </Link>
              <Link href={data.socialLinks.youtube} target="_blank">
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Youtube className="w-6 h-6 text-rozu-pink-light hover:text-white transition-colors" />
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}
