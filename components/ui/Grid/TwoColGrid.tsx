type Props = {
  left: React.ReactNode
  right: React.ReactNode
  footer?: React.ReactNode
}

export default function TwoColGrid({ left, right, footer }: Props) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      
      {/* GRID — responsive height with proper gap */}
      <div className="grid grid-cols-2 gap-0.5 sm:gap-3 md:gap-4 min-h-[260px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[700px]
        pt-10">
        <div className="min-h-0 overflow-hidden">
          {left}
        </div>
        <div className="min-h-0 overflow-hidden">
          {right}
        </div>
      </div>

      {/* FOOTER */}
      {footer && (
        <div className=" bg-green-100 pt-3 sm:pt-4 md:pt-5 px-2 sm:px-4 md:px-6">
          {footer}
        </div>
      )}

    </div>
  )
}