import type { OnNavigate } from "@/types/navigation"

type Props = {
  onNavigate: OnNavigate
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