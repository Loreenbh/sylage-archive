import { roboto } from "@/styles/fonts"

type Props = {
  text: string
  gap: string
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
    <button
      type="button"
      disabled={!clickable}
      onClick={() =>
        onNavigate?.({ to: "auth", direction: "next" })
      }
      className={`
        bg-red-500
        flex flex-col items-center justify-start
        w-full h-full ${gap} sm:gap-15 md:gap-26 lg:gap-8

        cursor-pointer transition-opacity hover:opacity-70

        disabled:cursor-default disabled:opacity-40 disabled:hover:opacity-40

        focus:outline-none
      `}
    >
      {/* LINE */}
      <div className="w-[1px] h-[200px] bg-black/30" />

      {/* TEXT */}
      <p className={`${roboto} text-xl sm:text-3xl md:text-4xl font-light -rotate-90 w-[70px] sm:w-[80px] md:w-[30px] tracking-[0.2em] text-black/60 whitespace-nowrap`}>
        {text}
      </p>
    </button>
  )
}