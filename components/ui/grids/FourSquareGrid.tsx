type Props = {
  topLeft: React.ReactNode
  topRight: React.ReactNode
  bottomLeft: React.ReactNode
  bottomRight: React.ReactNode
}

export default function FourSquaresGrid({
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
}: Props) {
  return (
    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1">
      
      <div className="aspect-square overflow-hidden border border-black/20">
        {topLeft}
      </div>

      <div className="aspect-square overflow-hidden border border-black/20">
        {topRight}
      </div>

      <div className="aspect-square overflow-hidden border border-black/20">
        {bottomLeft}
      </div>

      <div className="aspect-square overflow-hidden border border-black/20">
        {bottomRight}
      </div>

    </div>
  )
}