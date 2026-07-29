import { OnNavigate, } from "@/types/navigation"
import { PageName } from "@/types/pages"

type Props = {
  onBack?: () => void
}

export default function BackButton({
  onBack
}: Props) {
  if (!onBack) return null

  return (
    <button
      onClick={onBack}
      className="
        text-sm
        tracking-[0.2em]
        transition-opacity
        hover:opacity-50
        uppercase
        text-black/60
      "
    >
      back
    </button>
  )
}