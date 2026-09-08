import LikeButton from "@/components/ui/buttons/LikeButton"
import { typography } from "@/styles/typography"
import { colors } from "@/styles/colors"

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
  onOpenProfile,
}: Props) {
  return (
    <div
      className={`
        absolute bottom-0 left-0 right-0
        flex items-center justify-between
        px-2 py-1
        ${colors.bg.charcoal70}
        ${colors.text.ivory}
        backdrop-blur-sm
      `}
    >
      <div className="flex flex-col">
        {showUsername && username && (
          <div
            className="
              text-[10px]
              tracking-[0.2em]
              drop-shadow
              md:text-[10px]
              lg:text-[12px]
            "
          >
            {prefix && (
              <span className="text-white/70">
                {prefix}{" "}
              </span>
            )}

            {isOwner ? (
              <span>{username}</span>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onOpenProfile?.()
                }}
                className="
                  cursor-pointer
                  text-white
                  hover:text-white/50
                  transition-colors
                  duration-300
                "
              >
                {username}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 md:gap-4 lg:gap-6">
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
            className={`
              ${typography.buttonOverlay}
              text-white
              hover:text-white/50
              transition-colors
              duration-300
            `}
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
              md:text-[12px]
              lg:text-[15px]
              tracking-[0.2em]
              drop-shadow
              hover:text-white/50
              transition-colors
              duration-300
            "
          >
            {isFollowed ? "✓" : "+"}
          </button>
        )}

        {isOwner && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="
              text-white
              md:text-[10px]
              text-[10px]
              hover:text-white/50
              transition-colors
              duration-300
            "
          >
            x
          </button>
        )}
      </div>
    </div>
  )
}

