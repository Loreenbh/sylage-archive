type Props = {
  left: React.ReactNode
  right: React.ReactNode
  footer?: React.ReactNode
}

export default function TwoColGrid({ left, right, footer }: Props) {
  return (
    <div className="flex flex-col flex-1 min-h-0 bg-blue-200">

      {/* GRID AREA */}
      <div className="flex flex-1 min-h-[280px] gap-0.5 bg-green-300 ">

        <div className="flex-1 min-h-0 overflow-hidden">
          {left}
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          {right}
        </div>

      </div>

      {/* FOOTER */}
      {footer && (
        <div className="shrink-0 px-4">
          {footer}
        </div>
      )}

    </div>
  )
}