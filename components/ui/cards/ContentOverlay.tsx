import LikeButton from "@/components/ui/buttons/LikeButton"
import { typography } from "@/styles/typography"

type Props = {
  username?: string
  isOwner: boolean
  showUsername?: boolean
  isFollowed?: boolean
  onFollowToggle?: () => void
  like?: {
    type: "moodboard" | "silhouette"
    id: number
    count: number
    liked: boolean
  }

  silhouettesCount?: number
  onDelete?: () => void
  onOpenLooks?: () => void
  onOpenProfile?: () => void
}

export default function ContentOverlay({
  username,
  isOwner,
  showUsername = true,
  isFollowed,
  onFollowToggle,
  like,
  silhouettesCount,
  onDelete,
  onOpenLooks,
  onOpenProfile
}: Props) {

    return (
    <div
      className="
        absolute bottom-0 left-0 right-0
        flex items-center justify-between
        px-2 py-1
        bg-pink-600
        text-white
      "
    >
      <div>
        {!isOwner && showUsername && username && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOpenProfile?.()
            }}
            className="
              text-[10px]
              tracking-[0.2em]
              drop-shadow
              cursor-pointer
              text-white/70
              hover:text-white
              hover:drop-shadow-md
              transition-all
            "
          >
            {username}
          </button>
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
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOpenLooks?.()
            }}
            className="text-[10px] tracking-[0.2em] drop-shadow"
          >
            looks · {silhouettesCount}
          </button>
        )}

        {!isOwner && onFollowToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onFollowToggle()
            }}
            className="text-[12px] tracking-[0.2em] drop-shadow"
          >
            {isFollowed ? "✓" : "+"}
          </button>
        )}

        {isOwner && onDelete && (
          <>
            <span className={typography.bullet}>|</span>

            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className={typography.buttonBody}
            >
              x
            </button>
          </>
        )}

      </div>

    </div>
  )
}