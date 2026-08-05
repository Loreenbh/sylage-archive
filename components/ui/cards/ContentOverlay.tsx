import LikeButton from "@/components/ui/buttons/LikeButton"
import { typography } from "@/styles/typography"

type Props = {
  username?: string
  isOwner: boolean
  showUsername?: boolean
  prefix?: "BY" | "FOR"
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
  prefix,
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
        px-1 py-1
        bg-[#1B1613]/80
        text-[#f8f3e8]
        backdrop-blur-sm
      "
    >
      <div className="flex flex-col">

        {showUsername && username && (
          <div className="text-[10px] tracking-[0.2em] drop-shadow">

            {prefix && (
              <span className="text-white/70">
                {prefix}{" "}
              </span>
            )}

            {isOwner ? (
              <span>
                {username}
              </span>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onOpenProfile?.()
                }}
                className="
                  cursor-pointer
                  hover:opacity-60
                  transition-opacity
                "
              >
                {username}
              </button>
            )}

          </div>
        )}

    </div>


      <div className="flex items-center gap-3">

        {like && (
          <LikeButton
            type={like.type}
            className={typography.buttonOverlay}
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
            className={typography.buttonOverlay}
          >
            looks • {silhouettesCount}
          </button>
        )}

        {!isOwner && onFollowToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onFollowToggle()
            }}
            className="
              text-[12px]
              tracking-[0.2em]
              drop-shadow
              hover:opacity-60
              transition-opacity
            "
          >
            {isFollowed ? "✓" : "+"}
          </button>
        )}

        {isOwner && onDelete && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="
                text-white
                text-[10px]
                hover:opacity-60
                transition-opacity
              "
            >
              x
            </button>
          </>
        )}

      </div>

    </div>
  )
}