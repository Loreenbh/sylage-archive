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
        flex flex-col items-center h-full justify-center
        w-full
        ${clickable ? "cursor-pointer" : ""}
      `}
    >
      <div className="w-[1px] h-[200px] sm:h-[250px] md:h-[300px] bg-black/30" />

      <p className="text-2xl sm:text-3xl md:text-4xl font-light -rotate-90 w-[70px] sm:w-[80px] md:w-[90px] tracking-[0.2em] text-black/60 whitespace-nowrap">
        {text}
      </p>
    </div>
  )
}