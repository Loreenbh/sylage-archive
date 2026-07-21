import LikeButton from "@/components/ui/buttons/LikeButton"
import { typography } from "@/styles/typography"

type Props = {
  username?: string
  isOwner: boolean
  showUsername?: boolean
  like?: {
    type: "moodboard" | "silhouette"
    id: number
    count: number
    liked: boolean
  }

  silhouettesCount?: number
  onDelete?: () => void
}

export default function ContentOverlay({
  username,
  isOwner,
  showUsername = true,
  like,
  silhouettesCount,
  onDelete
}: Props) {

  return (
    <div
      className="
        absolute bottom-0 left-0 right-0
        flex items-center justify-between
        px-2 py-1
        bg-red-500
        text-white
      "
    >

      <div>
        {!isOwner && showUsername && username && (
          <p className="text-[9px] tracking-[0.2em] drop-shadow">
            {username}
          </p>
        )}
      </div>


      <div className="flex items-center gap-3">

        {like && (
          <LikeButton
            type={like.type}
            className={typography.buttonBody}
            id={like.id}
            initialCount={like.count}
            initialLiked={like.liked}
            disabled={false}
          />
        )}

        {silhouettesCount !== undefined && (
          <span className={typography.buttonBody}>
            👗 {silhouettesCount}
          </span>
        )}

        {isOwner && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className={typography.buttonBody}
          >
            x
          </button>
        )}

      </div>

    </div>
  )
}