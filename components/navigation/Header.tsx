"use client"
import { useState } from "react"
import { typography } from "@/styles/typography"
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

    // le bouton "FILTER" pilote l'ouverture du panneau, en plus
    // de tout onClick custom passé par la page parente
    if (item.section === "FILTER") {
      setIsFilterOpen((prev) => !prev)
    }

    item.onClick?.()
  }

  // à chaque changement dans une catégorie, on recombine les 3 et on notifie le parent
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
    <div className="w-full h-[70px] sm:h-[130px] md:h-[120px] lg:h-[150px] bg-green-100">

      {/* NAVIGATION — responsive padding and margin-top */}
      <div className="flex justify-between px-4 sm:px-4 md:px-6 lg:px-10 pt-8 sm:pt-2">
        {items.map((item) => (
          <button
            key={item.section}
            onClick={() => handleItemClick(item)}
            disabled={!item.clickable}
            className={`
              ${typography.header}
              relative group
              transition-colors duration-300

              ${
                item.active || (item.section === "FILTER" && isFilterOpen)
                  ? "text-black cursor-default"
                  : item.clickable
                  ? "text-black/40 hover:text-black/80 cursor-pointer"
                  : "text-black/20 cursor-default"
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

      {/* FILTER BAR — responsive, même TagPicker que l'éditeur */}
      <div
        className={`
          overflow-hidden
          transition-all duration-500
          ${isFilterOpen ? "max-h-[100px] opacity-100 mt-3 sm:mt-4 md:mt-2" : "max-h-0 opacity-0"}
        `}
      >
        <div className="border-y border-black/10 py-3 px-2 sm:px-4 md:px-6 lg:px-10">
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