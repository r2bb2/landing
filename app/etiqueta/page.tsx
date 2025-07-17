"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface EtiquetaData {
  title: string
  content: string
  image1: string
  image2: string
}

export default function EtiquetaPage() {
  const [etiquetaData, setEtiquetaData] = useState<EtiquetaData | null>(null)

  useEffect(() => {
    // Load content data from localStorage
    const savedData = localStorage.getItem("rozu-content-data")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        if (parsedData.etiqueta) {
          setEtiquetaData(parsedData.etiqueta)
        }
      } catch (error) {
        console.error("Error parsing saved data:", error)
      }
    }
  }, [])

  // Default data if no saved data exists
  const defaultData: EtiquetaData = {
    title: "Etiqueta VTuber",
    content:
      "Bienvenidos a mi página de etiqueta VTuber. Aquí encontrarás toda la información importante sobre las reglas de mi comunidad, cómo interactuar en mis streams y qué esperar de mi contenido. Mi objetivo es crear un espacio seguro y divertido para todos! 🦊✨\n\nRecuerda siempre ser respetuoso con otros viewers, evitar el spam en el chat, y sobre todo... ¡diviértete! Estoy aquí para crear momentos mágicos juntos.",
    image1: "/placeholder.svg?height=400&width=600",
    image2: "/placeholder.svg?height=400&width=600",
  }

  const data = etiquetaData || defaultData

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white/80 backdrop-blur-md shadow-lg"
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

            {/* Back Button */}
            <Link href="/">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-rozu-pink hover:bg-rozu-pink-dark text-white px-4 py-2 rounded-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al Inicio
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-rozu-pink to-rozu-purple-medium bg-clip-text text-transparent mb-4">
              {data.title}
            </h1>
          </div>

          {/* Content Card */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden mb-8">
            <CardContent className="p-8 lg:p-12">
              {/* First Image */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mb-8"
              >
                <div className="relative w-full h-64 lg:h-80 bg-gradient-to-br from-pink-200 to-purple-300 rounded-2xl overflow-hidden shadow-lg">
                  <Image src={data.image1 || "/placeholder.svg"} alt="Etiqueta Image 1" fill className="object-cover" />
                </div>
              </motion.div>

              {/* Content Text */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mb-8"
              >
                <div className="prose prose-lg max-w-none">
                  {data.content.split("\n").map((paragraph, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed mb-4 text-lg">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>

              {/* Second Image */}
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="relative w-full h-64 lg:h-80 bg-gradient-to-br from-purple-200 to-pink-300 rounded-2xl overflow-hidden shadow-lg">
                  <Image src={data.image2 || "/placeholder.svg"} alt="Etiqueta Image 2" fill className="object-cover" />
                </div>
              </motion.div>
            </CardContent>
          </Card>

          {/* Back to Home Button */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-center"
          >
            <Link href="/">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-rozu-purple-medium hover:bg-rozu-purple-dark text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-xl">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Volver a la Landing
                  <Sparkles className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
