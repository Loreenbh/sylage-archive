type Props = {
  left: React.ReactNode
  center: React.ReactNode
  right: React.ReactNode
}

function Cell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 h-full overflow-hidden aspect-square relative">
      {children}

      <div className="absolute top-2 right-2 text-white/80 text-[40px]">
        ♡
      </div>
    </div>
  )
}

export default function ThreeColGrid({
  left,
  center,
  right,
}: Props) {
  return (
    <div className="h-full w-full flex gap-1">
      <Cell>{left}</Cell>
      <Cell>{center}</Cell>
      <Cell>{right}</Cell>
    </div>
  )
}