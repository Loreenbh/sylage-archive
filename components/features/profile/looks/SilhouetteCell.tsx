import ContentOverlay from "@/components/ui/cards/ContentOverlay"
import type { Silhouette } from "@/types/silhouette"
import type { OnNavigate } from "@/types/navigation"
import { colors } from "@/styles/colors"

type Props = {
  silhouette?: Silhouette
  currentUser?: number
  currentUserRole?: "user" | "admin"
  moodboardId?: number
  from?: string
  onNavigate?: OnNavigate
  onDelete?: (id:number) => void
}

export default function SilhouetteCell({
  silhouette,
  currentUser,
  currentUserRole,
  moodboardId,
  from,
  onNavigate,
  onDelete,
}: Props) {

  if (!silhouette) {
    return (
      <div className={`
          relative 
          h-full 
          w-full 
          ${colors.bg.empty} 
          border 
          border-black/10
          `}
          />
      )
  }


  const isMoodboardContext =
    moodboardId || from === "references"


  const username = isMoodboardContext
    ? silhouette.username
    : silhouette.target_username


  const prefix = isMoodboardContext
    ? "BY"
    : "FOR"


  const isOwner = isMoodboardContext
    ? silhouette.user_id === currentUser
    : silhouette.target_user_id === currentUser


  const profileId = isMoodboardContext
    ? silhouette.user_id
    : silhouette.target_user_id


  return (
    <div className="relative h-full w-full bg-zinc-100 overflow-hidden border border-black/10">

      <img
        src={silhouette.image_url}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {currentUserRole === "admin" && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete?.(silhouette.id)
          }}
          className="
            absolute
            top-2
            right-2
            z-20
            text-black
            text-xl
            leading-none
            drop-shadow
            hover:text-white/50
            transition-colors
            duration-300
          "
        >
          ×
        </button>
      )}

      <ContentOverlay
        username={
          moodboardId || from === "references"
            ? silhouette.username
            : silhouette.target_username
        }

        prefix={
          moodboardId || from === "references"
            ? "BY"
            : "FOR"
        }

        isOwner={
          silhouette.user_id === currentUser
        }

        onOpenProfile={() =>
          onNavigate?.({
            to: "profile",
            direction: "next",
            params: {
              userId: profileId,
              isOwner: profileId === currentUser,
              from: "looks",
            },
          })
        }

        onDelete={
          silhouette.user_id === currentUser
            ? () => onDelete?.(silhouette.id)
            : undefined
        }

        like={{
          type: "silhouette",
          id: silhouette.id,
          count: silhouette.likes_count,
          liked: silhouette.liked_by_current_user
        }}
      />
    </div>
  )
}