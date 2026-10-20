"use client";
/*TYPES*/
import type { OnNavigate, NavigationParams } from "@/types/navigation";
/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout";
import Sidebar from "@/components/navigation/SideBar";
import Header from "@/components/navigation/Header";
import ProfileButton from "@/components/ui/buttons/ProfileButton";
import SimpleGrid from "@/components/ui/grids/SimpleGrid";
import LikeButton from "@/components/ui/buttons/LikeButton";
import BackButton from "@/components/ui/buttons/BackButton";
import StatusMessage from "@/components/ui/messages/StatusMessage";
/*HOOKS*/
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useMoodboard } from "@/hooks/useMoodboard";
/* STYLE */
import { typography } from "@/styles/typography";

type Props = {
  onNavigate: OnNavigate;
  params?: NavigationParams["params"] | null;
  onBack?: () => void;
};

export default function MoodDetails({ onNavigate, params, onBack }: Props) {
  const { user } = useCurrentUser();
  const { isOwner, from, moodboardId } = params ?? {};

  const { moodboard, isLoading } = useMoodboard(moodboardId);

  return (
    <BookLayout
      header={
        <Header
          items={[
            {
              section: "HOME",
              clickable: true,
              onClick: () =>
                onNavigate?.({
                  to: "discover",
                  direction: "prev",
                  params: {
                    isOwner: false,
                  },
                }),
            },
            { section: "FILTER", clickable: false },
            {
              section: !user ? "CREATE →" : "CREATE",
              clickable: true,
              onClick: () =>
                onNavigate?.({
                  to: user ? "create" : "auth",
                  direction: "next",
                  ...(user ? { params: { from: "discover", isOwner } } : {}),
                }),
            },
          ]}
        />
      }
      sidebar={<Sidebar text="FOCUS" clickable={false} />}
      actionsBar={
        <div className="flex w-full min-w-0 items-center justify-between gap-1 overflow-hidden">
          {!isOwner && (
            <button
              onClick={() =>
                onNavigate?.({
                  to: "profile",
                  direction: "next",
                  params: {
                    isOwner,
                    from: "moodDetails",
                    userId: moodboard?.user_id,
                  },
                })
              }
              className={`
          ${typography.buttonBodyFocus}
          text-black/60
          transition-opacity
          hover:opacity-40
          cursor-pointer
          min-w-0
          shrink
          truncate
          whitespace-nowrap
        `}
            >
              by {moodboard?.username}
            </button>
          )}
          <div className="flex min-w-0 items-center shrink-0 whitespace-nowrap gap-1 sm:gap-2">
          <span className={typography.bullet}>•</span>
            {!isOwner && (
              <>
                <button
                  onClick={() => {
                    if (!user) {
                      onNavigate?.({
                        to: "auth",
                        direction: "next",
                      });
                      return;
                    }

                    onNavigate?.({
                      to: "draw",
                      direction: "next",
                      params: {
                        moodboardId: moodboard?.id,
                      },
                    });
                  }}
                  className={`
              ${typography.buttonBodyFocus}
              transition-opacity
              hover:opacity-40
              cursor-pointer
              whitespace-nowrap
            `}
                >
                  Add look{!user ? " →" : ""}
                </button>

                <span className={typography.bullet}>•</span>
              </>
            )}

            {moodboard && (
              <LikeButton
                type="moodboard"
                className={typography.buttonBodyFocus}
                id={moodboard.id}
                initialCount={moodboard.likes_count}
                initialLiked={moodboard.liked_by_current_user}
                disabled={false}
                onRequireAuth={
                  !user
                    ? () =>
                        onNavigate?.({
                          to: "auth",
                          direction: "next",
                        })
                    : undefined
                }
              />
            )}

            <span className={typography.bullet}>•</span>

            <button
              disabled={(moodboard?.silhouettes_count ?? 0) === 0}
              onClick={() => {
                if ((moodboard?.silhouettes_count ?? 0) === 0) return;

                onNavigate?.({
                  to: "looks",
                  direction: "next",
                  params: {
                    isOwner,
                    moodboardId: moodboard?.id,
                    from: "moodDetails",
                  },
                });
              }}
              className={`
          ${typography.buttonBodyFocus}
          transition-opacity
          duration-300
          whitespace-nowrap
          ${
            (moodboard?.silhouettes_count ?? 0) === 0
              ? "cursor-default opacity-50"
              : "cursor-pointer hover:opacity-60"
          }
        `}
            >
              {moodboard?.silhouettes_count ?? 0} looks
            </button>
          </div>
        </div>
      }
      footerLeft={<BackButton onBack={onBack} />}
      footerRight={
        <div className="flex items-center gap-4">
          <span className={typography.username}>{user?.username}</span>
          <ProfileButton onNavigate={onNavigate} />
        </div>
      }
    >
      <div className="flex flex-col h-full min-h-0 gap-1">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <StatusMessage message="LOADING MOODBOARD..." />
          </div>
        ) : !moodboard ? (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <StatusMessage message="THIS MOODBOARD IS UNAVAILABLE." />
            <button
              type="button"
              onClick={() => onNavigate?.({ to: "discover", direction: "prev", params: { isOwner: false } })}
              className="text-[8px] sm:text-[9px] tracking-[0.16em] border-b border-black/30 text-black/55 hover:text-black hover:border-black transition-colors"
            >
              BACK TO ARCHIVE
            </button>
          </div>
        ) : (
          <SimpleGrid
            square={
              <div className="relative w-full h-full">
                <img
                  src={moodboard.image_url}
                  alt=""
                  className="absolute inset-0 h-full w-full object-contain"
                />
              </div>
            }
          />
        )}
      </div>
    </BookLayout>
  );
}
