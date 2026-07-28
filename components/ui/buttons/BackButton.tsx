import { OnNavigate, } from "@/types/navigation"
import { PageName } from "@/types/pages"

type Props = {
  onNavigate?: OnNavigate
  backTo?: PageName
  params?: Record<string, any>
}

export default function BackButton({
  onNavigate,
  backTo,
  params
}: Props) {
    if (!backTo) return null
  return (
    <button
      onClick={() =>
        onNavigate?.({
          to: backTo,
          direction: "prev",
          params
        })
      }
      className="
        text-sm
        tracking-[0.2em]
        transition-opacity
        hover:opacity-50
      "
    >
      back
    </button>
  )
}