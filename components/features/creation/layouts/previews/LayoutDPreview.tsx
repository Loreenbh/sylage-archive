import { colors } from "@/styles/colors";

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
      <div className={`${colors.bg.empty70}`} />
      <div className={`${colors.bg.empty70}`} />
      <div className={`${colors.bg.empty70}`} />

      <div
        className={`
          col-start-2
          row-start-1
          row-span-3
          ${colors.bg.empty70}
        `}
      />

      <div
        className="
          col-span-2
          row-start-4
          grid
          grid-cols-3
          gap-[2px]
        "
      >
        <div className={`${colors.bg.empty70}`} />
        <div className={`${colors.bg.empty70}`} />
        <div className={`${colors.bg.empty70}`} />
      </div>
    </div>
  );
}
