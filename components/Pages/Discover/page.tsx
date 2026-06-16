"use client"

import { useState } from "react"
import { Roboto } from "next/font/google"

/* COMPONENTS */
import BookLayout from "@/components/layout/Layout"
import Sidebar from "@/components/layout/SideBar"
import Header from "@/components/layout/Header"
import ScrollableGrid from "@/components/ui/Grid/ScrollableGrid"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400"],
})

const FILTERS = ["NEW", "FEATURED", "FOLLOWING"]

const moodboards = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  user: `user_${String(i + 1).padStart(2, "0")}`,
}))

export default function Discover({ onNavigate }) {
  const [activeFilter, setActiveFilter] = useState("NEW")
  const [showFilters, setShowFilters] = useState(false)

  return (
    <BookLayout
      header={
        <Header
          showFilters={showFilters}
          items={[
            {
              label: "HOME",
              active: true,
            },
            {
              label: "FILTER",
              clickable: true,
              onClick: () => setShowFilters((prev) => !prev),
            },
            {
              label: "CREATE",
              clickable: true,
            },
          ]}
        />
      }
      sidebar={
        <Sidebar
          text="DISCOVER" gap="gap-22"
        />
      }
    >
      <div className="flex flex-col h-full min-h-0">
        
        {/* GRID */}
        <ScrollableGrid
          data={moodboards}
          renderItem={(board) => (
            <div className="relative aspect-square w-full bg-zinc-100 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300" />

              <p className="absolute bottom-2 left-2 text-[9px] tracking-[0.2em] text-black/30">
                {board.user}
              </p>
            </div>
          )}
        />

        {/* FOOTER */}
        <div className="relative flex items-center justify-center shrink-0 py-6 sm:py-8">
          
          <div className="flex items-center gap-6 pb-">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`
                  ${roboto.className}
                  text-[7px]
                  tracking-[0.30em]
                  uppercase
                  transition-colors duration-300
                  ${
                    activeFilter === filter
                      ? "text-black"
                      : "text-black/30 hover:text-black/60"
                  }
                `}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="absolute right-2">
            <div
              onClick={() =>
                onNavigate({
                  to: "profile",
                  direction: "next",
                })
              }
              className="
                w-8
                h-8
                rounded-full
                bg-zinc-400/60
                hover:bg-zinc-600/60
                transition-colors
                cursor-pointer
              "
            />
          </div>

        </div>
      </div>
    </BookLayout>
  )
}