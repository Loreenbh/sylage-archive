"use client"

type Props = {
  images?: (string | null)[]
  onSelectSlot?: (index: number) => void
}

export default function LayoutD({ images = [], onSelectSlot }: Props) {
  return (
    <div className="grid grid-cols-2 grid-rows-3 gap-[2px] h-full w-full">

      {/* LEFT COLUMN STACK */}
      <button
        onClick={() => onSelectSlot?.(0)}
        className="relative bg-zinc-200 hover:bg-zinc-300 transition overflow-hidden"
      >
        {images[0] ? (
          <img src={images[0]} className="w-full h-full object-cover" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-black/30">
            +
          </span>
        )}
      </button>

      <button
        onClick={() => onSelectSlot?.(1)}
        className="relative bg-zinc-200 hover:bg-zinc-300 transition overflow-hidden"
      >
        {images[1] ? (
          <img src={images[1]} className="w-full h-full object-cover" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-black/30">
            +
          </span>
        )}
      </button>

      <button
        onClick={() => onSelectSlot?.(2)}
        className="relative bg-zinc-200 hover:bg-zinc-300 transition overflow-hidden"
      >
        {images[2] ? (
          <img src={images[2]} className="w-full h-full object-cover" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-black/30">
            +
          </span>
        )}
      </button>

      {/* RIGHT COLUMN */}
      <button
        onClick={() => onSelectSlot?.(3)}
        className="row-span-2 relative bg-zinc-300 hover:bg-zinc-400 transition overflow-hidden"
      >
        {images[3] ? (
          <img src={images[3]} className="w-full h-full object-cover" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-black/30">
            +
          </span>
        )}
      </button>

      {/* bottom right split */}
      <div className="grid grid-cols-2 gap-[2px]">

        <button
          onClick={() => onSelectSlot?.(4)}
          className="relative bg-zinc-400 hover:bg-zinc-500 transition overflow-hidden"
        >
          {images[4] ? (
            <img src={images[4]} className="w-full h-full object-cover" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-black/30">
              +
            </span>
          )}
        </button>

        <button
          onClick={() => onSelectSlot?.(5)}
          className="relative bg-zinc-400 hover:bg-zinc-500 transition overflow-hidden"
        >
          {images[5] ? (
            <img src={images[5]} className="w-full h-full object-cover" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-black/30">
              +
            </span>
          )}
        </button>

      </div>

    </div>
  )
}