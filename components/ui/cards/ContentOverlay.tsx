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
        absolute
        inset-x-0
        bottom-0
        sm:h-5
        md:h-8
        lg:h-8
        px-2
        sm:px-3
        md:px-4
        lg:px-5
        flex
        items-center
        justify-between
        ${colors.bg.charcoal70}
        ${colors.text.ivory}
        backdrop-blur-sm
      `}
    >
      {/* LEFT */}
      {showUsername && username ? (
        <div className="flex items-center leading-none">
          {prefix && (
            <span className="sm:text-[8px] lg:text-[11px] text-white/70 leading-none">
              {prefix}&nbsp;
            </span>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenProfile?.();
            }}
            className="
              cursor-pointer
              text-white
              sm:text-[8px]
              lg:text-[14px]
              leading-none
              tracking-[0.15em]
              sm:tracking-[0.2em]
              hover:text-white/50
              transition-colors
              duration-300
            "
          >
            {username}
          </button>
        </div>
      ) : (
        <div />
      )}

      {/* RIGHT */}
      <div className="flex items-center sm:gap-2 md:gap-4 lg:gap-6 leading-none">
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
            type="button"
            disabled={silhouettesCount === 0}
            onClick={(e) => {
              e.stopPropagation();

              if (silhouettesCount === 0) return;

              onOpenLooks?.();
            }}
            className={`
              ${typography.buttonOverlay}
              text-white
              leading-none
              transition-colors
              duration-300
              ${
                silhouettesCount === 0
                  ? "cursor-default opacity-50"
                  : "cursor-pointer hover:text-white/50"
              }
            `}
          >
            looks:{silhouettesCount}
          </button>
        )}

        {!isOwner && onFollowToggle && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();

              if (isGuest) {
                onRequireAuth?.();
                return;
              }

              onFollowToggle?.();
            }}
            className="
              sm:text-[10px]
              leading-none
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
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="
              text-white
              sm:text-[10px]
              lg:text-[13px]
              leading-none
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
