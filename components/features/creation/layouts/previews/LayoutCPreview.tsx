import { colors } from "@/styles/colors"

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
      <div className={`${colors.bg.empty70}`} />
      <div className={`${colors.bg.empty70}`} />
      <div className={`${colors.bg.empty70}`} />


      {/* RIGHT COLUMN */}
      <div className={`row-span-2 ${colors.bg.empty70}`} />


      {/* BOTTOM RIGHT SPLIT */}
      <div className="
        grid
        grid-cols-2
        gap-[2px]
      ">
        <div className={`${colors.bg.empty70}`}/>
        <div className={`${colors.bg.empty70}`}/>
      </div>

    </div>
  )
}