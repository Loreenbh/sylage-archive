type Props = {
  left: React.ReactNode
  right: React.ReactNode
  footer?: React.ReactNode
}

export default function TwoColGrid({ left, right }: Props) {
  return (
    <div className="h-full w-full flex gap-1">

      <div className="flex-1 h-full overflow-hidden aspect-square">
        {left}
      </div>

      <div className="flex-1 h-full overflow-hidden aspect-square">
        {right}
      </div>

    </div>
  )
}