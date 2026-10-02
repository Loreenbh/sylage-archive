"use client";
import { useState, useEffect } from "react";
/*TYPES*/
import type { OnNavigate, NavigationParams } from "@/types/navigation";
/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout";
import Header from "@/components/navigation/Header";
import Sidebar from "@/components/navigation/SideBar";
import CustomGrid from "@/components/ui/grids/CustomGrid";
import ProfileButton from "@/components/ui/buttons/ProfileButton";
import GridButton from "@/components/ui/buttons/GridButton";
import ScrollFollow from "@/components/ui/cards/scrollFollow";
import BackButton from "@/components/ui/buttons/BackButton";
/* STYLE */
import { typography } from "@/styles/typography";
import { colors } from "@/styles/colors";
/*HOOKS*/
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useProfile } from "@/hooks/useProfile";
import { useFollows } from "@/hooks/useFollows";
/*SERVICES*/
import { logout } from "@/lib/services/logout";
import { getFollows, unfollowUser, followUser } from "@/lib/services/follows";

type Props = {
  onNavigate: OnNavigate;
  params?: NavigationParams["params"] | null;
  onBack?: () => void;
};

export default function ProfilePage({ onNavigate, onBack, params }: Props) {
  const { isOwner, userId, from } = params ?? {};

  const { user: currentUser } = useCurrentUser();

  const [isFollowed, setIsFollowed] = useState(false);

  const { following, followers, handleUnfollow, refreshFollows } =
    useFollows(userId);

  const {
    user: profileUser,
    moodboards,
    silhouettes,
    isLoading,
  } = useProfile(userId, isOwner);

  useEffect(() => {
    if (!profileUser || !currentUser) return;

    const currentUserId = currentUser.id;
    const profileUserId = profileUser.id;

    async function checkFollow() {
      const res = await getFollows(currentUserId);

      const followed = res.following.some(
        (user: { id: number }) => user.id === profileUserId,
      );

      setIsFollowed(followed);
    }

    checkFollow();
  }, [profileUser, currentUser]);

  const handleFollowToggle = async () => {
    if (!profileUser) return;

    if (!currentUser) {
      onNavigate?.({
        to: "auth",
        direction: "next",
      });
      return;
    }

    if (isFollowed) {
      await unfollowUser(profileUser.id);
    } else {
      await followUser(profileUser.id);
    }

    setIsFollowed((prev) => !prev);

    await refreshFollows();
  };

  const handleLogout = async () => {
    try {
      await logout();

      onNavigate?.({
        to: "cover",
        direction: "prev",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const lastMoodboard = moodboards[0] ?? null;
  const lastSilhouette = silhouettes[0] ?? null;

  const sidebarTitle = "PROFILE";

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
              clickable: !!currentUser,
              onClick: currentUser
                ? () =>
                    onNavigate?.({
                      to: "create",
                      direction: "next",
                      params: {
                        from: "discover",
                        isOwner: isOwner,
                      },
                    })
                : undefined,
            },
          ]}
        />
      }
      sidebar={<Sidebar text={sidebarTitle} clickable={false} />}
      actionsBar={
        <div className="flex items-center gap-2 sm:ml-7 md:gap-4 ml-6 mt-1 lg:mt-3">
          {isOwner ? (
            <>
              <button
                className={`
                  ${typography.buttonBodyFocus}
                  transition-opacity
                  hover:opacity-60
                  cursor-pointer
                `}
                onClick={() =>
                  onNavigate?.({
                    to: "settings",
                    direction: "next",
                    params: {
                      isOwner: isOwner,
                    },
                  })
                }
              >
                Edit
              </button>
              <span className={typography.bullet}>•</span>
              <button
                className={`
                  ${typography.buttonBodyFocus}
                  transition-opacity
                  hover:opacity-60
                  cursor-pointer
                `}
                onClick={() =>
                  onNavigate?.({
                    to: "references",
                    direction: "next",
                    params: {
                      isOwner: isOwner,
                    },
                  })
                }
              >
                References
              </button>
              <span className={typography.bullet}>•</span>
              <button
                className={`
                  ${typography.buttonBodyFocus}
                  transition-opacity
                  hover:opacity-60
                  cursor-pointer
                `}
                onClick={handleLogout}
              >
                Exit
              </button>
            </>
          ) : (
            <>
              <p
                className={`
                ${typography.buttonBodyFocus}
                `}
              >
                {profileUser?.username}'S ARCHIVE
              </p>

              <span className={typography.bullet}>•</span>

              <button
                onClick={handleFollowToggle}
                className={`
                    ${typography.buttonBodyFocus}
                    transition-opacity
                    hover:opacity-60
                    cursor-pointer
                  `}
              >
                {isFollowed ? "unfollow" : "follow"}
              </button>
            </>
          )}
        </div>
      }
      footerLeft={<BackButton onBack={onBack} />}
      footerRight={
        <div className="flex items-center gap-2 ">
          <span className={typography.username}>{currentUser?.username}</span>
          <ProfileButton onNavigate={onNavigate} />
        </div>
      }
    >
      <div className="flex flex-col h-full min-h-0">
        <CustomGrid
          left={
            <GridButton
              disabled={!lastSilhouette}
              className="
            relative
            overflow-hidden
            border
            border-black/10
            disabled:cursor-default
          "
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
              {lastSilhouette && (
                <img
                  src={lastSilhouette.image_url}
                  alt=""
                  className="
              absolute
              inset-0
              w-full
              h-full
              object-cover
            "
                />
              )}

              {!lastSilhouette && (
                <div
                  className={`
            absolute
            inset-0
            flex
            items-center
            justify-center
            ${colors.bg.empty}
            `}
                >
                  <p
                    className="
              text-[8px]
              sm:text-[12px]
              lg:text-[14px]
              tracking-[0.2em]
              text-black/30
            "
                  >
                    NO LOOKS.
                  </p>
                </div>
              )}

              <div
                className="
          absolute
          bottom-0
          left-0
          p-3
          z-10
        "
              >
                <p
                  className={`
              ${typography.profile}
              ${lastSilhouette ? "drop-shadow" : ""}
            `}
                >
                  looks
                </p>
              </div>
            </GridButton>
          }
          topRight={
            <GridButton
              disabled={!lastMoodboard}
              className="
                relative
                overflow-hidden
                border
                border-black/10
                disabled:cursor-default
              "
              onClick={() =>
                lastMoodboard &&
                onNavigate?.({
                  to: "moods",
                  direction: "next",
                  params: {
                    isOwner: isOwner,
                    userId: profileUser?.id,
                  },
                })
              }
            >
              {lastMoodboard && (
                <img
                  src={lastMoodboard.image_url}
                  alt=""
                  className="
              absolute
              inset-0
              w-full
              h-full
              object-contain
            "
                />
              )}

              {!lastMoodboard && (
                <div
                  className={`
            absolute
            inset-0
            flex
            items-center
            justify-center
            ${colors.bg.empty}
          `}
                >
                  <p
                    className="
              text-[8px]
              sm:text-[12px]
              lg:text-[14px]
              tracking-[0.2em]
              text-black/30
            "
                  >
                    NO MOODS.
                  </p>
                </div>
              )}

              <div
                className="
          absolute
          bottom-0
          left-0
          p-3
          z-10
        "
              >
                <p
                  className={`
              ${typography.profile}
              ${lastMoodboard ? "drop-shadow" : ""}
            `}
                >
                  moods
                </p>
              </div>
            </GridButton>
          }
          bottomRight={
            <div
              className="
      relative
      h-full
      min-h-0
      w-full
      overflow-hidden
      border
      border-black/10
    "
            >
              {/* ZONE SCROLLABLE */}
              <div
                className="
        absolute
        inset-x-0
        top-0
        bottom-[25px]
        min-h-0
        overflow-hidden
      "
              >
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
                    className={`
            absolute
            inset-0
            flex
            items-center
            justify-center
            ${colors.bg.empty}
          `}
                  >
                    <p
                      className="
              text-[8px]
              sm:text-[12px]
              lg:text-[14px]
              tracking-[0.2em]
              text-black/30
            "
                    >
                      NO CONNECTIONS.
                    </p>
                  </div>
                )}
              </div>

              <div
                className="
          absolute
          bottom-0
          left-0
          right-0
          z-10
          h-[25px]
          bg-red-200
          flex
          items-end
          px-3
          pb-3
        "
              >
                <p className={typography.profile}>CONNECTIONS</p>
              </div>
            </div>
          }
        />
      </div>
    </BookLayout>
  );
}
