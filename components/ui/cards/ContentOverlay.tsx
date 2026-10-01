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
  variant?: "horizontal" | "vertical";
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
            ? "inset-y-0 right-0 w-4 sm:w-3 lg:w-6 flex-col items-center px-0.5 py-2"
            : "inset-x-0 bottom-0 sm:h-4 md:h-8 lg:h-8 sm:px-2 md:px-4 lg:px-5 items-center justify-between gap-2"
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

                  onFollowToggle?.();
                }}
                className="
                  text-white
                  text-[9px]
                  leading-none
                  hover:text-white/50
                  transition-colors
                  duration-300
                "
              >
                {isFollowed ? "✓" : "+"}
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
                  text-[7px]
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
                  text-[6px]
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
                <span className="sm:text-[7px] lg:text-[11px] text-white/70 leading-none">
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
                  sm:text-[9px]
                  lg:text-[13px]
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
