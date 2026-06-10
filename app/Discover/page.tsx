"use client"
import { Roboto } from "next/font/google"
import BookLayout from "@/components/Format/Layout"
import { typography } from "@/styles/typography"
import Header from "@/components/Book/Header"
import { useRef, useState, useEffect } from "react"

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

export default function Feed() {
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
        <div className="flex flex-col items-center h-[630px] gap-25 w-[60px]">
          <div className="w-px h-[180px] md:h-[120px] lg:h-[350px] bg-black/20" />
          <p className={`${roboto.className} text-4xl font-light -rotate-90 w-[90px] tracking-[0.2em] text-black/60`}>
          discover 
          </p>
        </div>
      }
    >
      <div className="flex flex-col w-full h-full max-w-[900px]">

        {/* CONTENEUR PRINCIPAL — même structure que auth */}
        <div className="flex gap-2 bg-blue-200">

          {/* SCROLLBAR à gauche */}
          <div className="flex flex-col items-center" style={{ height: 420 }}>
            <ScrollBar scrollRef={scrollRef} />
          </div>

          {/* GRILLE scrollable — même gap-1 que auth */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto"
            style={{ height: 704, scrollbarWidth: "none" }}
          >
            <style>{`div::-webkit-scrollbar{display:none}`}</style>

            {/* Rangées de carrés */}
            <div className="flex flex-col gap-1 bg-green-600">
              {rows.map((row, rowIdx) => (
                <div key={rowIdx} className="grid grid-cols-2 gap-4">
                  {row.map((board) => (
                    <div
                      key={board.id}
                      className="
                        aspect-square
                        w-[350px] h-[350px]
                        flex items-end p-3
                        cursor-pointer group relative overflow-hidden
                        bg-zinc-100
                      "
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300 group-hover:from-zinc-100 group-hover:to-zinc-200 transition-all duration-500" />
                      <p className={`${roboto.className} absolute text-[9px] tracking-[0.2em] text-black/30 group-hover:text-black/50 transition-colors`}>
                        {board.user}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

          </div>
        </div>

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
          <div className="absolute right-2">
            <div className="mt-3 w-15 h-15 rounded-full bg-zinc-400/60 hover:bg-zinc-600 transition-colors duration-300" />
          </div>

        </div>
      </div>
    </BookLayout>
  )
}