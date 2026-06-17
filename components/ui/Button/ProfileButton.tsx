type Props = {
  onNavigate: (params: {
    to: string
    direction?: "next" | "prev"
  }) => void
}

export default function ProfileButton({ onNavigate }: Props) {
  return (
    <button
      onClick={() =>
        onNavigate({
          to: "profile",
          direction: "next",
        })
      }
      className="w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 transition"
    />
  )
}