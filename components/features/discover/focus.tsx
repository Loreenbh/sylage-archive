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

  const { moodboard } = useMoodboard(moodboardId);

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
              section: "CREATE",
              clickable: !!user,
              onClick: user
                ? () =>
                    onNavigate?.({
                      to: "create",
                      direction: "next",
                      params: {
                        from: "discover",
                        isOwner,
                      },
                    })
                : undefined,
            },
          ]}
        />
      }
      sidebar={<Sidebar text="FOCUS" clickable={false} />}
      actionsBar={
        <div className="flex w-full items-center justify-between overflow-hidden">
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
          <div className="flex items-center shrink-0 whitespace-nowrap sm:gap-2">
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
                  Add look
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
        <SimpleGrid
          square={
            <div className="relative w-full h-full">
              {moodboard && (
                <img
                  src={moodboard.image_url}
                  alt=""
                  className="
                    absolute 
                    inset-0 
                    w-full 
                    h-full 
                    object-contain"
                />
              )}
            </div>
          }
        />
      </div>
    </BookLayout>
  );
}
