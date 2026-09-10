import { colors } from "@/styles/colors"

export default function LayoutAPreview() {
  return (
    <div className="
      grid 
      grid-cols-3 
      grid-rows-3 
      h-full 
      w-full 
      gap-[2px]
    ">
      {Array.from({ length: 9 }).map((_, index) => (
        <div
          key={index}
          className={`${colors.bg.empty70}`}
        />
      ))}
    </div>
  )
}