type Props = {
  square: React.ReactNode
}

export default function SimpleGrid({ square }: Props) {
  return (
    <div className="w-full flex">
      <div className="aspect-square w-full overflow-hidden">
        {square}
      </div>
    </div>
  )
}