"use client"

import { typography } from "@/styles/typography"

type HeaderItem = {
  label: string
  clickable?: boolean
  active?: boolean
  onClick?: () => void
}

type HeaderProps = {
  items: HeaderItem[]
  showFilters?: boolean
}

const FILTERS = [
  "FASHION",
  "BEAUTY",
  "ART",
  "MUSIC",
  "DESIGN",
  "EDITORIAL",
  "FUTURISM",
  "ARCHIVE",
]

export default function Header({
  items,
  showFilters = false,
}: HeaderProps) {
  return (
    <div className="w-full">

      {/* NAVIGATION */}
      <div className="flex justify-between mt-10 px-10">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={item.clickable ? item.onClick : undefined}
            disabled={!item.clickable}
            className={`
              ${typography.subtitle}
              relative group
              transition-colors duration-300

              ${
                item.active
                  ? "text-black cursor-default"
                  : item.clickable
                  ? "text-black/40 hover:text-black/80 cursor-pointer"
                  : "text-black/20 cursor-default"
              }
            `}
          >
            {item.label}

            <span
              className={`
                absolute -bottom-1 left-0 h-px bg-black
                transition-all duration-300

                ${
                  item.active
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

      {/* FILTER BAR */}
      <div
        className={`
          overflow-hidden
          transition-all duration-500
          ${showFilters ? "max-h-20 opacity-100 mt-6" : "max-h-0 opacity-0"}
        `}
      >
        <div className="border-y border-black/10 py-3">

          <div
            className="
              flex
              gap-5
              overflow-x-auto
              whitespace-nowrap
              px-10
              scrollbar-none
            "
          >
            {FILTERS.map((filter) => (
              <button
                key={filter}
                className="
                  text-[10px]
                  tracking-[0.35em]
                  uppercase
                  text-black/30
                  hover:text-black/70
                  transition-colors
                  duration-300
                  shrink-0
                "
              >
                {filter}
              </button>
            ))}
          </div>

        </div>
      </div>

    </div>
  )
}