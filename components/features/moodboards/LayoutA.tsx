"use client"

import ImageSlot from "./ImageSlot"
import type { MoodboardSlot, MoodboardSlotPatch } from "@/types/moodboard"

type Props = {
  images?: MoodboardSlot[]
  onSelectSlot?: (index: number) => void
  onUpdateSlot?: (index: number, patch: MoodboardSlotPatch) => void
}

export default function LayoutA({ images = [], onSelectSlot, onUpdateSlot }: Props) {
  return (
    <div className="grid grid-cols-3 grid-rows-3 h-full w-full gap-[2px] min-h-0 min-w-0">

      {Array.from({ length: 9 }).map((_, index) => (
        <ImageSlot
          key={index}
          slot={images[index] ?? null}
          onSelect={() => onSelectSlot?.(index)}
          onChangeTransform={(patch) => onUpdateSlot?.(index, patch)}
          className="bg-pink-300 hover:bg-zinc-300"
        />
      ))}

    </div>
  )
}