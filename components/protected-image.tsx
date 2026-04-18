"use client"

/**
 * ProtectedImage — componente para mostrar imágenes que no se pueden
 * descargar fácilmente (no clic derecho, no drag, no selección).
 *
 * Uso:
 *   <ProtectedImage src="/mi-arte.png" alt="Fan art by @artista" width={400} height={600} />
 *
 * NO es protección 100% infalible (nada lo es en web), pero disuade
 * la descarga casual y es la práctica estándar en páginas de VTubers.
 */

import Image from "next/image"
import { useCallback } from "react"

interface ProtectedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  fill?: boolean
  priority?: boolean
  /** Si true, muestra un watermark sutil con el texto dado */
  watermark?: string
}

export function ProtectedImage({
  src,
  alt,
  width,
  height,
  className = "",
  fill = false,
  priority = false,
  watermark,
}: ProtectedImageProps) {
  // Bloquea clic derecho
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    return false
  }, [])

  // Bloquea drag
  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    return false
  }, [])

  return (
    <div
      className="img-protected-wrapper select-none"
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      style={{ position: fill ? "absolute" : "relative", inset: fill ? 0 : undefined }}
    >
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        className={`img-protected pointer-events-none select-none ${className}`}
        draggable={false}
        // Desactiva el guardado en dispositivos iOS/Android con long-press
        style={{ WebkitTouchCallout: "none" } as React.CSSProperties}
      />

      {/* Watermark sutil — visible solo si se especifica */}
      {watermark && (
        <div
          className="absolute inset-0 flex items-end justify-end p-3 pointer-events-none z-10"
          aria-hidden="true"
        >
          <span
            className="text-xs font-medium text-white/40 select-none"
            style={{
              textShadow: "0 1px 2px rgba(0,0,0,0.5)",
              letterSpacing: "0.05em",
            }}
          >
            {watermark}
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * Hook alternativo para aplicar protección a elementos existentes.
 * Útil cuando no podés reemplazar el componente directamente.
 *
 * Uso:
 *   const protection = useImageProtection()
 *   <div {...protection}><img src="..." /></div>
 */
export function useImageProtection() {
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
  }, [])

  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  return {
    onContextMenu: handleContextMenu,
    onDragStart: handleDragStart,
    className: "select-none",
    style: { WebkitTouchCallout: "none" } as React.CSSProperties,
  }
}
