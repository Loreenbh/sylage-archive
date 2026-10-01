import { typography } from "@/styles/typography";
import { spacing } from "@/styles/spacing";
type Props = {
  onPrev?: () => void;
  onNext?: () => void;
  canPrev?: boolean;
  canNext?: boolean;
};

export default function CarouselControls({
  onPrev,
  onNext,
  canPrev,
  canNext,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onPrev}
        disabled={!canPrev}
        className={`
          ${typography.buttonBodyFocus}
          transition-opacity
          ${canPrev ? "hover:opacity-50 cursor-pointer" : "opacity-30 cursor-default"}
        `}
      >
        prev
      </button>

      <span className={typography.bullet}>•</span>

      <button
        onClick={onNext}
        disabled={!canNext}
        className={`
          ${typography.buttonBodyFocus}
          transition-opacity
          ${canNext ? "hover:opacity-50 cursor-pointer" : "opacity-30 cursor-default"}
        `}
      >
        next
      </button>
    </div>
  );
}
