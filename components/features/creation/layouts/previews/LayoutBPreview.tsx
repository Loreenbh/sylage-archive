export default function LayoutBPreview() {
  return (
    <div className="
      grid
      grid-cols-2
      gap-[2px]
      h-full
      w-full
    ">

      {/* LEFT BIG */}
      <div className="bg-zinc-200"/>


      {/* RIGHT COLUMN */}
      <div className="
        grid
        grid-rows-[1fr_2fr_1fr]
        gap-[2px]
      ">

        {/* TOP */}
        <div className="bg-zinc-300"/>


        {/* MIDDLE 4 */}
        <div className="
          grid
          grid-cols-2
          gap-[2px]
        ">

          <div className="grid grid-rows-2 gap-[2px]">
            <div className="bg-zinc-400"/>
            <div className="bg-zinc-400"/>
          </div>

          <div className="grid grid-rows-2 gap-[2px]">
            <div className="bg-zinc-400"/>
            <div className="bg-zinc-400"/>
          </div>

        </div>


        {/* BOTTOM */}
        <div className="bg-zinc-300"/>

      </div>

    </div>
  )
}