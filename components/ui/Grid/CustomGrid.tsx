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
    <div className="grid grid-cols-2 gap-0.5 flex-1 bg-red-300 h-full">

      {/* LEFT BIG */}
      <div className="h-full w-full">
        {left}
      </div>

      {/* RIGHT STACK */}
      <div className="grid grid-rows-2 gap-0.5">

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