import { colors } from "@/styles/colors";

export default function LayoutBPreview() {
  return (
    <div
      className="
      grid
      grid-cols-2
      gap-[2px]
      h-full
      w-full
    "
    >
      <div className={`${colors.bg.empty70}`} />

      <div
        className="
          grid
          grid-rows-[1fr_2fr_1fr]
          gap-[2px]
        "
      >
        <div className={`${colors.bg.empty70}`} />

        <div
          className="
          grid
          grid-cols-2
          gap-[2px]
        "
        >
          <div className="grid grid-rows-2 gap-[2px]">
            <div className={`${colors.bg.empty70}`} />
            <div className={`${colors.bg.empty70}`} />
          </div>

          <div className="grid grid-rows-2 gap-[2px]">
            <div className={`${colors.bg.empty70}`} />
            <div className={`${colors.bg.empty70}`} />
          </div>
        </div>

        <div className={`${colors.bg.empty70}`} />
      </div>
    </div>
  );
}
