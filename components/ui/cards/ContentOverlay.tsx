import LikeButton from "@/components/ui/buttons/LikeButton";
import { typography } from "@/styles/typography";
import { colors } from "@/styles/colors";

type Props = {
  username?: string;
  isOwner: boolean;
  showUsername?: boolean;
  prefix?: "BY" | "FOR";
  isFollowed?: boolean;
  isGuest?: boolean;
  onRequireAuth?: () => void;
  onFollowToggle?: () => void;
  like?: {
    type: "moodboard" | "silhouette";
    id: number;
    count: number;
    liked: boolean;
  };

  silhouettesCount?: number;
  onDelete?: () => void;
  onOpenLooks?: () => void;
  onOpenProfile?: () => void;
};

export default function ContentOverlay({
  username,
  isOwner,
  prefix,
  showUsername = true,
  isFollowed,
  onFollowToggle,
  like,
  onRequireAuth,
  isGuest,
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
              text-[8px]
              sm:text-[12px]
              tracking-[0.2em]
              drop-shadow
              lg:text-[16px]
            "
          >
            {prefix && <span className="text-white/70">{prefix} </span>}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenProfile?.();
              }}
              className="
                cursor-pointer
                text-white
                text-[7px]
                sm:text-[12px]
                lg:text-[14px]
                hover:text-white/50
                transition-colors
                duration-300
              "
            >
              {username}
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 md:gap-4 lg:gap-6">
        {like && (
          <LikeButton
            type={like.type}
            className={typography.buttonOverlay}
            id={like.id}
            initialCount={like.count}
            initialLiked={like.liked}
            disabled={false}
            onRequireAuth={isGuest ? onRequireAuth : undefined}
          />
        )}

        {silhouettesCount !== undefined && (
          <button
            disabled={silhouettesCount === 0}
            onClick={(e) => {
              e.stopPropagation();

              if (silhouettesCount === 0) return;

              onOpenLooks?.();
            }}
            className={`
              ${typography.buttonOverlay}
              text-white
              transition-colors
              duration-300
              ${silhouettesCount === 0
                ? "cursor-default opacity-50"
                : "cursor-pointer hover:text-white/50"
              }
            `}
          >
            looks • {silhouettesCount}
          </button>
        )}

        {!isOwner && onFollowToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();

              if (isGuest) {
                onRequireAuth?.();
                return;
              }

              onFollowToggle?.();
            }}
            className="
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
              e.stopPropagation();
              onDelete();
            }}
            className="
              text-white
              sm:text-[10px]
              lg:text-[13px]
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
  );
}
