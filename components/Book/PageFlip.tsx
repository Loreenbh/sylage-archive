"use client"

import { useEffect } from "react"

export default function PageFlip({
  current,
  next,
  animating,
  direction,
  onDone,
  nextClick,
  prevClick
}) {

  const rotation =
    !animating ? 0 :
    direction === "next" ? -180 :
    180

  // déclenche fin d’anim proprement
  useEffect(() => {
    if (!animating) return

    const t = setTimeout(() => {
      onDone()
    }, 700)

    return () => clearTimeout(t)
  }, [animating])

  return (
    <div className="relative w-full h-full [perspective:2000px]">

      {/* PAGE FIXE EN DESSOUS */}
      <div className="absolute inset-0">
        {current}
      </div>

      {/* PAGE QUI TOURNE (FIGÉE) */}
      <div
        className="absolute inset-0 origin-left [transform-style:preserve-3d]"
        style={{
          transform: `rotateY(${rotation}deg)`,
          transition: animating ? "transform 700ms ease-in-out" : "none"
        }}
      >

        {/* FACE AVANT */}
        <div className="absolute inset-0 backface-hidden">
          {current}
        </div>

        {/* FACE ARRIÈRE */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          {next || current}
        </div>

      </div>

      {/* CLICK ZONES */}
      <div onClick={nextClick} className="absolute right-0 top-0 w-10 h-full z-50" />
      <div onClick={prevClick} className="absolute left-0 top-0 w-10 h-full z-50" />
    </div>
  )
}