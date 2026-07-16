type Props = {
  count: number
}

export default function SilhouetteCount({ count }: Props) {
  return (
    <span className="text-xs">
      👗 {count}
    </span>
  )
}