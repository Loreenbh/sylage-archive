"use client"

import { useState } from "react"
import {
  STYLE_TAGS,
  AMBIANCE_TAGS,
  COLOR_TAGS,
  COLOR_SWATCHES,
  MAX_STYLE_TAGS,
  MAX_AMBIANCE_TAGS,
  MAX_COLOR_TAGS,
} from "@/constants/tags"

type Category = "style" | "ambiance" | "couleurs"

type Props = {
  styleTags: string[]
  ambianceTags: string[]
  colorTags: string[]
  onChangeStyle: (tags: string[]) => void
  onChangeAmbiance: (tags: string[]) => void
  onChangeColor: (tags: string[]) => void
  layout?: "wrap" | "scroll"
}

function toggleIn(current: string[], max: number, tag: string): string[] {
  if (current.includes(tag)) return current.filter((t) => t !== tag)
  if (current.length >= max) return current
  return [...current, tag]
}

export default function TagPicker({
  styleTags,
  ambianceTags,
  colorTags,
  onChangeStyle,
  onChangeAmbiance,
  onChangeColor,
  layout = "wrap",
}: Props) {
  const [openCategory, setOpenCategory] = useState<Category | null>(null)

  const categories = [
    {
      key: "style" as const,
      label: "STYLE",
      tags: STYLE_TAGS,
      selected: styleTags,
      max: MAX_STYLE_TAGS,
      onToggle: (tag: string) => onChangeStyle(toggleIn(styleTags, MAX_STYLE_TAGS, tag)),
    },
    {
      key: "ambiance" as const,
      label: "AMBIANCE",
      tags: AMBIANCE_TAGS,
      selected: ambianceTags,
      max: MAX_AMBIANCE_TAGS,
      onToggle: (tag: string) => onChangeAmbiance(toggleIn(ambianceTags, MAX_AMBIANCE_TAGS, tag)),
    },
    {
      key: "couleurs" as const,
      label: "COULEURS",
      tags: COLOR_TAGS,
      selected: colorTags,
      max: MAX_COLOR_TAGS,
      onToggle: (tag: string) => onChangeColor(toggleIn(colorTags, MAX_COLOR_TAGS, tag)),
    },
  ]

  const allSelected = [...styleTags, ...ambianceTags, ...colorTags]

  const removeTag = (tag: string) => {
    if (styleTags.includes(tag)) onChangeStyle(styleTags.filter((t) => t !== tag))
    else if (ambianceTags.includes(tag)) onChangeAmbiance(ambianceTags.filter((t) => t !== tag))
    else if (colorTags.includes(tag)) onChangeColor(colorTags.filter((t) => t !== tag))
  }

  return (
    <div className="flex flex-col items-center gap-2">

      <div className="flex gap-4">
        {categories.map((category) => (
          <button
            key={category.key}
            type="button"
            onClick={() =>
              setOpenCategory((prev) => (prev === category.key ? null : category.key))
            }
            className={`
              text-[9px] tracking-[0.2em] uppercase pb-1 border-b transition
              ${openCategory === category.key
                ? "border-black text-black"
                : "border-transparent text-black/40 hover:text-black/70"}
            `}
          >
            {category.label} ({category.selected.length}/{category.max})
          </button>
        ))}
      </div>

      {/* liste dépliée de la catégorie active */}
      {categories.map((category) =>
        openCategory === category.key ? (
          <div
            key={category.key}
            className={
              layout === "scroll"
                ? `
                  flex
                  flex-nowrap
                  gap-2
                  overflow-x-auto
                  w-full
                  pb-1
                  scrollbar-none
                `
                : `
                  flex
                  flex-wrap
                  justify-center
                  gap-2
                  max-w-md
                `
            }
          >
            {category.tags.map((tag) => {
              const isSelected = category.selected.includes(tag)
              const isDisabled = !isSelected && category.selected.length >= category.max
              const swatch = category.key === "couleurs" ? COLOR_SWATCHES[tag] : undefined

              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => category.onToggle(tag)}
                  disabled={isDisabled}
                  className={`
                    flex items-center gap-1.5 whitespace-nowrap
                    text-[9px] tracking-[0.15em] uppercase px-2 py-1 border transition

                    ${isSelected
                      ? "bg-black text-white border-black"
                      : isDisabled
                      ? "border-black/10 text-black/20 cursor-not-allowed"
                      : "border-black/20 text-black/40 hover:text-black/70"}
                  `}
                >
                  {tag}
                    {isSelected && (
                      <span className=" text-[12px] text-white/70">
                        ×
                      </span>
                    )}
                  {swatch && (
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                      style={{ background: swatch }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        ) : null
      )}
    </div>
  )
}