"use client"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import PageFlip from "./PageFlip"
import Cover from "@/app/Cover/page"
import Authentification from "@/app/Auth/page"
import Discover from "@/app/Discover/page"

// Définition des pages avec leur route et leur mode de navigation
const PAGES = [
  { component: Cover,           route: "/",          mode: "cover"     },
  { component: Authentification, route: "/Auth",     mode: "auth"      },
  { component: Discover,        route: "/discover",  mode: "editorial" },
]

export default function Book() {
  const router = useRouter()
  const [pageIndex, setPageIndex]   = useState(0)
  const [animating, setAnimating]   = useState(false)
  const [direction, setDirection]   = useState(null)
  const [pendingIndex, setPendingIndex] = useState(null)

  const flip = useCallback((targetIndex, dir) => {
    if (animating) return
    if (targetIndex < 0 || targetIndex >= PAGES.length) return
    setPendingIndex(targetIndex)
    setDirection(dir)
    setAnimating(true)
  }, [animating])

  const flipNext = useCallback(() => flip(pageIndex + 1, "next"), [flip, pageIndex])
  const flipPrev = useCallback(() => flip(pageIndex - 1, "prev"), [flip, pageIndex])

  // Appelé par Authentification après login réussi
  const flipNextAuto = useCallback(() => flip(pageIndex + 1, "next"), [flip, pageIndex])

  const onDone = useCallback(() => {
    const target = PAGES[pendingIndex]
    setPageIndex(pendingIndex)
    setPendingIndex(null)
    setAnimating(false)
    setDirection(null)
    // Mise à jour de l'URL sans rechargement
    router.push(target.route, { scroll: false })
  }, [pendingIndex, router])

  const currentPage  = PAGES[pageIndex]
  const pendingPage  = pendingIndex !== null ? PAGES[pendingIndex] : null
  const currentMode  = currentPage.mode

  // On injecte flipNext/flipPrev dans les pages éditoriales via props
  const CurrentComponent = currentPage.component
  const PendingComponent = pendingPage?.component

  const currentEl = <CurrentComponent
    onFlipNext={flipNext}
    onFlipPrev={flipPrev}
    onAuthSuccess={flipNextAuto}
  />

  const nextEl = PendingComponent ? <PendingComponent
    onFlipNext={flipNext}
    onFlipPrev={flipPrev}
    onAuthSuccess={flipNextAuto}
  /> : null

  return (
    <div className="relative w-[90vw] sm:w-[85vw] md:w-[80vw] max-w-[800px] aspect-[220/280] mx-auto">
      <PageFlip
        current={currentEl}
        next={nextEl}
        animating={animating}
        direction={direction}
        onDone={onDone}
        nextClick={flipNext}
        prevClick={flipPrev}
        mode={currentMode}
      />
    </div>
  )
}