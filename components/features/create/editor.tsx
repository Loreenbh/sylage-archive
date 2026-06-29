"use client"

import { useState, useRef } from "react"
import type { OnNavigate, NavigationParams } from "@/types/navigation"

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

  console.log("📦 layout received:", layout)

  const slotCount = LAYOUT_SLOT_COUNT[layout] ?? 9

  /* ---------------- STATE ---------------- */
  const [images, setImages] = useState<(string | null)[]>(
    Array(slotCount).fill(null)
  )

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const activeSlotRef = useRef<number | null>(null)

  /* ---------------- SLOT CLICK ---------------- */
  const handleSlotClick = (index: number) => {
    console.log("🟡 slot clicked:", index)

    activeSlotRef.current = index
    console.log("📌 activeSlotRef:", activeSlotRef.current)

    fileInputRef.current?.click()
    console.log("📁 file input triggered")
  }

  /* ---------------- FILE CHANGE ---------------- */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    console.log("📄 file:", file)

    const slot = activeSlotRef.current
    console.log("📍 slot used:", slot)

    if (!file || slot === null) return

    const url = URL.createObjectURL(file)
    console.log("🖼️ created URL:", url)

    setImages((prev) => {
      const copy = [...prev]

      console.log("💾 updating images at index:", slot)

      copy[slot] = url

      console.log("📦 new images state:", copy)

      return copy
    })

    activeSlotRef.current = null
    console.log("🧹 slot reset")

    // IMPORTANT: permet re-upload même fichier
    e.target.value = ""
  }

  /* ---------------- RENDER LAYOUT ---------------- */
  const renderLayout = () => {
    console.log("🎨 renderLayout called")

    switch (layout) {
      case "A":
        return (
          <LayoutA
            images={images}
            onSelectSlot={handleSlotClick}
          />
        )
      case "B":
        return (
          <LayoutB
            images={images}
            onSelectSlot={handleSlotClick}
          />
        )
      case "C":
        return (
          <LayoutC
            images={images}
            onSelectSlot={handleSlotClick}
          />
        )
      case "D":
        return (
          <LayoutD
            images={images}
            onSelectSlot={handleSlotClick}
          />
        )
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