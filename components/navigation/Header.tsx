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
  onFiltersChange?: (tags: string[]) => void}
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
        transition-all duration-300
        ${isFilterOpen
          ? "h-[92px] sm:h-[160px]"
          : "h-[45px] sm:h-[60px]"
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
          left-5 sm:left-6
          text-[8px]
          tracking-[0.18em]
          text-black/15
          hover:text-black/50
          transition-colors duration-300
          cursor-pointer
        "
      >
        ← PORTFOLIO
      </button>
      {/* NAVIGATION — responsive padding and margin-top */}
      <div className="flex justify-between sm:px-6 pt-7">
        {items.map((item) => (
          <button
            key={item.section}
            onClick={() => handleItemClick(item)}
            disabled={!item.clickable}
            className={`
              ${typography.nav}
              relative group
              transition-colors duration-300

              ${
                item.active || (item.section === "FILTER" && isFilterOpen)
                  ? `${colors.text.charcoal} cursor-default`
                  : item.clickable
                  ? `${colors.text.charcoal} cursor-pointer opacity-90 hover:opacity-80`
                  : `${colors.text.charcoal} cursor-default opacity-50`
              }
            `}
          >
            {item.section}

            <span
              className={`
                absolute -bottom-1 left-0 h-px bg-black
                transition-all duration-300

                ${
                  item.active || (item.section === "FILTER" && isFilterOpen)
                    ? "w-full"
                    : item.clickable
                    ? "w-0 group-hover:w-full"
                    : "w-0"
                }
              `}
            />
          </button>
        ))}
      </div>
      <div
        className={`
          overflow-hidden
          transition-all duration-300
          ${isFilterOpen ? "max-h-[100px] opacity-100 mt-2" : "max-h-0 opacity-0"}
        `}
      >
        <div className="border-y border-black/10 py-1 px-2 sm:px-4 md:px-6 lg:px-10">
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