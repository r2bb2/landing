"use client"

import type React from "react"

import { useState, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Download, Sparkles, Heart, Star, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CardData {
  name: string
  profession: string
  pronouns: string
  avatar: string
}

interface ValidationErrors {
  name?: string
  profession?: string
  avatar?: string
}

const professions = [
  "Guardián del Santuario",
  "Artista Arcano",
  "Aventurero Nocturno",
  "Mago de las Estrellas",
  "Protector de Sueños",
  "Coleccionista de Memorias",
  "Tejedor de Historias",
  "Guardián de Cristales",
  "Explorador Dimensional",
  "Curador de Magia",
  "Cazador de Estrellas",
  "Recolector de Sueños",
  "Hechicero de Tiempo Libre",
  "Guardián de los Portales",
  "Cuidador de Criaturas Pequeñas",
  "Productor Artesanal de Fruta Pixelada",
  "Farmeador Certificado",
  "Guardián de la Yerba Secreta",
  "Recolector de Tazas Perdidas",
  "Cebador Real de Mates",
  "Aprendiz de cebador de Mates",
]

const pronounOptions = [
  { value: "zorrito", label: "Zorrito" },
  { value: "zorrita", label: "Zorrita" },
  { value: "zorrite", label: "Zorrite" },
]

const transformProfessionByPronoun = (profession: string, pronoun: string): string => {
  if (!pronoun) return profession

  if (pronoun === "zorrita") {
    return profession
      .replace(/Guardián/g, "Guardiana")
      .replace(/Artista/g, "Artista")
      .replace(/Aventurero/g, "Aventurera")
      .replace(/Mago/g, "Maga")
      .replace(/Protector/g, "Protectora")
      .replace(/Coleccionista/g, "Coleccionista")
      .replace(/Tejedor/g, "Tejedora")
      .replace(/Explorador/g, "Exploradora")
      .replace(/Curador/g, "Curadora")
      .replace(/Cazador/g, "Cazadora")
      .replace(/Recolector/g, "Recolectora")
      .replace(/Hechicero/g, "Hechicera")
      .replace(/Cuidador/g, "Cuidadora")
      .replace(/Productor/g, "Productora")
      .replace(/Farmeador/g, "Farmeadora")
      .replace(/Cebador/g, "Cebadora")
      .replace(/Aprendiz/g, "Aprendiz")
  } else if (pronoun === "zorrite") {
    return profession
      .replace(/Guardián/g, "Guardiane")
      .replace(/Artista/g, "Artiste")
      .replace(/Aventurero/g, "Aventurere")
      .replace(/Mago/g, "Mague")
      .replace(/Protector/g, "Protectore")
      .replace(/Coleccionista/g, "Coleccioniste")
      .replace(/Tejedor/g, "Tejedore")
      .replace(/Explorador/g, "Exploradore")
      .replace(/Curador/g, "Curadore")
      .replace(/Cazador/g, "Cazadore")
      .replace(/Recolector/g, "Recolectore")
      .replace(/Hechicero/g, "Hechicere")
      .replace(/Cuidador/g, "Cuidadore")
      .replace(/Productor/g, "Productore")
      .replace(/Farmeador/g, "Farmeadore")
      .replace(/Cebador/g, "Cebadore")
      .replace(/Aprendiz/g, "Aprendiz")
  }
  return profession
}

// Función para dividir texto en líneas que caben en el ancho dado
const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
  const words = text.split(" ")
  const lines: string[] = []
  let currentLine = ""

  for (const word of words) {
    const testLine = currentLine + (currentLine ? " " : "") + word
    const testWidth = ctx.measureText(testLine).width

    if (testWidth > maxWidth && currentLine !== "") {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines.slice(0, 2) // Máximo 2 líneas
}

export default function ZorrIDCard() {
  const [cardData, setCardData] = useState<CardData>({
    name: "",
    profession: "",
    pronouns: "",
    avatar: "",
  })

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [cardId, setCardId] = useState<number | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const cardRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const NAME_LIMIT = 20

  const transformedProfessions = useMemo(() => {
    return professions.map((profession) => ({
      original: profession,
      transformed: transformProfessionByPronoun(profession, cardData.pronouns),
    }))
  }, [cardData.pronouns])

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    if (!cardData.name.trim()) {
      newErrors.name = "El nombre es obligatorio"
    } else if (cardData.name.length > NAME_LIMIT) {
      newErrors.name = `El nombre no puede exceder ${NAME_LIMIT} caracteres`
    }

    if (!cardData.profession) {
      newErrors.profession = "La profesión es obligatoria"
    }

    if (!cardData.avatar) {
      newErrors.avatar = "El avatar es obligatorio"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCardData((prev) => ({ ...prev, avatar: e.target?.result as string }))
        if (errors.avatar) setErrors((prev) => ({ ...prev, avatar: undefined }))
      }
      reader.readAsDataURL(file)
    }
  }

  const { toast } = useToast()

  const generateCard = async () => {
    if (!validateForm()) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cardData.name,
          profession: cardData.profession,
          pronouns: cardData.pronouns,
        }),
      })

      if (!response.ok) {
        // Try to read text for debugging
        const text = await response.text()
        throw new Error(text || `HTTP ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        setCardId(result.cardId)
        toast({
          title: "🎉 ¡Tarjeta generada exitosamente!",
          description: `✨ Tu ZorrID #${result.cardId} está listo para descargar`,
          duration: 15000,
        })
      } else {
        toast({
          title: "❌ Error al generar tarjeta",
          description: result.error || "Ocurrió un error inesperado",
          variant: "destructive",
          duration: 15000,
        })
      }
    } catch (error: any) {
      console.error("Error al generar tarjeta:", error)
      toast({
        title: "❌ Error al generar tarjeta",
        description: error.message ?? "Ocurrió un error inesperado",
        variant: "destructive",
        duration: 15000,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const drawCardToCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Configurar canvas
    canvas.width = 600
    canvas.height = 375

    // Crear clip path redondeado para toda la tarjeta
    ctx.beginPath()
    ctx.roundRect(0, 0, canvas.width, canvas.height, 12)
    ctx.clip()

    // FONDO CON NUEVOS COLORES
    const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    bgGradient.addColorStop(0, "#ccdbef") // custom-blue-light
    bgGradient.addColorStop(0.5, "#f3bec8") // custom-pink-soft
    bgGradient.addColorStop(1, "#e9ced9") // custom-pink-pale
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Gradientes radiales superpuestos con nuevos colores
    const radial1 = ctx.createRadialGradient(120, 300, 0, 120, 300, 150)
    radial1.addColorStop(0, "rgba(229, 104, 156, 0.2)") // custom-pink con transparencia
    radial1.addColorStop(1, "transparent")
    ctx.fillStyle = radial1
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const radial2 = ctx.createRadialGradient(480, 75, 0, 480, 75, 150)
    radial2.addColorStop(0, "rgba(95, 87, 139, 0.2)") // custom-purple con transparencia
    radial2.addColorStop(1, "transparent")
    ctx.fillStyle = radial2
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // PATRÓN DE CORAZONES DE FONDO
    ctx.font = "8px 'Poppins', system-ui, sans-serif"
    ctx.fillStyle = "rgba(198, 94, 138, 0.1)" // custom-pink-vibrant con transparencia
    const hearts = [
      [16, 16],
      [64, 32],
      [32, 48],
      [80, 64],
      [16, 80],
      [48, 96],
      [112, 16],
      [160, 32],
      [128, 48],
      [176, 64],
      [112, 80],
      [144, 96],
      [208, 16],
      [256, 32],
      [224, 48],
      [272, 64],
      [208, 80],
      [240, 96],
    ]
    hearts.forEach(([x, y]) => {
      ctx.fillText("♡", x, y)
    })

    // TÍTULO CON DECORACIONES
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Estrellas del título
    ctx.font = "16px 'Poppins', system-ui, sans-serif"
    ctx.fillStyle = "rgba(231, 131, 173, 0.8)" // custom-pink-light
    ctx.fillText("✨", 220, 35)
    ctx.fillText("✨", 380, 35)

    // Título principal
    ctx.fillStyle = "#413447" // custom-dark
    ctx.font = "bold 18px 'Poppins', system-ui, sans-serif"
    ctx.fillText(`💥 ZorrID ${cardId ? `#${cardId}` : "#0000"} 💥`, 300, 35)

    // ÁREA DEL AVATAR
    const avatarX = 32
    const avatarY = 75
    const avatarW = 210
    const avatarH = 240

    // Fondo del avatar con gradiente usando nuevos colores
    const avatarGrad = ctx.createLinearGradient(avatarX, avatarY, avatarX + avatarW, avatarY + avatarH)
    avatarGrad.addColorStop(0, "#e783ad") // custom-pink-light
    avatarGrad.addColorStop(1, "#e5689c") // custom-pink
    ctx.fillStyle = avatarGrad
    ctx.beginPath()
    ctx.roundRect(avatarX, avatarY, avatarW, avatarH, 12)
    ctx.fill()

    // Borde del avatar
    ctx.strokeStyle = "#c65e8a" // custom-pink-vibrant
    ctx.lineWidth = 4
    ctx.stroke()

    // Brillos en el avatar
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
    ctx.beginPath()
    ctx.arc(avatarX + 15, avatarY + 15, 8, 0, 2 * Math.PI)
    ctx.fill()

    ctx.fillStyle = "rgba(255, 255, 255, 0.4)"
    ctx.beginPath()
    ctx.arc(avatarX + avatarW - 20, avatarY + 25, 4, 0, 2 * Math.PI)
    ctx.fill()

    const continueDrawing = () => {
      // ÁREA DE TEXTO
      const textX = 270
      const textY = 75
      const textW = 300

      // Estrellas decorativas
      ctx.font = "12px 'Poppins', system-ui, sans-serif"
      ctx.fillStyle = "rgba(198, 94, 138, 0.6)" // custom-pink-vibrant
      ctx.textAlign = "left"
      ctx.fillText("✨", textX - 10, textY + 10)
      ctx.fillText("⭐", textX + 250, textY + 15)

      // NOMBRE CON SALTO DE LÍNEA
      ctx.font = "bold 32px 'Poppins', system-ui, sans-serif"
      ctx.textBaseline = "top"

      const nameText = cardData.name || "Tu Nombre"
      const nameLines = wrapText(ctx, nameText, textW - 20)

      // Sombra del nombre
      ctx.fillStyle = "rgba(65, 52, 71, 0.2)" // custom-dark con transparencia
      nameLines.forEach((line, i) => {
        ctx.fillText(line, textX + 2, 110 + i * 40 + 2)
      })

      // Nombre principal
      ctx.fillStyle = "#413447" // custom-dark
      nameLines.forEach((line, i) => {
        ctx.fillText(line, textX, 110 + i * 40)
      })

      // LÍNEA DECORATIVA
      const lineY = 110 + nameLines.length * 40 + 10
      ctx.strokeStyle = "#c65e8a" // custom-pink-vibrant
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(textX, lineY)
      ctx.lineTo(textX + 150, lineY)
      ctx.stroke()

      // PROFESIÓN
      const profY = lineY + 20

      // Texto de la profesión
      ctx.fillStyle = "#c65e8a" // custom-pink-vibrant
      ctx.font = "bold 20px 'Poppins', system-ui, sans-serif"
      const prof = transformProfessionByPronoun(cardData.profession, cardData.pronouns) || "Tu Profesión"
      ctx.fillText(prof, textX, profY + 15)

      // FLORES DECORATIVAS
      const flowers = [
        { emoji: "🌸", x: 540, y: 100, size: "20px", opacity: 0.7 },
        { emoji: "🌺", x: 510, y: 140, size: "16px", opacity: 0.6 },
        { emoji: "🌸", x: 555, y: 180, size: "18px", opacity: 0.5 },
        { emoji: "🌻", x: 525, y: 220, size: "16px", opacity: 0.4 },
        { emoji: "🌸", x: 540, y: 260, size: "18px", opacity: 0.6 },
      ]

      flowers.forEach((flower) => {
        ctx.font = `${flower.size} 'Poppins', system-ui, sans-serif`
        ctx.fillStyle = `rgba(198, 94, 138, ${flower.opacity})` // custom-pink-vibrant
        ctx.fillText(flower.emoji, flower.x, flower.y)
      })
    }

    // Dibujar avatar si existe
    if (cardData.avatar) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const imgRatio = img.width / img.height
        const containerRatio = avatarW / avatarH

        let drawW, drawH, drawX, drawY

        if (imgRatio > containerRatio) {
          drawW = avatarW
          drawH = avatarW / imgRatio
          drawX = avatarX
          drawY = avatarY + (avatarH - drawH) / 2
        } else {
          drawH = avatarH
          drawW = avatarH * imgRatio
          drawX = avatarX + (avatarW - drawW) / 2
          drawY = avatarY
        }

        ctx.drawImage(img, drawX, drawY, drawW, drawH)
        continueDrawing()
      }
      img.src = cardData.avatar
    } else {
      // Placeholder
      ctx.fillStyle = "#5f578b" // custom-purple
      ctx.font = "32px 'Poppins', system-ui, sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("💖", avatarX + avatarW / 2, avatarY + avatarH / 2 - 10)
      ctx.font = "14px 'Poppins', system-ui, sans-serif"
      ctx.fillText("Tu foto", avatarX + avatarW / 2, avatarY + avatarH / 2 + 20)
      continueDrawing()
    }
  }

  const downloadCard = async () => {
    setIsDownloading(true)
    try {
      drawCardToCanvas()

      // Esperar un poco para que se complete el dibujo
      await new Promise((resolve) => setTimeout(resolve, 200))

      const canvas = canvasRef.current
      if (canvas) {
        const link = document.createElement("a")
        link.download = `ZorrID-${cardId || "preview"}-${cardData.name || "tarjeta"}.png`
        link.href = canvas.toDataURL("image/png", 1.0)
        link.click()
      }
    } catch (error) {
      console.error("Error al descargar:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  const isFormValid = cardData.name.trim() && cardData.profession && cardData.avatar

  const randomizeProfession = () => {
    const randomIndex = Math.floor(Math.random() * professions.length)
    const originalProfession = professions[randomIndex]
    setCardData((prev) => ({ ...prev, profession: originalProfession }))
    if (errors.profession) setErrors((prev) => ({ ...prev, profession: undefined }))
  }

  const displayedProfession = transformProfessionByPronoun(cardData.profession, cardData.pronouns) || "Tu Profesión"

  const selectedTransformedProfession =
    transformedProfessions.find((p) => p.original === cardData.profession)?.transformed || ""

  return (
    <div className="min-h-screen bg-gradient-to-br from-rozu-blue-light via-rozu-pink-light to-rozu-pink-light p-4 overflow-y-auto">
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-rozu-pink animate-pulse">
          <Sparkles size={24} />
        </div>
        <div className="absolute top-32 right-20 text-rozu-purple-medium animate-bounce">
          <Star size={20} />
        </div>
        <div className="absolute bottom-20 left-20 text-rozu-pink-dark animate-pulse">
          <Heart size={18} />
        </div>
        <div className="absolute top-1/2 right-10 text-rozu-purple-medium animate-pulse">
          <Sparkles size={16} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-8">
        <div className="text-center mb-8">
          <h1
            className="text-4xl md:text-6xl font-black bg-gradient-to-r from-rozu-pink via-rozu-purple-medium to-rozu-pink-dark bg-clip-text text-transparent mb-4 font-gotham-rounded"
            style={{ fontFamily: "Nunito, system-ui, sans-serif", fontWeight: 900 }}
          >
            ✨ ZorrID Creator ✨
          </h1>
          <p className="text-rozu-purple-dark text-lg font-poppins">
            Convertite en miembro oficial del santuario secreto
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-rozu-pink-light shadow-xl">
          <CardHeader className="bg-gradient-to-r from-rozu-pink-light to-rozu-pink-light rounded-t-lg">
            <CardTitle className="text-2xl text-rozu-purple-dark flex items-center gap-2 font-poppins">
              <Sparkles className="text-rozu-pink" size={24} />
              Información Personal
            </CardTitle>
            <CardDescription className="text-rozu-purple-medium font-poppins">
              Completa los datos para tu ZorrID
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-rozu-purple-dark font-medium font-poppins">
                Nombre ✨ <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  placeholder="Escribe tu nombre..."
                  value={cardData.name}
                  maxLength={NAME_LIMIT}
                  onChange={(e) => {
                    setCardData((prev) => ({ ...prev, name: e.target.value }))
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
                  }}
                  className={`border-rozu-pink-light focus:border-rozu-pink focus:ring-rozu-pink-light font-poppins ${
                    errors.name ? "border-red-300 focus:border-red-400" : ""
                  }`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-rozu-purple-medium font-poppins">
                  {cardData.name.length}/{NAME_LIMIT}
                </div>
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm font-poppins flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pronouns" className="text-rozu-purple-dark font-medium font-poppins">
                Pronombres 🦊 <span className="text-rozu-purple-medium text-sm">(Opcional)</span>
              </Label>
              <Select
                value={cardData.pronouns}
                onValueChange={(value) => {
                  setCardData((prev) => ({ ...prev, pronouns: value }))
                }}
              >
                <SelectTrigger className="border-rozu-pink-light focus:border-rozu-pink focus:ring-rozu-pink-light font-poppins">
                  <SelectValue placeholder="Elige tus pronombres..." />
                </SelectTrigger>
                <SelectContent className="z-50">
                  {pronounOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="font-poppins">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profession" className="text-rozu-purple-dark font-medium font-poppins">
                Profesión 🌟 <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Select
                  value={cardData.profession}
                  onValueChange={(value) => {
                    setCardData((prev) => ({ ...prev, profession: value }))
                    if (errors.profession) setErrors((prev) => ({ ...prev, profession: undefined }))
                  }}
                >
                  <SelectTrigger
                    className={`border-rozu-pink-light focus:border-rozu-pink focus:ring-rozu-pink-light font-poppins ${
                      errors.profession ? "border-red-300 focus:border-red-400" : ""
                    }`}
                  >
                    <SelectValue placeholder="Elige tu profesión...">{selectedTransformedProfession}</SelectValue>
                  </SelectTrigger>
                  <SelectContent className="z-50 max-h-60">
                    {transformedProfessions.map((profession) => (
                      <SelectItem key={profession.original} value={profession.original} className="font-poppins">
                        {profession.transformed}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={randomizeProfession}
                  className="border-rozu-pink-light text-rozu-pink hover:bg-rozu-pink-light shrink-0 bg-transparent"
                  title="Profesión aleatoria"
                >
                  <Sparkles size={16} />
                </Button>
              </div>
              {errors.profession && (
                <p className="text-red-500 text-sm font-poppins flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.profession}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar" className="text-rozu-purple-dark font-medium font-poppins">
                Avatar 💖 <span className="text-red-500">*</span>
              </Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-rozu-pink transition-colors ${
                  errors.avatar ? "border-red-300" : "border-rozu-pink-light"
                }`}
              >
                <input id="avatar" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <label htmlFor="avatar" className="cursor-pointer">
                  <Upload className="mx-auto text-rozu-pink mb-2" size={32} />
                  <p className="text-rozu-purple-medium font-poppins">Haz clic para subir tu foto</p>
                  <p className="text-sm text-rozu-purple-medium/70 mt-1 font-poppins">PNG, JPG hasta 10MB</p>
                </label>
              </div>
              {errors.avatar && (
                <p className="text-red-500 text-sm font-poppins flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.avatar}
                </p>
              )}
            </div>

            <Button
              onClick={generateCard}
              disabled={!isFormValid || isGenerating}
              className="w-full bg-gradient-to-r from-rozu-pink to-rozu-purple-medium hover:from-rozu-pink-dark hover:to-rozu-purple-medium text-white shadow-lg font-poppins"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="mr-2 animate-spin" size={20} />
                  Generando ZorrID...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2" size={20} />
                  Generar ZorrID
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-rozu-purple-medium shadow-xl">
          <CardHeader className="bg-gradient-to-r from-rozu-purple-medium/20 to-rozu-pink-light rounded-t-lg">
            <CardTitle className="text-2xl text-rozu-purple-dark flex items-center gap-2 font-poppins">
              <Star className="text-rozu-purple-medium" size={24} />
              Vista Previa
            </CardTitle>
            <CardDescription className="text-rozu-purple-medium font-poppins">
              Así se verá tu tarjeta mágica
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex justify-center">
            <div
              ref={cardRef}
              className="relative rounded-xl overflow-hidden shadow-2xl"
              style={{
                width: "600px",
                height: "375px",
                fontFamily: "Poppins, Arial, sans-serif",
                background: `linear-gradient(135deg, #ccdbef 0%, #f3bec8 50%, #e9ced9 100%)`,
                backgroundImage: `
                  radial-gradient(circle at 20% 80%, rgba(229, 104, 156, 0.2) 0%, transparent 50%), 
                  radial-gradient(circle at 80% 20%, rgba(95, 87, 139, 0.2) 0%, transparent 50%)
                `,
              }}
            >
              {/* Patrón de fondo decorativo */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 text-rozu-pink-dark text-xs">♡</div>
                <div className="absolute top-8 left-16 text-rozu-purple-medium text-xs">♡</div>
                <div className="absolute top-12 left-8 text-rozu-pink-dark text-xs">♡</div>
                <div className="absolute top-16 left-20 text-rozu-purple-medium text-xs">♡</div>
                <div className="absolute top-20 left-4 text-rozu-pink-dark text-xs">♡</div>
                <div className="absolute top-24 left-12 text-rozu-purple-medium text-xs">♡</div>
              </div>

              {/* Título con más estilo */}
              <div className="text-center py-4 relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 -top-1 text-rozu-pink-medium text-lg">
                  ✨
                </div>
                <h3 className="text-lg font-bold font-poppins bg-gradient-to-r from-rozu-pink to-rozu-purple-medium bg-clip-text text-transparent">
                  💥 ZorrID {cardId ? `#${cardId}` : "#0000"} 💥
                </h3>
                <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-1 text-rozu-purple-medium/60 text-lg">
                  ✨
                </div>
              </div>

              {/* Contenido principal */}
              <div className="flex px-8 pb-8 relative">
                {/* Avatar área */}
                <div
                  className="rounded-xl flex items-center justify-center overflow-hidden relative shadow-lg border-4"
                  style={{
                    width: "210px",
                    height: "240px",
                    background: `linear-gradient(135deg, #e783ad 0%, #e5689c 100%)`,
                    borderColor: "#c65e8a",
                  }}
                >
                  {/* Brillos decorativos en el avatar */}
                  <div className="absolute top-2 left-2 w-4 h-4 bg-white opacity-60 rounded-full"></div>
                  <div className="absolute top-4 right-4 w-2 h-2 bg-white opacity-40 rounded-full"></div>

                  {cardData.avatar ? (
                    <img
                      src={cardData.avatar || "/placeholder.svg"}
                      alt="Avatar"
                      className="max-w-full max-h-full object-contain rounded-lg"
                      style={{
                        width: "auto",
                        height: "auto",
                        maxWidth: "100%",
                        maxHeight: "100%",
                      }}
                    />
                  ) : (
                    <div className="text-center" style={{ color: "#5f578b" }}>
                      <div className="text-4xl mb-2">💖</div>
                      <p className="text-sm font-poppins">Tu foto</p>
                    </div>
                  )}
                </div>

                {/* Información del usuario */}
                <div className="flex-1 ml-8 flex flex-col justify-center overflow-hidden relative">
                  {/* Estrellas decorativas */}
                  <div className="absolute -left-2 top-0 text-rozu-pink-dark text-sm">✨</div>
                  <div className="absolute right-4 top-2 text-rozu-purple-medium text-xs">⭐</div>

                  {/* Nombre con salto de línea */}
                  <div className="relative z-10">
                    <div
                      className="text-4xl font-bold mb-2 font-poppins drop-shadow-sm"
                      style={{ maxWidth: "290px", lineHeight: "1.1", color: "#413447" }}
                    >
                      {(cardData.name || "Tu Nombre").length > 12 ? (
                        <div>
                          {cardData.name
                            .split(" ")
                            .reduce((acc, word, index, array) => {
                              if (index === 0) return [word]
                              const currentLine = acc[acc.length - 1]
                              if ((currentLine + " " + word).length <= 12) {
                                acc[acc.length - 1] = currentLine + " " + word
                              } else {
                                acc.push(word)
                              }
                              return acc
                            }, [])
                            .map((line, index) => (
                              <div key={index}>{line}</div>
                            ))}
                        </div>
                      ) : (
                        cardData.name || "Tu Nombre"
                      )}
                    </div>
                    {/* Línea decorativa bajo el nombre */}
                    <div
                      className="w-32 h-1 rounded-full mb-4"
                      style={{ background: `linear-gradient(to right, #c65e8a, #5f578b)` }}
                    ></div>
                  </div>

                  {/* Profesión */}
                  <div className="relative z-10">
                    <p className="text-lg font-bold font-poppins" style={{ maxWidth: "250px", color: "#c65e8a" }}>
                      {displayedProfession}
                    </p>
                  </div>
                </div>

                {/* Flores decorativas */}
                <div className="absolute top-8 right-12 text-2xl opacity-70 animate-pulse">🌸</div>
                <div className="absolute top-20 right-20 text-lg opacity-60">🌺</div>
                <div className="absolute bottom-32 right-8 text-xl opacity-50 animate-pulse">🌸</div>
                <div className="absolute bottom-20 right-16 text-lg opacity-40">🌻</div>
                <div className="absolute bottom-8 right-12 text-xl opacity-60">🌸</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center pb-8">
          <Button
            onClick={downloadCard}
            disabled={!cardId || isDownloading}
            className="bg-gradient-to-r from-rozu-pink to-rozu-purple-medium hover:from-rozu-pink-dark hover:to-rozu-purple-medium text-white shadow-lg font-poppins disabled:opacity-50 px-8"
            size="lg"
          >
            {isDownloading ? (
              <>
                <Sparkles className="mr-2 animate-spin" size={20} />
                Descargando...
              </>
            ) : (
              <>
                <Download className="mr-2" size={20} />
                Descargar ZorrID en Alta Calidad
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
