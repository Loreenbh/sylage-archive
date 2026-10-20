"use client";
import { useState, useEffect } from "react";
import type { OnNavigate, NavigationParams } from "@/types/navigation";
import BookLayout from "@/components/book/BookLayout";
import Header from "@/components/navigation/Header";
import Sidebar from "@/components/navigation/SideBar";
import CustomGrid from "@/components/ui/grids/CustomGrid";
import ProfileButton from "@/components/ui/buttons/ProfileButton";
import GridButton from "@/components/ui/buttons/GridButton";
import ScrollFollow from "@/components/ui/cards/scrollFollow";
import BackButton from "@/components/ui/buttons/BackButton";
import { typography } from "@/styles/typography";
import { colors } from "@/styles/colors";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useProfile } from "@/hooks/useProfile";
import { useFollows } from "@/hooks/useFollows";
import { logout } from "@/lib/services/logout";
import { getFollows, unfollowUser, followUser } from "@/lib/services/follows";

type Props = {
  onNavigate: OnNavigate;
  params?: NavigationParams["params"] | null;
  onBack?: () => void;
};

export default function ProfilePage({ onNavigate, onBack, params }: Props) {
  const { isOwner, userId } = params ?? {};
  const { user: currentUser } = useCurrentUser();
  const [isFollowed, setIsFollowed] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(true);
  const [isFollowPending, setIsFollowPending] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const { following, followers, handleUnfollow, refreshFollows } =
    useFollows(userId);
  const {
    user: profileUser,
    moodboards,
    silhouettes,
  } = useProfile(userId, isOwner);

  useEffect(() => {
    let cancelled = false;

    if (!profileUser || !currentUser) {
      setIsFollowed(false);
      setIsFollowLoading(false);
      return () => {
        cancelled = true;
      };
    }

    const currentUserId = currentUser.id;
    const profileUserId = profileUser.id;
    setIsFollowLoading(true);

    async function checkFollow() {
      try {
        const res = await getFollows(currentUserId);
        if (cancelled) return;

        const followed = res.following.some(
          (user: { id: number }) => user.id === profileUserId
        );
        setIsFollowed(followed);
      } catch {
        if (!cancelled) setActionMessage("COULD NOT LOAD FOLLOW STATUS.");
      } finally {
        if (!cancelled) setIsFollowLoading(false);
      }
    }

    checkFollow();

    return () => {
      cancelled = true;
    };
  }, [profileUser, currentUser]);

  const handleFollowToggle = async () => {
    if (!profileUser || isFollowPending) return;
    if (!currentUser) {
      onNavigate?.({ to: "auth", direction: "next" });
      return;
    }

    setIsFollowPending(true);
    setActionMessage(null);
    try {
      if (isFollowed) {
        await unfollowUser(profileUser.id);
      } else {
        await followUser(profileUser.id);
      }
      setIsFollowed((prev) => !prev);
      await refreshFollows();
    } catch {
      setActionMessage("COULD NOT UPDATE FOLLOW. PLEASE TRY AGAIN.");
    } finally {
      setIsFollowPending(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onNavigate?.({ to: "cover", direction: "prev" });
    } catch {
      setActionMessage("COULD NOT LOG OUT. PLEASE TRY AGAIN.");
    }
  };

  const lastMoodboard = moodboards[0] ?? null;
  const lastSilhouette = silhouettes[0] ?? null;

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
                  params: { isOwner: false },
                }),
            },
            { section: "FILTER", clickable: false },
            {
              section: !currentUser ? "CREATE →︎" : "CREATE",
              clickable: true,
              onClick: () =>
                onNavigate?.({
                  to: currentUser ? "create" : "auth",
                  direction: "next",
                  ...(currentUser ? { params: { from: "discover", isOwner } } : {}),
                }),
            },
          ]}
        />
      }
      sidebar={<Sidebar text="PROFILE" clickable={false} />}
      actionsBar={
        <div className="flex flex-col gap-1">
          {actionMessage && (
            <p role="alert" className="text-[9px] tracking-[0.1em] text-red-700">
              {actionMessage}
            </p>
          )}
          <div className="flex items-center gap-2">
          {isOwner ? (
            <>
              <button
                className={`${typography.buttonBodyFocus} transition-opacity hover:opacity-60 cursor-pointer`}
                onClick={() =>
                  onNavigate?.({
                    to: "settings",
                    direction: "next",
                    params: { isOwner },
                  })
                }
              >
                Edit
              </button>
              <span className={typography.bullet}>•</span>
              <button
                className={`${typography.buttonBodyFocus} transition-opacity hover:opacity-60 cursor-pointer`}
                onClick={() =>
                  onNavigate?.({
                    to: "references",
                    direction: "next",
                    params: { isOwner },
                  })
                }
              >
                References
              </button>
              <span className={typography.bullet}>•</span>
              <button
                className={`${typography.buttonBodyFocus} transition-opacity hover:opacity-60 cursor-pointer`}
                onClick={handleLogout}
              >
                Exit
              </button>
            </>
          ) : (
            <>
              <p className={typography.buttonBodyFocus}>
                {profileUser?.username}&apos;S ARCHIVE
              </p>
              <span className={typography.bullet}>•</span>
              <button
                onClick={handleFollowToggle}
                disabled={isFollowPending || isFollowLoading}
                aria-busy={isFollowPending || isFollowLoading}
                aria-label={isFollowed ? "Unfollow creator" : "Follow creator"}
                className={`${typography.buttonBodyFocus} transition-opacity hover:opacity-60 cursor-pointer disabled:opacity-50`}
              >
                {isFollowPending || isFollowLoading ? "..." : isFollowed ? "unfollow" : "follow"}{!currentUser ? " →︎" : ""}
              </button>
            </>
          )}
          </div>
        </div>
      }
      footerLeft={<BackButton onBack={onBack} />}
      footerRight={
        <div className="flex items-center gap-2">
          <span className={typography.username}>{currentUser?.username}</span>
          <ProfileButton onNavigate={onNavigate} />
        </div>
      }
    >
      <div className="flex flex-col h-full w-full min-h-0">
        <CustomGrid
          left={
            <GridButton
              disabled={!lastSilhouette}
              className="relative overflow-hidden border border-black/10 disabled:cursor-default"
              onClick={() =>
                lastSilhouette &&
                onNavigate?.({
                  to: "looks",
                  direction: "next",
                  params: {
                    userId: profileUser?.id,
                    from: "profile",
                    isOwner: profileUser?.id === currentUser?.id,
                  },
                })
              }
            >
              {lastSilhouette ? (
                <img
                  src={lastSilhouette.image_url}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`absolute inset-0 flex items-center justify-center ${colors.bg.empty}`}
                >
                  <p className="text-[clamp(5px,1.1cqw,8px)] lg:text-[14px] tracking-[0.2em] text-black/30">
                    NO LOOKS.
                  </p>
                </div>
              )}
              <div className="absolute bottom-0 left-0 p-3 z-10">
                <p
                  className={`${typography.profile} ${
                    lastSilhouette ? "drop-shadow" : ""
                  }`}
                >
                  looks
                </p>
              </div>
            </GridButton>
          }
          topRight={
            <GridButton
              disabled={!lastMoodboard}
              className="relative overflow-hidden border border-black/10 disabled:cursor-default"
              onClick={() =>
                lastMoodboard &&
                onNavigate?.({
                  to: "moods",
                  direction: "next",
                  params: { isOwner, userId: profileUser?.id },
                })
              }
            >
              {lastMoodboard ? (
                <img
                  src={lastMoodboard.image_url}
                  alt=""
                  className="absolute inset-0 w-full h-full object-contain"
                />
              ) : (
                <div
                  className={`absolute inset-0 flex items-center justify-center ${colors.bg.empty}`}
                >
                  <p className="text-[clamp(5px,1.1cqw,8px)] sm:text-[10px] lg:text-[14px] tracking-[0.2em] text-black/30">
                    NO MOODS.
                  </p>
                </div>
              )}
              <div className="absolute bottom-0 left-0 p-3 z-10">
                <p
                  className={`${typography.profile} ${
                    lastMoodboard ? "drop-shadow" : ""
                  }`}
                >
                  moods
                </p>
              </div>
            </GridButton>
          }
          bottomRight={
            <div className="relative h-full min-h-0 w-full overflow-hidden border border-black/10">
              <div className="absolute inset-x-0 top-0 bottom-[25px] md:bottom-[27px] min-h-0 overflow-hidden">
                {following.length > 0 || followers.length > 0 ? (
                  <ScrollFollow
                    followingTitle="Inspired by"
                    followersTitle="Inspiring"
                    following={following}
                    followers={followers}
                    canManageFollow={profileUser?.id === currentUser?.id}
                    onOpenProfile={(item) => {
                      onNavigate?.({
                        to: "profile",
                        direction: "next",
                        params: {
                          userId: item.id,
                          isOwner: item.id === currentUser?.id,
                          from: "profile",
                        },
                      });
                    }}
                    onUnfollow={(item) => handleUnfollow(item.id)}
                  />
                ) : (
                  <div
                    className={`absolute inset-0 flex items-center justify-center ${colors.bg.empty}`}
                  >
                    <p className="text-[clamp(5px,1.1cqw,8px)] sm:text-[10px] lg:text-[14px] tracking-[0.2em] text-black/30">
                      NO CONNECTIONS.
                    </p>
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 z-10 h-[25px] md:h-[27px] flex items-end px-3 pb-3">
                <p className={typography.profile}>CONNECTIONS</p>
              </div>
            </div>
          }
        />
      </div>
    </BookLayout>
  );
}