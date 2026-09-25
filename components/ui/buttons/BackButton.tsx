import { typography } from "@/styles/typography";
import { spacing } from "@/styles/spacing";

type Props = {
  onBack?: () => void;
};

export default function BackButton({ onBack }: Props) {
  if (!onBack) return null;

  return (
    <button
      onClick={onBack}
      className={`${typography.backButton} ${spacing.backButton}`}
    >
      back
    </button>
  );
}
