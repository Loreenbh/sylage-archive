"use client"

import { useRef, useState } from "react"
import type { OnNavigate, NavigationParams } from "@/types/navigation"
import type { MoodboardSlot, MoodboardSlotPatch } from "@/types/moodboard"

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

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const activeSlotRef = useRef<number | null>(null)

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

    // permet re-upload même fichier
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

          <button className={typography.buttonBody}>
            publish
          </button>
        </div>
      }
    >
      <div className="h-full w-full">
        {renderLayout()}
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