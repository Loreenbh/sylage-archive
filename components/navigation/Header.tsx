"use client"

import { useState } from "react"
import { typography } from "@/styles/typography"
import { colors } from "@/styles/colors"
import TagPicker from "@/components/filters/TagPicker"

/* TYPES */
type HeaderItem = {
  section: string
  clickable?: boolean
  active?: boolean
  onClick?: () => void
}

type HeaderProps = {
  items: HeaderItem[]
  onFiltersChange?: (tags: string[]) => void
}
/*-------------------------------------------------*/

export default function Header({
  items,
  onFiltersChange,
}: HeaderProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const [styleTags, setStyleTags] = useState<string[]>([])
  const [ambianceTags, setAmbianceTags] = useState<string[]>([])
  const [colorTags, setColorTags] = useState<string[]>([])

  const handleItemClick = (item: HeaderItem) => {
    if (!item.clickable) return

    if (item.section === "FILTER") {
      setIsFilterOpen((prev) => !prev)
    }

    item.onClick?.()
  }

  const updateStyle = (tags: string[]) => {
    setStyleTags(tags)
    onFiltersChange?.([...tags, ...ambianceTags, ...colorTags])
  }

  const updateAmbiance = (tags: string[]) => {
    setAmbianceTags(tags)
    onFiltersChange?.([...styleTags, ...tags, ...colorTags])
  }

  const updateColor = (tags: string[]) => {
    setColorTags(tags)
    onFiltersChange?.([...styleTags, ...ambianceTags, ...tags])
  }

  return (
    <div
      className={`
        w-full
        transition-all
        duration-300
        ${
          isFilterOpen
            ? "h-[74px] sm:h-[105px] md:h-[70px] lg:h-[75px]"
            : "h-[45px] sm:h-[60px] md:h-[60px] lg:h-[60px]"
        }
      `}
    >

      {/* PORTFOLIO */}
      <button
        onClick={() => {
          window.location.href = "TON_URL_PORTFOLIO"
        }}
        className="
          absolute
          top-2
          sm:top-4
          md:top-4
          lg:top-6
          left-5
          sm:left-6
          text-[10px]
          sm:text-[13px]
          md:text-[13px]
          lg:text-[18px]
          tracking-[0.18em]
          text-black/20
          hover:text-black/50
          transition-colors
          duration-300
          cursor-pointer
        "
      >
        ← PORTFOLIO
      </button>

      {/* NAVIGATION */}
      <div
        className="
          relative
          z-[60]
          flex
          justify-between
          px-4
          sm:px-6
          pt-10
          sm:pt-20
          md:pt-16
          lg:pt-26
        "
      >
        {items.map((item) => (
          <button
            key={item.section}
            onClick={() => handleItemClick(item)}
            disabled={!item.clickable}
            className={`
              ${typography.nav}
              pb-1
              border-b
              transition-colors
              duration-300

              ${
                item.active ||
                (item.section === "FILTER" && isFilterOpen)
                  ? `${colors.text.charcoal} border-black cursor-default`
                  : item.clickable
                  ? `${colors.text.charcoal} border-transparent cursor-pointer hover:border-black opacity-90`
                  : `${colors.text.charcoal} border-transparent cursor-default opacity-50`
              }
            `}
          >
            {item.section}
          </button>
        ))}
      </div>

      {/* FILTER PANEL */}
      <div
        className={`
          overflow-visible
          transition-all
          duration-300
          relative
          z-50
          ${
            isFilterOpen
              ? "max-h-[200px] opacity-100 mt-2"
              : "max-h-0 opacity-0"
          }
        `}
      >
        <div
          className="
            border-b
            border-black/10
            pt-2
            pb-2
            px-2
            sm:px-4
            md:px-6
            lg:px-10
          "
        >
          <TagPicker
            styleTags={styleTags}
            ambianceTags={ambianceTags}
            colorTags={colorTags}
            onChangeStyle={updateStyle}
            onChangeAmbiance={updateAmbiance}
            onChangeColor={updateColor}
            layout="scroll"
          />
        </div>
      </div>

    </div>
  )
}