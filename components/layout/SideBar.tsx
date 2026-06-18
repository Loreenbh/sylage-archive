"use client"
import { useState } from "react"
import { roboto } from "@/styles/fonts"

type Props = {
  text: string
  gap?: string
  onNavigate?: (params: { to: string; direction?: "next" | "prev" }) => void
  clickable?: boolean
}

export default function Sidebar({
  text,
  gap = "gap-4 sm:gap-6 md:gap-8 lg:gap-10",
  onNavigate,
  clickable = true,
}: Props) {
  const [isHovering, setIsHovering] = useState(false)

  const handleClick = () => {
    if (clickable) {
      setIsHovering(false)  // ← Reset hover au clic
      onNavigate?.({ to: "auth", direction: "next" })
    }
  }

  return (
    <button
      type="button"
      disabled={!clickable}
      onClick={handleClick}
      onMouseEnter={() => clickable && setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`
        flex flex-col items-center justify-start
        w-full h-full ${gap}
        transition-opacity duration-200
        ${clickable ? "cursor-pointer" : "cursor-default opacity-50"}
        ${isHovering && clickable ? "opacity-70" : "opacity-100"}
        focus:outline-none
      `}
    >
      {/* LINE */}
      <div className="w-[1px] h-[150px] sm:h-[250px] md:h-[300px] bg-black/30" />
      
      {/* TEXT */}
      <p className={`${roboto.className} text-xl sm:text-2xl md:text-3xl font-light -rotate-90 w-[70px] sm:w-[80px] md:w-[90px] tracking-[0.2em] text-black/60 whitespace-nowrap`}>
        {text}
      </p>
    </button>
  )
}