import { typography

 } from "@/styles/typography"
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
      className={typography.backButton}
      
    >
      back
    </button>
  )
}