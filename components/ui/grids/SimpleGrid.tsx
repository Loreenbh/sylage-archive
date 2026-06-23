type Props = {
  square: React.ReactNode
}

export default function SimpleGrid({ square }: Props) {
  return (
    <div className="h-full w-full flex gap-1">

      <div className="flex-1 h-full overflow-hidden aspect-square">
        {square}
      </div>
    </div>
  )
}