import { typography } from "@/styles/typography"
import { spacing

 } from "@/styles/spacing"
type Props = {
  onPrev?: () => void
  onNext?: () => void
}

export default function GridPager({ onPrev, onNext }: Props) {
  return (
    <div className="flex w-full items-center justify-between">
      <button onClick={onPrev}>
        <div className={`${typography.buttonBody} ${spacing.body}`}>
          Back
        </div>
      </button>

      <button onClick={onNext}>
        <div className={`${typography.buttonBody} ${spacing.body}`}>
          next
        </div>
      </button>
    </div>
  )
}