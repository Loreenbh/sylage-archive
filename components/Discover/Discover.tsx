"use client"
import { Roboto } from "next/font/google"
import BookLayout from "@/components/Format/Layout"
import { typography } from "@/styles/typography"
import Header from "@/components/Book/Header"
import { useRef, useState, useEffect } from "react"

const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400"] })

const FILTERS = ["NEW", "FEATURED", "FOLLOWING"]

const moodboards = Array.from({ length: 12 }, (_, i) => ({
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

export default function Discover() {
  const [activeFilter, setActiveFilter] = useState("NEW")
  const scrollRef = useRef(null)

  // Paires de moodboards pour afficher 2 par rangée
  const rows = []
  for (let i = 0; i < moodboards.length; i += 2) {
    rows.push([moodboards[i], moodboards[i + 1]])
  }

  return (
    <BookLayout
      header={<Header active="HOME" />}
      sidebar={
        <div className="flex flex-col items-center h-[450px] gap-35 w-[60px] mt-28">
          <div className="w-px h-[180px] md:h-[120px] lg:h-[350px] bg-black/20" />
          <p className={`${roboto.className} text-4xl font-light -rotate-90 w-[100px] tracking-[0.2em] text-black/60`}>
            DISCOVER
          </p>
        </div>
      }
      footer={
        <div className="flex items-center justify-end">
          <button
            className="w-15 h-15 rounded-full overflow-hidden border border-black/10 hover:border-black/30 transition-all duration-300 group"
            title="Mon profil"
          >
            <div className="w-full h-full bg-gradient-to-br from-zinc-300 to-zinc-400 group-hover:from-zinc-200 group-hover:to-zinc-300 transition-all duration-300" />
          </button>
        </div>
      }
    >
      <div className="flex flex-col w-full">

        {/* CONTENEUR PRINCIPAL avec flèche scroll à gauche */}
        <div className="flex gap-3 items-start h-full">

          {/* SCROLLBAR à gauche */}
          <div className="flex flex-col items-center" style={{ height: 530 }}>
            <ScrollBar scrollRef={scrollRef} />
          </div>

          {/* GRILLE scrollable — 2x2 carrés */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto"
            style={{ height: 530, scrollbarWidth: "none" }}
          >
            <style>{`div::-webkit-scrollbar{display:none}`}</style>

            <div className="grid grid-cols-2 gap-2 h-full bg-blue-400">
              {rows.map((row, rowIdx) => (
                row.map((board) => (
                  <div
                    key={board.id}
                    className="
                      w-[300px] h-[300px]
                      flex items-end p-3
                      cursor-pointer group relative overflow-hidden
                      bg-zinc-100
                    "
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300 group-hover:from-zinc-100 group-hover:to-zinc-200 transition-all duration-500" />
                  </div>
                ))
              ))}
            </div>
          </div>
        </div>

        {/* FILTRES EN BAS */}
        <div className="flex items-center gap-6 px-10 pt-5 mt-15 pb-2 bg-blue-400">
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

      </div>
    </BookLayout>
  )
}