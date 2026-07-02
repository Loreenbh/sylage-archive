type Props = {
  left: React.ReactNode
  center: React.ReactNode
  right: React.ReactNode
  showHeart?: boolean
}

function Cell({ children, showHeart }: { children: React.ReactNode, showHeart: boolean }) {
  return (
    <div className="flex-1 h-full overflow-hidden aspect-square relative">
      {children}

    {showHeart && (
      <div className="absolute top-2 right-2 text-white/80 text-[40px] pointer-events-none">
        ♡
      </div>
    )}
    </div>
  )
}

export default function ThreeColGrid({
  left,
  center,
  right,
  showHeart = true,
}: Props) {
  return (
    <div className="w-full h-full flex gap-1">
      <Cell showHeart={showHeart}>{left}</Cell>
      <Cell showHeart={showHeart}>{center}</Cell>
      <Cell showHeart={showHeart}>{right}</Cell>
    </div>
  )
}