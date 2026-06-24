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
      
      <div className="aspect-square overflow-hidden">
        {topLeft}
      </div>

      <div className="aspect-square overflow-hidden">
        {topRight}
      </div>

      <div className="aspect-square overflow-hidden">
        {bottomLeft}
      </div>

      <div className="aspect-square overflow-hidden">
        {bottomRight}
      </div>

    </div>
  )
}