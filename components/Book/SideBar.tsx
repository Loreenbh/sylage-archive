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
      className={`flex flex-col items-center h-full gap-45 w-[60px] bg-red-200 ${
        clickable ? "cursor-pointer" : ""
      }`}
    >
      <div className="w-[1px] h-[400px] bg-black/30" />

      <p className="text-4xl font-light -rotate-90 w-[90px] tracking-[0.2em] text-black/60">
        {text}
      </p>
    </div>
  )
}