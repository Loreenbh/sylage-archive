// components/ui/StateMessage.tsx

type Props = {
  message: string
}

export default function StatusMessage({ message }: Props) {
  return (
    <div
      className="
        flex
        items-center
        justify-center
        h-full
        border
        border-black/10
      "
    >
      <p className="
        text-center
        text-black/30
        text-xs
        tracking-[0.2em]
      ">
        {message}
      </p>
    </div>
  )
}