type Props = {
  left: React.ReactNode
  right: React.ReactNode
  footer?: React.ReactNode
}

export default function TwoColGrid({ left, right, footer }: Props) {
  return (
    <div className="flex flex-col flex-1 min-h-0 h-full bg-blue-100">

      {/* GRID AREA */}
      <div className="flex flex-1 min-h-0 gap-0.5 sm:gap-4 md:gap-6">

        <div className="flex-1 min-h-0 overflow-hidden">
          {left}
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          {right}
        </div>

      </div>

      {/* FOOTER */}
      {footer && (
        <div className="shrink-0 pt-4 px-4">
          {footer}
        </div>
      )}

    </div>
  )
}