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
    <div className="grid grid-cols-2 h-full w-full gap-0.5">

      {/* LEFT */}
      <div className="h-full min-h-0 overflow-hidden">
        {left}
      </div>

      {/* RIGHT */}
      <div className="grid grid-rows-2 h-full min-h-0 gap-0.5 bg-purple-500">

        <div className="min-h-0 overflow-hidden aspect-square">
          {topRight}
        </div>

        <div className="min-h-0 overflow-hidden aspect-square">
          {bottomRight}
        </div>

      </div>

    </div>
  )
}