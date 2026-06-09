"use client"
import { useEffect, useRef } from "react"

export default function PageFlip({
  current,
  next,
  animating,
  direction,
  onDone,
  nextClick,
  prevClick,
  isFirst,
  isLast,
}) {
  const flippingRef = useRef(null)

  useEffect(() => {
    if (!animating || !flippingRef.current) return

    const el = flippingRef.current

    // Force reflow avant d'appliquer la transition
    const p = "perspective(1200px) "

    if (direction === "next") {
      // La page courante part vers la gauche (se referme)
      el.style.transition = "none"
      el.style.transform = `${p}rotateY(0deg)`
      el.style.opacity = "1"
      void el.offsetWidth
      el.style.transition = "transform 650ms cubic-bezier(0.645, 0.045, 0.355, 1.000), opacity 650ms ease"
      el.style.transform = `${p}rotateY(-180deg)`
      el.style.opacity = "0"
    } else {
      // La page destination arrive depuis derrière à gauche et s'ouvre vers la droite
      el.style.transition = "none"
      el.style.transform = `${p}rotateY(-180deg)`
      el.style.opacity = "0"
      void el.offsetWidth
      el.style.transition = "transform 650ms cubic-bezier(0.645, 0.045, 0.355, 1.000), opacity 650ms ease"
      el.style.transform = `${p}rotateY(0deg)`
      el.style.opacity = "1"
    }

    const t = setTimeout(() => {
      onDone()
    }, 650)

    return () => clearTimeout(t)
  }, [animating])

  return (
    <div className="relative w-full h-full">

      {/* PAGE DE FOND */}
      <div className="absolute inset-0">
        {animating
          ? (direction === "prev" ? current : next)
          : current}
      </div>

      {/* PAGE QUI TOURNE — source (next) ou destination (prev) */}
      {animating && (
        <div
          ref={flippingRef}
          className="absolute inset-0"
          style={{
            transformOrigin: "left center",
            backfaceVisibility: "hidden",
            willChange: "transform, opacity",
          }}
        >
          {direction === "prev" ? next : current}
        </div>
      )}

      {/* PAGE STATIQUE (pas d'animation) */}
      {!animating && (
        <div className="absolute inset-0">
          {current}
        </div>
      )}

      {/* ZONES DE CLIC */}
      {!isLast && (
        <div
          onClick={nextClick}
          className="absolute right-0 top-0 w-16 h-full z-50 cursor-pointer"
        />
      )}
      {!isFirst && (
        <div
          onClick={prevClick}
          className="absolute left-0 top-0 w-16 h-full z-50 cursor-pointer"
        />
      )}
    </div>
  )
}