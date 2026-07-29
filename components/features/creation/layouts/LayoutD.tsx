"use client"

import ImageSlot from "./ImageSlot"
import type { MoodboardSlot, MoodboardSlotPatch } from "@/types/editor"

type Props = {
  images?: MoodboardSlot[]
  onSelectSlot?: (index: number) => void
  onUpdateSlot?: (index: number, patch: MoodboardSlotPatch) => void

}

export default function LayoutD({ images = [], onSelectSlot, onUpdateSlot }: Props) {
  const select = (index: number) => onSelectSlot?.(index)
  const update = (index: number) => (patch: MoodboardSlotPatch) => onUpdateSlot?.(index, patch)

  return (
  <div
    className="
      grid
      grid-cols-[1fr_3fr]
      grid-rows-4
      gap-[2px]
      h-full
      w-full
      min-h-0
      min-w-0
    "
  >

    {/* LEFT TOP */}
    <ImageSlot
      slot={images[0] ?? null}
      onSelect={() => select(0)}
      onChangeTransform={update(0)}
      className="row-start-1 col-start-1 bg-zinc-200 hover:bg-zinc-300"
    />

    {/* LEFT MIDDLE */}
    <ImageSlot
      slot={images[1] ?? null}
      onSelect={() => select(1)}
      onChangeTransform={update(1)}
      className="row-start-2 col-start-1 bg-zinc-200 hover:bg-zinc-300"
    />

    {/* LEFT BOTTOM */}
    <ImageSlot
      slot={images[3] ?? null}
      onSelect={() => select(3)}
      onChangeTransform={update(3)}
      className="row-start-3 col-start-1 bg-zinc-200 hover:bg-zinc-300"
    />


    {/* HERO */}
    <ImageSlot
      slot={images[2] ?? null}
      onSelect={() => select(2)}
      onChangeTransform={update(2)}
      className="
        row-start-1
        row-span-3
        col-start-2
        bg-zinc-300
        hover:bg-zinc-400
      "
    />


    {/* BOTTOM STRIP */}
    <div
      className="
        row-start-4
        col-span-2
        grid
        grid-cols-3
        gap-[2px]
      "
    >
      {[4,5,6].map(index => (
        <ImageSlot
          key={index}
          slot={images[index] ?? null}
          onSelect={() => select(index)}
          onChangeTransform={update(index)}
          className="bg-zinc-400 hover:bg-zinc-500"
        />
      ))}
    </div>

  </div>
)
}