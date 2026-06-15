type Props = {
  left: React.ReactNode
  right: React.ReactNode
  footer?: React.ReactNode
}

export default function TwoColGrid({ left, right, footer }: Props) {
  return (
    <div className="flex flex-col flex-1 min-h-0 h-[350px] sm:h-[600px]">

      <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
        <div className="min-h-0">
          {left}
        </div>

        <div className="min-h-0">
          {right}
        </div>
      </div>

      {footer && (
        <div className="pt-4 px-6">
          {footer}
        </div>
      )}

    </div>
  )
}