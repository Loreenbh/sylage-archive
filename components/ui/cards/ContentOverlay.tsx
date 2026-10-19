import LikeButton from "@/components/ui/buttons/LikeButton";
import { typography } from "@/styles/typography";
import { colors } from "@/styles/colors";

type Props = {
  username?: string;
  isOwner: boolean;
  showUsername?: boolean;
  prefix?: "BY" | "FOR";
  isFollowed?: boolean;
  isFollowPending?: boolean;
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
  variant?: "horizontal" | "vertical";
};

export default function ContentOverlay({
  username,
  isOwner,
  prefix,
  showUsername = true,
  isFollowed,
  isFollowPending = false,
  onFollowToggle,
  like,
  onRequireAuth,
  isGuest,
  silhouettesCount,
  onDelete,
  onOpenLooks,
  onOpenProfile,
  variant = "horizontal",
}: Props) {
  return (
    <div
      className={`
        absolute
        flex
        overflow-hidden
        ${colors.bg.charcoal70}
        ${colors.text.ivory}
        backdrop-blur-sm
        ${
          variant === "vertical"
            ? "inset-y-0 right-0 w-4 md:w-6 lg:w-8 flex-col items-center px-0.5 py-2"
            : "inset-x-0 bottom-0 sm:h-4 md:h-[17px] lg:h-[17px] xl:h-8 sm:px-2 md:px-2 lg:px-2 xl:px-5 items-center justify-between gap-2"
        }
      `}
    >
      {variant === "vertical" ? (
        <div className="flex h-full w-full flex-col items-center justify-between">
          {/* TOP — DELETE */}
          {isOwner && onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="
                text-white
                text-[8px]
                md:text-[12px]
                lg:text-[16px]
                leading-none
                hover:text-white/50
                transition-colors
                duration-300
              "
            >
              x
            </button>
          )}

          {/* CENTER — FOLLOW + LIKE */}
          <div className="flex flex-col items-center gap-1">
            {!isOwner && onFollowToggle && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();

                  if (isGuest) {
                    onRequireAuth?.();
                    return;
                  }
                  if (isFollowPending) return;
                  onFollowToggle?.();
                }}
                disabled={isFollowPending}
                aria-busy={isFollowPending}
                aria-label={isGuest ? "Sign in to follow creator" : isFollowPending ? "Updating follow" : isFollowed ? "Unfollow user" : "Follow user"}
                title={isGuest ? "Sign in to follow creator" : undefined}
                className="
                  text-white
                  text-[10px]
                  md:text-[14px]
                  lg:text-[18px]
                  leading-none
                  hover:text-white/50
                  transition-colors
                  duration-300
                "
              >
                {isFollowed ? "✓" : "+"}{isGuest ? "↗" : ""}
              </button>
            )}

            {like && (
              <LikeButton
                type={like.type}
                id={like.id}
                initialCount={like.count}
                initialLiked={like.liked}
                disabled={false}
                onRequireAuth={isGuest ? onRequireAuth : undefined}
                vertical
                className="
                  text-white
                  text-[7px]
                  md:text-[12px]
                  lg:text-[14px]
                  leading-none
                "
              />
            )}
          </div>

          {/* BOTTOM — USER */}
          {showUsername && username && (
            <div className="flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenProfile?.();
                }}
                className="
                  text-white
                  text-[8px]
                  md:text-[12px]
                  lg:text-[16px]
                  tracking-[0.2em]
                  leading-none
                  [writing-mode:vertical-rl]
                  rotate-180
                  whitespace-nowrap
                  hover:text-white/50
                  transition-colors
                  duration-300
                "
              >
                {username}
              </button>

              {prefix && (
                <span
                  className="
                  text-white/70
                  text-[8px]
                  md:text-[11px]
                  lg:text-[14px]
                  leading-none
                  [writing-mode:vertical-rl]
                  rotate-180
                "
                >
                  {prefix}
                </span>
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* LEFT */}
          {showUsername && username ? (
            <div className="min-w-0 flex-1 overflow-hidden leading-none">
              {prefix && (
                <span className="sm:text-[8px] md:text-[8px] lg:text-[8px] xl:text-[11px] text-white/70 leading-none">
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
                  block
                  max-w-full
                  min-w-0
                  truncate
                  whitespace-nowrap
                  cursor-pointer
                  text-white
                  sm:text-[9px]
                  lg:text-[9px]
                  xl:text-[14px]
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
          <div className="flex items-center shrink-0 whitespace-nowrap sm:gap-4 md:gap-4 lg:gap-6 leading-none">
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
                disabled={isFollowPending}
                aria-busy={isFollowPending}
                aria-label={isFollowPending ? "Updating follow" : isFollowed ? "Unfollow user" : "Follow user"}
                className="
                  sm:text-[10px]
                  lg:text-[11px]
                  xl:text-[16px]
                  text-white
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
                  sm:text-[9px]
                  lg:text-[13px]
                  xl:text-[16px]
                  leading-none
                  flex
                  items-center
                  justify-center
                  h-full
                  hover:text-white/50
                  transition-colors
                  duration-300
                "
              >
                x
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
