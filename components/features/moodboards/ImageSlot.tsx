"use client"

import { useCallback, useRef, useState } from "react"
import type { MoodboardSlot, MoodboardSlotPatch } from "@/types/moodboard"

type Props = {
  slot: MoodboardSlot
  onSelect: () => void
  onChangeTransform: (patch: MoodboardSlotPatch) => void
  className?: string
}

const MIN_SCALE = 1
const MAX_SCALE = 3
const ZOOM_DRAG_SENSITIVITY = 0.01

export default function ImageSlot({
  slot,
  onSelect,
  onChangeTransform,
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  /* état du drag de déplacement (icône flèche) */
  const panState = useRef<{
    startX: number
    startY: number
    startOffsetX: number
    startOffsetY: number
  } | null>(null)
  const [isPanning, setIsPanning] = useState(false)

  /* état du drag de zoom (icône loupe) */
  const zoomState = useRef<{
    startY: number
    startScale: number
  } | null>(null)
  const [isZooming, setIsZooming] = useState(false)

  /* Empêche l'image de révéler du vide autour de la cellule :
     le déplacement max dépend du niveau de zoom courant. */
  const clampOffset = useCallback(
    (offsetX: number, offsetY: number, scale: number) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return { offsetX: 0, offsetY: 0 }

      const maxOffsetX = (rect.width * (scale - 1)) / 2
      const maxOffsetY = (rect.height * (scale - 1)) / 2

      return {
        offsetX: Math.min(maxOffsetX, Math.max(-maxOffsetX, offsetX)),
        offsetY: Math.min(maxOffsetY, Math.max(-maxOffsetY, offsetY)),
      }
    },
    []
  )

  const handleDoubleClick = () => {
    if (!slot) return
    onChangeTransform({ scale: 1, offsetX: 0, offsetY: 0 })
  }

  /* ---------------- DÉPLACEMENT (icône flèche) ---------------- */
  const handlePanPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!slot) return

    e.currentTarget.setPointerCapture(e.pointerId)
    panState.current = {
      startX: e.clientX,
      startY: e.clientY,
      startOffsetX: slot.offsetX,
      startOffsetY: slot.offsetY,
    }
    setIsPanning(true)
  }

  const handlePanPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!slot || !panState.current) return

    const deltaX = e.clientX - panState.current.startX
    const deltaY = e.clientY - panState.current.startY

    const { offsetX, offsetY } = clampOffset(
      panState.current.startOffsetX + deltaX,
      panState.current.startOffsetY + deltaY,
      slot.scale
    )

    onChangeTransform({ offsetX, offsetY })
  }

  const handlePanPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    panState.current = null
    setIsPanning(false)
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  /* ---------------- ZOOM (icône loupe, drag vertical) ---------------- */
  const handleZoomPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!slot) return

    e.currentTarget.setPointerCapture(e.pointerId)
    zoomState.current = {
      startY: e.clientY,
      startScale: slot.scale,
    }
    setIsZooming(true)
  }

  const handleZoomPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!slot || !zoomState.current) return

    // glisser vers le haut = zoom avant, vers le bas = zoom arrière
    const deltaY = zoomState.current.startY - e.clientY
    const nextScale = Math.min(
      MAX_SCALE,
      Math.max(MIN_SCALE, zoomState.current.startScale + deltaY * ZOOM_DRAG_SENSITIVITY)
    )

    const { offsetX, offsetY } = clampOffset(slot.offsetX, slot.offsetY, nextScale)

    onChangeTransform({ scale: nextScale, offsetX, offsetY })
  }

  const handleZoomPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    zoomState.current = null
    setIsZooming(false)
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  return (
    <div
      ref={containerRef}
      className={`group relative min-w-0 min-h-0 overflow-hidden transition ${className}`}
    >
      {slot ? (
        <>
          <img
            src={slot.url}
            onDoubleClick={handleDoubleClick}
            draggable={false}
            style={{
              transform: `translate(${slot.offsetX}px, ${slot.offsetY}px) scale(${slot.scale})`,
              touchAction: "none",
            }}
            className="absolute inset-0 w-full h-full object-cover select-none"
          />

          {/* bouton discret pour changer l'image, visible au survol */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onSelect()
            }}
            className="absolute bottom-1 right-1 z-10 w-6 h-6 rounded-full bg-black/50 text-white text-xs
                       flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            aria-label="Changer l'image"
          >
            ✎
          </button>

          {/* icône flèche : rester appuyé + glisser dans n'importe quelle
              direction pour repositionner l'image dans la cellule */}
          <button
            type="button"
            onPointerDown={handlePanPointerDown}
            onPointerMove={handlePanPointerMove}
            onPointerUp={handlePanPointerUp}
            onClick={(e) => e.stopPropagation()}
            className={`absolute top-1 left-1 z-10 w-6 h-6 rounded-full bg-black/50 text-white text-xs
                        flex items-center justify-center transition touch-none
                        ${isPanning ? "cursor-grabbing opacity-100" : "cursor-grab opacity-70 group-hover:opacity-100"}`}
            aria-label="Déplacer l'image"
          >
            ⤡
          </button>

          {/* icône loupe : rester appuyé + glisser verticalement
              (haut = zoom avant, bas = zoom arrière) */}
          <button
            type="button"
            onPointerDown={handleZoomPointerDown}
            onPointerMove={handleZoomPointerMove}
            onPointerUp={handleZoomPointerUp}
            onClick={(e) => e.stopPropagation()}
            className={`absolute top-1 right-1 z-10 w-6 h-6 rounded-full bg-black/50 text-white text-xs
                        flex items-center justify-center transition touch-none
                        ${isZooming ? "cursor-ns-resize opacity-100" : "cursor-ns-resize opacity-70 group-hover:opacity-100"}`}
            aria-label="Zoomer l'image"
          >
            🔍
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={onSelect}
          className="absolute inset-0 flex items-center justify-center text-black/30 text-xs"
        >
          +
        </button>
      )}
    </div>
  )
}