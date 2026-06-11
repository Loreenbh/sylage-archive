type Props = {
  left: React.ReactNode
  topRight: React.ReactNode
  bottomRight: React.ReactNode
}

export default function CustomGrid({
  left,
  topRight,
  bottomRight,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-2 flex-1">

      {/* LEFT BIG */}
      <div className="h-full w-full">
        {left}
      </div>

      {/* RIGHT STACK */}
      <div className="grid grid-rows-2 gap-2">

        <div className="h-full w-full">
          {topRight}
        </div>

        <div className="h-full w-full">
          {bottomRight}
        </div>

      </div>

    </div>
  )
}