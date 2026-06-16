import { roboto } from "@/styles/fonts"

type Props = {
  text: string
  onNavigate?: (params: { to: string; direction?: string }) => void
  clickable?: boolean
}

export default function Sidebar({
  text,
  onNavigate,
  clickable = true,
}: Props) {
  return (
    <div
      onClick={
        clickable
          ? () => onNavigate?.({ to: "auth", direction: "next" })
          : undefined
      }
      className={`
        flex flex-col items-center justify-center
        w-full gap-8 sm:gap-15 md:gap-26 lg:gap-8
        ${clickable ? "cursor-pointer" : ""}
      `}
    >
      <div className="w-[1px] h-[150px] sm:h-[300px] md:h-[350px] mt-7 sm:mt-12 md:mt-20 lg:mt-20 bg-black/30" />

      <p className={`${roboto} text-xl sm:text-3xl md:text-4xl font-light -rotate-90 w-[70px] sm:w-[80px] md:w-[30px] tracking-[0.2em] text-black/60 whitespace-nowrap`}>
        {text}
      </p>
    </div>
  )
}