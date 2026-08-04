"use client"
import { useState } from "react"
import type { OnNavigate } from "@/types/navigation"
import { typography } from "@/styles/typography"
import { layout } from "@/styles/layout"
import { spacing } from "@/styles/spacing"

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
        ${layout.sidebarButton}
        ${clickable ? "cursor-pointer" : "cursor-default opacity-50"}
        ${isHovering && clickable ? "opacity-70" : "opacity-100"}
      `}
    >
      <div className={layout.sideBarLine} />
      <p
        className={`
          ${typography.sidebarTitle}
          ${layout.verticalText}
          ${spacing.sideBarTitle}
        `}
      >
        {text}
      </p>
    </button>
  )
}