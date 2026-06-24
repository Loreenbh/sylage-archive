"use client"
import { useState } from "react"
import { roboto } from "@/styles/fonts"
import type { OnNavigate } from "@/types/navigation"
import { typography } from "@/styles/typography"

/* TYPES */
type Props = {
  text: string
  onNavigate?: OnNavigate
  clickable?: boolean
}
/*-------------------------------------------- */

export default function Sidebar({
  text,
  onNavigate,
  clickable = true,
}: Props) {
  const [isHovering, setIsHovering] = useState(false)

  const handleClick = () => {
    if (clickable) {
      setIsHovering(false)
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
        flex flex-col items-center
        w-full h-full
        transition-opacity duration-200
        ${clickable ? "cursor-pointer" : "cursor-default opacity-50"}
        ${isHovering && clickable ? "opacity-70" : "opacity-100"}
      `}
    >
      {/*
        LIGNE VERTICALE
        ─────────────────────────────────────────────────────────
        • "flex-1" : occupe tout l'espace vertical disponible
          entre le haut du bouton et le texte en bas.
        • "w-px" : exactement 1px de large.
        • min-h-0 : évite que flex-1 ne coince sur un min-height implicite.
      */}
      <div className="flex-1 min-h-0 w-px lg:w-[1.5px] bg-black/30" />

      {/*
        TEXTE VERTICAL
        ─────────────────────────────────────────────────────────
        • mt-3 : espacement entre la ligne et le texte.
        • rotate-90 ou writing-mode selon la préférence.
          Ici on utilise [writing-mode:vertical-rl] pour un
          rendu natif sans transformer le layout.
        • text-start aligne le texte vers le haut du bloc rotaté.
      */}
      <p
        className={`
          ${roboto.className}
          ${typography.sidebarTitle}
          mt-5
          shrink-0
          [writing-mode:vertical-rl]
          rotate-180
          bg-red-500
        `}
      >
        {text}
      </p>

    </button>
  )
}