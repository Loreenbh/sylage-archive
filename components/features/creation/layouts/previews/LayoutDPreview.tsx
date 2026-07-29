export default function LayoutDPreview() {
  return (
    <div
      className="
        grid
        grid-cols-[1fr_3fr]
        grid-rows-4
        gap-[2px]
        h-full
        w-full
      "
    >

      {/* LEFT COLUMN */}
      <div className="bg-zinc-200" />

      <div className="bg-zinc-200" />

      <div className="bg-zinc-200" />


      {/* HERO */}
      <div
        className="
          col-start-2
          row-start-1
          row-span-3
          bg-zinc-300
        "
      />


      {/* BOTTOM STRIP */}
      <div
        className="
          col-span-2
          row-start-4
          grid
          grid-cols-3
          gap-[2px]
        "
      >
        <div className="bg-zinc-400" />
        <div className="bg-zinc-400" />
        <div className="bg-zinc-400" />
      </div>

    </div>
  )
}