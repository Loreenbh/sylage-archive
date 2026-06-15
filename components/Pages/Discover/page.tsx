"use client"
import { Roboto } from "next/font/google"
import BookLayout from "@/components/layout/Layout"
import { typography } from "@/styles/typography"
import Header from "@/components/layout/Header"
import { useRef, useState, useEffect } from "react"
import Sidebar from "@/components/layout/SideBar"
import ScrollableGrid from "@/components/ui/Grid/ScrollableGrid"

const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400"] })

const FILTERS = ["NEW", "FEATURED", "FOLLOWING"]

const moodboards = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  user: `user_${String(i + 1).padStart(2, "0")}`,
}))

function ScrollBar({ scrollRef }) {
  const [thumb, setThumb] = useState({ top: 0, height: 0 })

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const update = () => {
      const ratio = el.clientHeight / el.scrollHeight
      const thumbH = Math.max(ratio * el.clientHeight, 20)
      const maxScroll = el.scrollHeight - el.clientHeight
      const scrollRatio = maxScroll > 0 ? el.scrollTop / maxScroll : 0
      const maxThumbTop = el.clientHeight - thumbH
      setThumb({ top: scrollRatio * maxThumbTop, height: thumbH })
    }
    el.addEventListener("scroll", update)
    update()
    return () => el.removeEventListener("scroll", update)
  }, [scrollRef])

  return (
    <div className="relative w-px bg-black/10 h-full">
      <div
        className="absolute w-px bg-black/40"
        style={{ top: thumb.top, height: thumb.height }}
      />
    </div>
  )
}

export default function Discover( {onNavigate }) {
  const [activeFilter, setActiveFilter] = useState("NEW")
  const scrollRef = useRef(null)

  // Paires de moodboards pour afficher 2 par rangée
  const rows = []
  for (let i = 0; i < moodboards.length; i += 2) {
    rows.push([moodboards[i], moodboards[i + 1]])
  }
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
              onClick: () => console.log("create"),
            },
          ]}
      />}
      sidebar={<Sidebar text="DISCOVER" clickable={false} />}
    >

    <ScrollableGrid
      data={moodboards}
      renderItem={(board) => (
        <div
          className="aspect-square w-[350px] h-[350px] relative bg-zinc-100 cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300" />
          <p className="absolute bottom-3 left-3 text-[9px] tracking-[0.2em] text-black/30">
            {board.user}
          </p>
        </div>
      )}
    />

      {/* FILTRES */}
      <div className="flex items-center justify-center px-2 pt-4 pb-2 mt-2 relative">
          {/* centre = filtres */}
          <div className="flex items-center gap-7">
            {FILTERS.map((f, i) => (
              <div key={f} className="flex items-center gap-6">
                <button
                  onClick={() => setActiveFilter(f)}
                  className={`
                    ${roboto.className}
                    text-[10px] tracking-[0.35em] uppercase
                    transition-colors duration-300 relative group
                    ${activeFilter === f ? "text-black" : "text-black/30 hover:text-black/60"}
                  `}
                >
                  {f}
                  <span className={`
                    absolute -bottom-0.5 left-0 h-px bg-black
                    transition-all duration-300
                    ${activeFilter === f ? "w-full" : "w-0 group-hover:w-full"}
                  `} />
                </button>

                {i < FILTERS.length - 1 && (
                  <span className="text-black/20 text-[10px]">•</span>
                )}
              </div>
            ))}
          </div>

          {/* droite = bouton profil */}
          <div 
            onClick={() =>
              onNavigate({
                to: "profile",
                direction: "next",
              })
            }
          className="absolute right-2">
            <div className="mt-3 w-15 h-15 rounded-full bg-zinc-400/60 hover:bg-zinc-600 transition-colors duration-300" />
          </div>

        </div>
    </BookLayout>
  )
}