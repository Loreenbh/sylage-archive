"use client"

import { useEffect, useRef } from "react"

export default function PageFlip({
  current,
  next,
  animating,
  direction,
  onDone,
}) {

  const ref = useRef(null)

  useEffect(() => {

    if (!animating) return
    if (!ref.current) return

    const el = ref.current

    el.style.transition = "none"

    if (direction === "next") {

      el.style.transformOrigin = "left center"
      el.style.transform = "perspective(1200px) rotateY(0deg)"

      void el.offsetWidth

      el.style.transition = "all 1200ms ease"
      el.style.transform = "perspective(1200px) rotateY(-180deg)"
      el.style.opacity = "0"
    }

    if (direction === "prev") {

      el.style.transformOrigin = "right center"
      el.style.transform = "perspective(1200px) rotateY(0deg)"

      void el.offsetWidth

      el.style.transition = "all 1200ms ease"
      el.style.transform = "perspective(1200px) rotateY(180deg)"
      el.style.opacity = "0"
    }

    const timer = setTimeout(() => {
      onDone()
    }, 1200)

    return () => clearTimeout(timer)

  }, [animating])

  return (
    <div className="relative w-full h-full">

      {/* page de fond */}
      <div className="absolute inset-0">
        {animating ? next : current}
      </div>

      {/* page qui tourne */}
      {animating && (
        <div
          ref={ref}
          className="absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
          }}
        >
          {current}
        </div>
      )}

    </div>
  )
}