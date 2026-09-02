"use client"

import { useCallback, useRef, useState } from "react"
import type { MoodboardSlot, MoodboardSlotPatch } from "@/types/editor"

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

  /* ---------------- DÉPLACEMENT ---------------- */

  const panState = useRef<{
    startX: number
    startY: number
    startOffsetX: number
    startOffsetY: number
  } | null>(null)

  const [isPanning, setIsPanning] = useState(false)

  /* ---------------- ZOOM ---------------- */

  const zoomState = useRef<{
    startY: number
    startScale: number
  } | null>(null)

  const [isZooming, setIsZooming] = useState(false)

  /* ---------------- LIMITES DE DÉPLACEMENT ---------------- */

  const clampOffset = useCallback(
    (offsetX: number, offsetY: number, scale: number) => {
      const rect = containerRef.current?.getBoundingClientRect()

      if (!rect) {
        return {
          offsetX: 0,
          offsetY: 0,
        }
      }

      const maxOffsetX = (rect.width * (scale - 1)) / 2
      const maxOffsetY = (rect.height * (scale - 1)) / 2

      return {
        offsetX: Math.min(
          maxOffsetX,
          Math.max(-maxOffsetX, offsetX)
        ),
        offsetY: Math.min(
          maxOffsetY,
          Math.max(-maxOffsetY, offsetY)
        ),
      }
    },
    []
  )

  /* ---------------- DOUBLE CLICK ---------------- */

  const handleDoubleClick = () => {
    if (!slot) return

    onChangeTransform({
      scale: 1,
      offsetX: 0,
      offsetY: 0,
    })
  }

  /* =====================================================
     DÉPLACEMENT
     ===================================================== */

  const handlePanPointerDown = (
    e: React.PointerEvent<HTMLButtonElement>
  ) => {
    if (!slot) return

    e.preventDefault()
    e.stopPropagation()

    e.currentTarget.setPointerCapture(e.pointerId)

    panState.current = {
      startX: e.clientX,
      startY: e.clientY,
      startOffsetX: slot.offsetX,
      startOffsetY: slot.offsetY,
    }

    setIsPanning(true)
  }

  const handlePanPointerMove = (
    e: React.PointerEvent<HTMLButtonElement>
  ) => {
    if (!slot || !panState.current) return

    const deltaX =
      e.clientX - panState.current.startX

    const deltaY =
      e.clientY - panState.current.startY

    const { offsetX, offsetY } = clampOffset(
      panState.current.startOffsetX + deltaX,
      panState.current.startOffsetY + deltaY,
      slot.scale
    )

    onChangeTransform({
      offsetX,
      offsetY,
    })
  }

  const handlePanPointerUp = () => {
    panState.current = null
    setIsPanning(false)
  }

  const handlePanPointerCancel = () => {
    panState.current = null
    setIsPanning(false)
  }

  /* =====================================================
     ZOOM
     ===================================================== */

  const handleZoomPointerDown = (
    e: React.PointerEvent<HTMLButtonElement>
  ) => {
    if (!slot) return

    e.preventDefault()
    e.stopPropagation()

    e.currentTarget.setPointerCapture(e.pointerId)

    zoomState.current = {
      startY: e.clientY,
      startScale: slot.scale,
    }

    setIsZooming(true)
  }

  const handleZoomPointerMove = (
    e: React.PointerEvent<HTMLButtonElement>
  ) => {
    if (!slot || !zoomState.current) return

    const deltaY =
      zoomState.current.startY - e.clientY

    const nextScale = Math.min(
      MAX_SCALE,
      Math.max(
        MIN_SCALE,
        zoomState.current.startScale +
          deltaY * ZOOM_DRAG_SENSITIVITY
      )
    )

    const { offsetX, offsetY } = clampOffset(
      slot.offsetX,
      slot.offsetY,
      nextScale
    )

    onChangeTransform({
      scale: nextScale,
      offsetX,
      offsetY,
    })
  }

  const handleZoomPointerUp = () => {
    zoomState.current = null
    setIsZooming(false)
  }

  const handleZoomPointerCancel = () => {
    zoomState.current = null
    setIsZooming(false)
  }

  return (
    <div
      ref={containerRef}
      className={`
        group
        relative
        w-full
        h-full
        min-w-0
        min-h-0
        overflow-hidden
        ${className}
      `}
    >
      {slot ? (
        <>
          {/* IMAGE */}
          <img
            src={slot.url}
            onDoubleClick={handleDoubleClick}
            draggable={false}
            style={{
              transform: `
                translate(${slot.offsetX}px, ${slot.offsetY}px)
                scale(${slot.scale})
              `,
              touchAction: "none",
            }}
            className="
              absolute
              inset-0
              w-full
              h-full
              object-cover
              select-none
              pointer-events-none
            "
            alt=""
          />

          {/* =================================================
              MODIFIER L'IMAGE
              Visible sur desktop au hover
              TOUJOURS visible sur mobile
              ================================================= */}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onSelect()
            }}
            className="
              export-hidden
              absolute
              bottom-2
              right-2
              z-20
              w-5
              h-5
              rounded-full
              bg-black/60
              text-white
              text-xs
              flex
              items-center
              justify-center
              opacity-100
              transition-opacity
              touch-manipulation
              select-none
            "
            aria-label="Changer l'image"
          >
            ✎
          </button>

          {/* =================================================
              DÉPLACER
              ================================================= */}

          <button
            type="button"
            onPointerDown={handlePanPointerDown}
            onPointerMove={handlePanPointerMove}
            onPointerUp={handlePanPointerUp}
            onPointerCancel={handlePanPointerCancel}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            className={`
              export-hidden
              absolute
              top-2
              left-2
              z-20

              w-5
              h-5
              sm:w-6
              sm:h-6

              rounded-full
              bg-black/60
              text-white
              text-xs

              flex
              items-center
              justify-center

              touch-none
              select-none

              transition-opacity

              ${
                isPanning
                  ? "cursor-grabbing opacity-100"
                  : "cursor-grab opacity-100 sm:opacity-70 sm:group-hover:opacity-100"
              }
            `}
            aria-label="Déplacer l'image"
          >
            ⤡
          </button>

          {/* =================================================
              ZOOM
              ================================================= */}

          <button
            type="button"
            onPointerDown={handleZoomPointerDown}
            onPointerMove={handleZoomPointerMove}
            onPointerUp={handleZoomPointerUp}
            onPointerCancel={handleZoomPointerCancel}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            className={`
              export-hidden
              absolute
              top-2
              right-2
              z-20

              w-5
              h-5
              sm:w-6
              sm:h-6

              rounded-full
              bg-black/60
              text-white
              text-xs

              flex
              items-center
              justify-center

              touch-none
              select-none

              transition-opacity

              ${
                isZooming
                  ? "cursor-ns-resize opacity-100"
                  : "cursor-ns-resize opacity-100 sm:opacity-70 sm:group-hover:opacity-100"
              }
            `}
            aria-label="Zoomer l'image"
          >
            🔍
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={onSelect}
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            text-black/30
            text-xs
          "
        >
          +
        </button>
      )}
    </div>
  )
}