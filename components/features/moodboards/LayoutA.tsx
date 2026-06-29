"use client"

type Props = {
  images?: (string | null)[]
  onSelectSlot?: (index: number) => void
}

export default function LayoutA({ images = [], onSelectSlot }: Props) {
  return (
    <div className="grid grid-cols-3 grid-rows-3 h-full w-full gap-[2px]">

      {Array.from({ length: 9 }).map((_, index) => {
        const image = images[index] ?? null

        return (
          <button
            key={index}
            onClick={() => onSelectSlot?.(index)}
            className="relative bg-pink-300 hover:bg-zinc-300 transition overflow-hidden"
          >
            {image ? (
              <img
                src={image}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-black/30 text-xs">
                +
              </span>
            )}
          </button>
        )
      })}

    </div>
  )
}