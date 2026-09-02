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
    <div className="grid grid-cols-2 h-full min-h-0 w-full gap-0.5">

      <div className="h-full min-h-0 overflow-hidden">
        {left}
      </div>

      <div className="
        grid 
        grid-rows-[0.9fr_1.1fr]
        md:grid-rows-2
        h-full 
        min-h-0 
        gap-0.5
      ">

        <div className="min-h-0 overflow-hidden">
          {topRight}
        </div>

        <div className="min-h-0 overflow-hidden">
          {bottomRight}
        </div>

      </div>

    </div>
  )
}