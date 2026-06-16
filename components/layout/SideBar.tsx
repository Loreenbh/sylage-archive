import { roboto } from "@/styles/fonts"

type Props = {
  text: string
  gap: string,
  onNavigate?: (params: { to: string; direction?: string }) => void
  clickable?: boolean
}

export default function Sidebar({
  text,
  gap,
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
        w-full ${gap} sm:gap-15 md:gap-26 lg:gap-8
        ${clickable ? "cursor-pointer" : ""}
      `}
    >
      <div className={`bg-pink-400 w-[1px] h-[150px] bg-black/30`} />

      <p className={`${roboto} text-xl sm:text-3xl md:text-4xl font-light -rotate-90 w-[70px] sm:w-[80px] md:w-[30px] tracking-[0.2em] text-black/60 whitespace-nowrap`}>
        {text}
      </p>
    </div>
  )
}