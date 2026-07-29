export default function LayoutCPreview() {
  return (
    <div className="
      grid
      grid-cols-2
      grid-rows-3
      gap-[2px]
      h-full
      w-full
    ">

      {/* LEFT COLUMN STACK */}
      <div className="bg-zinc-200" />
      <div className="bg-zinc-200" />
      <div className="bg-zinc-200" />


      {/* RIGHT COLUMN */}
      <div className="
        row-span-2
        bg-zinc-300
      " />


      {/* BOTTOM RIGHT SPLIT */}
      <div className="
        grid
        grid-cols-2
        gap-[2px]
      ">
        <div className="bg-zinc-400" />
        <div className="bg-zinc-400" />
      </div>

    </div>
  )
}