type Props = {
  left: React.ReactNode
  right: React.ReactNode
  footer?: React.ReactNode
}

export default function TwoColGrid({ left, right, footer }: Props) {
  return (
    <div className="flex flex-col">
      
      {/* GRID */}
      <div className="grid grid-cols-2 gap-2 h-[400px] md:h-[530px] lg:h-[700px]">
        <div>{left}</div>
        <div>{right}</div>
      </div>

      {/* FOOTER */}
      {footer && (
        <div className="px-20 pt-5">
          {footer}
        </div>
      )}

    </div>
  )
}