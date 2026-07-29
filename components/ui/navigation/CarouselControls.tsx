import { typography } from "@/styles/typography"
import { spacing } from "@/styles/spacing"
type Props = {
  onPrev?: () => void
  onNext?: () => void
  canPrev?: boolean
  canNext?: boolean

}

export default function CarouselControls({ onPrev, onNext, canPrev, canNext }: Props) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onPrev}
        disabled={!canPrev}
        className={`
          transition-opacity
          ${canPrev ? "hover:opacity-50 cursor-pointer" : "opacity-30 cursor-default"}
        `}
      >
        <span className={`${typography.buttonBody} ${spacing.body}`}>
          prev
        </span>
      </button>

      <span className={typography.bullet}>•</span>

      <button
        onClick={onNext}
        disabled={!canNext}
        className={`
          transition-opacity
          ${canNext ? "hover:opacity-50 cursor-pointer" : "opacity-30 cursor-default"}
        `}
      >
        <span className={`${typography.buttonBody} ${spacing.body}`}>
          next
        </span>
      </button>
    </div>
  )
}