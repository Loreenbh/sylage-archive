"use client"

import { useRef, useState } from "react"
import { toPng } from "html-to-image"
import type { OnNavigate, NavigationParams } from "@/types/navigation"
import type { MoodboardSlot, MoodboardSlotPatch } from "@/types/editor"
import { MIN_TAGS_TOTAL } from "@/constants/tags"
import TagPicker from "@/components/filters/TagPicker"

/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Header from "@/components/navigation/Header"
import Sidebar from "@/components/navigation/SideBar"
import ProfileButton from "@/components/ui/buttons/ProfileButton"
import BackButton from "@/components/ui/buttons/BackButton"

/* LAYOUTS */
import LayoutA from "./layouts/LayoutA"
import LayoutB from "./layouts/LayoutB"
import LayoutC from "./layouts/LayoutC"
import LayoutD from "./layouts/LayoutD"

/* STYLE */
import { typography } from "@/styles/typography"
import { colors } from "@/styles/colors"

/* SERVICES */
import { uploadImage } from "@/lib/services/upload"
import { createMoodboard } from "@/lib/services/moodboard"
import { useCurrentUser } from "@/hooks/useCurrentUser"

type Props = {
  onNavigate: OnNavigate
  params?: NavigationParams["params"] | null
  onBack?: () => void

}

const LAYOUT_SLOT_COUNT = {
  A: 9,
  B: 7,
  C: 6,
  D: 6,
} as const

export default function Editor({ onNavigate, params, onBack }: Props) {
  const { user: currentUser } = useCurrentUser()
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
      const imageData = await toPng(layoutRef.current)
      console.log(
        layoutRef.current?.offsetWidth,
        layoutRef.current?.offsetHeight
      )
      layoutRef.current.classList.remove("export-mode")
      const imgUrl = await uploadImage(imageData)
      console.log("IMAGE UPLOADED :", imgUrl)
      await createMoodboard(
        imgUrl,
        allSelectedTags
      )
     
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
      sidebar={<Sidebar text="COMPOSE" clickable={false} />}

      actionsBar={
        <div className="flex w-full items-center justify-between">
          <button
            onClick={handlePublish}
            disabled={!canPublish || isPublishing}
            className={`${typography.buttonBody} disabled:opacity-40`}
          >
            publish
          </button>
        </div>
      }
      footerLeft={ <BackButton onBack={onBack} /> }
      footerRight={
          <div className="flex items-center gap-4">
            <span className={typography.username}>
              {currentUser?.username}
            </span>
            <ProfileButton onNavigate={onNavigate}/>
          </div>
          }
        >       
        <div className="flex flex-col h-full w-full min-h-0">

          {/* MOODBOARD VISIBLE POUR L'UTILISATEUR */}
          <div className="flex-1 min-h-0 flex justify-center">
            <div
              className="
                aspect-square
                h-full
                max-w-full
                overflow-hidden
                relative
              "
            >
              {renderLayout()}
            </div>
          </div>


          {/* EXPORT CACHE POUR LA CAPTURE PNG */}
          <div
            ref={layoutRef}
            className="
              fixed
              left-[-9999px]
              top-0
              w-[1200px]
              h-[1200px]
              overflow-hidden
              pointer-events-none
            "
          >
            {renderLayout()}
          </div>


          {/* FILTRES / TAGS */}
          <div className="flex flex-col items-center px-4">

          <TagPicker
            styleTags={styleTags}
            ambianceTags={ambianceTags}
            colorTags={colorTags}
            onChangeStyle={setStyleTags}
            onChangeAmbiance={setAmbianceTags}
            onChangeColor={setColorTags}
          />

          <p className="text-[7px] text-black/50 tracking-[0.15em]">
            {allSelectedTags.length} tag{allSelectedTags.length > 1 ? "s" : ""} sélectionné{allSelectedTags.length > 1 ? "s" : ""} (min {MIN_TAGS_TOTAL})
          </p>

          {publishError && (
            <p className={`
              text-[10px] ${colors.feedback.error} tracking-[0.1em] mt-1
              `}>
              {publishError}
            </p>
          )}
        </div>

      </div>

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