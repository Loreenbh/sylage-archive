"use client"

import ImageSlot from "./ImageSlot"
import type { MoodboardSlot, MoodboardSlotPatch } from "@/types/editor"
import { colors } from "@/styles/colors"

type Props = {
  images?: MoodboardSlot[]
  onSelectSlot?: (index: number) => void
  onUpdateSlot?: (index: number, patch: MoodboardSlotPatch) => void
}

export default function LayoutB({ images = [], onSelectSlot, onUpdateSlot }: Props) {
  const select = (index: number) => onSelectSlot?.(index)
  const update = (index: number) => (patch: MoodboardSlotPatch) => onUpdateSlot?.(index, patch)

  return (
    <div className="grid grid-cols-2 gap-[2px] h-full w-full min-h-0 min-w-0">

      {/* ================= LEFT COLUMN ================= */}
      <ImageSlot
        slot={images[0] ?? null}
        onSelect={() => select(0)}
        onChangeTransform={update(0)}
        className={`h-full w-full ${colors.bg.empty70} hover:opacity-50`}
      />

      {/* ================= RIGHT COLUMN ================= */}
      <div className="grid grid-rows-[1fr_2fr_1fr] gap-[2px] h-full min-h-0 min-w-0">

        {/* -------- C -------- */}
        <ImageSlot
          slot={images[1] ?? null}
          onSelect={() => select(1)}
          onChangeTransform={update(1)}
          className={`${colors.bg.empty70} hover:opacity-50`}
        />

        {/* -------- D (4 small squares) -------- */}
        <div className="grid grid-cols-2 gap-[2px] min-h-0 min-w-0">

          {/* D1 column */}
          <div className="grid grid-rows-2 gap-[2px] min-h-0 min-w-0">
            <ImageSlot
              slot={images[2] ?? null}
              onSelect={() => select(2)}
              onChangeTransform={update(2)}
              className={`${colors.bg.empty70} hover:opacity-50`}
            />
            <ImageSlot
              slot={images[3] ?? null}
              onSelect={() => select(3)}
              onChangeTransform={update(3)}
              className={`${colors.bg.empty70} hover:opacity-50`}
            />
          </div>

          {/* D2 column */}
          <div className="grid grid-rows-2 gap-[2px] min-h-0 min-w-0">
            <ImageSlot
              slot={images[4] ?? null}
              onSelect={() => select(4)}
              onChangeTransform={update(4)}
              className={`${colors.bg.empty70} hover:opacity-50`}
            />
            <ImageSlot
              slot={images[5] ?? null}
              onSelect={() => select(5)}
              onChangeTransform={update(5)}
              className={`${colors.bg.empty70} hover:opacity-50`}
            />
          </div>

        </div>

        {/* -------- E -------- */}
        <ImageSlot
          slot={images[6] ?? null}
          onSelect={() => select(6)}
          onChangeTransform={update(6)}
          className={`${colors.bg.empty70} hover:opacity-50`}
        />

      </div>
    </div>
  )
}