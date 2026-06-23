type Props = {
  left: React.ReactNode
  center: React.ReactNode
  right: React.ReactNode
}

export default function ThreeColGrid({
  left,
  center,
  right,
}: Props) {
  return (
    <div className="h-full w-full flex gap-1">

      <div className="flex-1 h-full overflow-hidden aspect-square">
        {left}
      </div>

      <div className="flex-1 h-full overflow-hidden aspect-square">
        {center}
      </div>

      <div className="flex-1 h-full overflow-hidden aspect-square">
        {right}
      </div>

    </div>
  )
}