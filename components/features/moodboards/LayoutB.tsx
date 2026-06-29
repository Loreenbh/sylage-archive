"use client"

type Props = {
  images?: (string | null)[]
  onSelectSlot?: (index: number) => void
}

export default function LayoutB({ images = [], onSelectSlot }: Props) {
  return (
    <div className="grid grid-cols-2 gap-[2px] h-full w-full">

      {/* ================= LEFT COLUMN ================= */}
      <button
        onClick={() => onSelectSlot?.(0)}
        className="relative h-full w-full bg-zinc-200 hover:bg-zinc-300 transition overflow-hidden"
      >
        {images[0] ? (
          <img src={images[0]} className="w-full h-full object-cover" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-black/30 text-xs">
            +
          </span>
        )}
      </button>

      {/* ================= RIGHT COLUMN ================= */}
      <div className="grid grid-rows-[1fr_2fr_1fr] gap-[2px] h-full">

        {/* -------- C -------- */}
        <button
          onClick={() => onSelectSlot?.(1)}
          className="relative bg-zinc-300 hover:bg-zinc-400 transition overflow-hidden"
        >
          {images[1] ? (
            <img src={images[1]} className="w-full h-full object-cover" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-black/30 text-xs">
              +
            </span>
          )}
        </button>

        {/* -------- D (4 small squares) -------- */}
        <div className="grid grid-cols-2 gap-[2px]">

          {/* D1 column */}
          <div className="grid grid-rows-2 gap-[2px]">

            <button
              onClick={() => onSelectSlot?.(2)}
              className="relative bg-zinc-400 hover:bg-zinc-500 transition overflow-hidden aspect-square"
            >
              {images[2] ? (
                <img src={images[2]} className="w-full h-full object-cover" />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-black/30 text-xs">
                  +
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectSlot?.(3)}
              className="relative bg-zinc-400 hover:bg-zinc-500 transition overflow-hidden aspect-square"
            >
              {images[3] ? (
                <img src={images[3]} className="w-full h-full object-cover" />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-black/30 text-xs">
                  +
                </span>
              )}
            </button>

          </div>

          {/* D2 column */}
          <div className="grid grid-rows-2 gap-[2px]">

            <button
              onClick={() => onSelectSlot?.(4)}
              className="relative bg-zinc-400 hover:bg-zinc-500 transition overflow-hidden aspect-square"
            >
              {images[4] ? (
                <img src={images[4]} className="w-full h-full object-cover" />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-black/30 text-xs">
                  +
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectSlot?.(5)}
              className="relative bg-zinc-400 hover:bg-zinc-500 transition overflow-hidden aspect-square"
            >
              {images[5] ? (
                <img src={images[5]} className="w-full h-full object-cover" />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-black/30 text-xs">
                  +
                </span>
              )}
            </button>

          </div>

        </div>

        {/* -------- E -------- */}
        <button
          onClick={() => onSelectSlot?.(6)}
          className="relative bg-zinc-300 hover:bg-zinc-400 transition overflow-hidden"
        >
          {images[6] ? (
            <img src={images[6]} className="w-full h-full object-cover" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-black/30 text-xs">
              +
            </span>
          )}
        </button>

      </div>
    </div>
  )
}