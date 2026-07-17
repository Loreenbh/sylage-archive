type Props = {
  count: number
}

export default function SilhouetteCount({ count = 0 }: Props) {
  return (
    <span className="text-xs">
      👗 {count}
    </span>
  )
}