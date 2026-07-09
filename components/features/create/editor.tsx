"use client"

import { useRef, useState } from "react"
import { toPng } from "html-to-image"
import type { OnNavigate, NavigationParams } from "@/types/navigation"
import type { MoodboardSlot, MoodboardSlotPatch } from "@/types/moodboard"
import { MIN_TAGS_TOTAL } from "@/constants/tags"
import TagPicker from "@/components/filters/TagPicker"

/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Header from "@/components/navigation/Header"
import Sidebar from "@/components/navigation/SideBar"
import ProfileButton from "@/components/ui/buttons/ProfileButton"

/* LAYOUTS */
import LayoutA from "../moodboards/LayoutA"
import LayoutB from "../moodboards/LayoutB"
import LayoutC from "../moodboards/LayoutC"
import LayoutD from "../moodboards/LayoutD"

/* STYLE */
import { typography } from "@/styles/typography"

type Props = {
  onNavigate: OnNavigate
  params?: NavigationParams["params"] | null
}

const LAYOUT_SLOT_COUNT = {
  A: 9,
  B: 7,
  C: 6,
  D: 6,
} as const

export default function Editor({ onNavigate, params }: Props) {
  const layout = params?.layout as keyof typeof LAYOUT_SLOT_COUNT

  const slotCount = LAYOUT_SLOT_COUNT[layout] ?? 9

  /* ---------------- STATE ---------------- */
  const [slots, setSlots] = useState<MoodboardSlot[]>(
    Array(slotCount).fill(null)
  )
  const [styleTags, setStyleTags] = useState<string[]>([])
  const [ambianceTags, setAmbianceTags] = useState<string[]>([])
  const [colorTags, setColorTags] = useState<string[]>([])
  const [publishError, setPublishError] = useState<string | null>(null)
  const [isPublishing, setIsPublishing] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const activeSlotRef = useRef<number | null>(null)
  const layoutRef = useRef<HTMLDivElement | null>(null)

  /* ---------------- SLOT CLICK (upload / changer image) ---------------- */
  const handleSlotClick = (index: number) => {
    activeSlotRef.current = index
    fileInputRef.current?.click()
  }

  /* ---------------- FILE CHANGE ---------------- */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    const slot = activeSlotRef.current

    if (!file || slot === null) return

    const url = URL.createObjectURL(file)

    setSlots((prev) => {
      const copy = [...prev]
      copy[slot] = { url, scale: 1, offsetX: 0, offsetY: 0 }
      return copy
    })

    activeSlotRef.current = null
    e.target.value = ""
  }

  /* ---------------- TRANSFORM UPDATE (pan/zoom) ---------------- */
  const handleUpdateSlot = (index: number, patch: MoodboardSlotPatch) => {
    setSlots((prev) => {
      const current = prev[index]
      if (!current) return prev

      const copy = [...prev]
      copy[index] = { ...current, ...patch }
      return copy
    })
  }

  /* ---------------- TAGS (3 catégories, plafonds distincts) ---------------- */
  const allSelectedTags = [...styleTags, ...ambianceTags, ...colorTags]

  const canPublish = allSelectedTags.length >= MIN_TAGS_TOTAL

  /* ---------------- PUBLISH ---------------- */
  const handlePublish = async () => {
    setPublishError(null)

    if (!canPublish) {
      setPublishError(`Choisis au moins ${MIN_TAGS_TOTAL} tags au total`)
      return
    }

    if (!layoutRef.current) {
      setPublishError("Erreur interne : layout introuvable")
      return
    }

    setIsPublishing(true)

    try {
      layoutRef.current.classList.add("export-mode")
      // 1. capture le layout affiché (avec les images déjà zoomées/positionnées) en PNG
      const imageData = await toPng(layoutRef.current)
      layoutRef.current.classList.remove("export-mode")
      // 2. upload cette image, récupère son URL réelle
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData }),
      })

      const uploadData = await uploadRes.json()

      if (!uploadRes.ok) {
        setPublishError(uploadData.error ?? "Erreur lors de l'upload")
        return
      }

      // 3. crée le moodboard avec cette URL + les tags
      //    (le serveur déduit l'utilisateur depuis la session, pas besoin de l'envoyer)
      const res = await fetch("/api/moodboards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: uploadData.url,
          tags: allSelectedTags,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setPublishError(data.error ?? "Erreur lors de la publication")
        return
      }

      onNavigate({
        to: "discover",
        direction: "prev",
      })
    } catch {
      setPublishError("Erreur réseau")
    } finally {
      setIsPublishing(false)
    }
  }

  /* ---------------- RENDER LAYOUT ---------------- */
  const renderLayout = () => {
    const layoutProps = {
      images: slots,
      onSelectSlot: handleSlotClick,
      onUpdateSlot: handleUpdateSlot,
    }

    switch (layout) {
      case "A":
        return <LayoutA {...layoutProps} />
      case "B":
        return <LayoutB {...layoutProps} />
      case "C":
        return <LayoutC {...layoutProps} />
      case "D":
        return <LayoutD {...layoutProps} />
      default:
        return (
          <div className="flex items-center justify-center h-full text-black/40">
            No layout selected
          </div>
        )
    }
  }

  /* ---------------- UI ---------------- */
  return (
    <BookLayout
      header={
        <Header
          items={[
            {
              section: "HOME",
              clickable: true,
              onClick: () =>
                onNavigate({
                  to: "discover",
                  direction: "prev",
                }),
            },
            {
              section: "FILTER",
              clickable: false,
            },
            {
              section: "CREATE",
              clickable: true,
              active: true,
            },
          ]}
        />
      }
      sidebar={<Sidebar text="EDITOR" clickable={false} />}

      actionsBar={
        <div className="flex w-full items-center justify-between">
          <button
            onClick={() =>
              onNavigate({
                to: "create",
                direction: "prev",
                params: { layout },
              })
            }
            className={typography.buttonBody}
          >
            back
          </button>

          <button
            onClick={handlePublish}
            disabled={!canPublish || isPublishing}
            className={`${typography.buttonBody} disabled:opacity-40`}
          >
            publish
          </button>
        </div>
      }
    >
      <div className="flex flex-col h-full w-full gap-2">

        <div ref={layoutRef} className="h-full w-full">
          {renderLayout()}
        </div>

        {/* PICKER DE TAGS : 3 catégories dépliables */}
        <div className="flex flex-col items-center gap-2 pb-2 px-4">

          <TagPicker
            styleTags={styleTags}
            ambianceTags={ambianceTags}
            colorTags={colorTags}
            onChangeStyle={setStyleTags}
            onChangeAmbiance={setAmbianceTags}
            onChangeColor={setColorTags}
          />

          <p className="text-[9px] text-black/30 tracking-[0.15em]">
            {allSelectedTags.length} tag{allSelectedTags.length > 1 ? "s" : ""} sélectionné{allSelectedTags.length > 1 ? "s" : ""} (min {MIN_TAGS_TOTAL})
          </p>

          {publishError && (
            <p className="text-[10px] text-red-600 tracking-[0.1em] mt-1">
              {publishError}
            </p>
          )}
        </div>

      </div>

      {/* INPUT FILE HIDDEN */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </BookLayout>
  )
}