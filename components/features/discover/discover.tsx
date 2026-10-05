"use client";
import { useState } from "react";
import type { OnNavigate, NavigationParams } from "@/types/navigation";
import BookLayout from "@/components/book/BookLayout";
import Sidebar from "@/components/navigation/SideBar";
import Header from "@/components/navigation/Header";
import ScrollableGrid from "@/components/ui/grids/ScrollableGrid";
import ProfileButton from "@/components/ui/buttons/ProfileButton";
import ContentOverlay from "@/components/ui/cards/ContentOverlay";
import StatusMessage from "@/components/ui/messages/StatusMessage";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useDiscoverMoodboards } from "@/hooks/useDiscoverMoods";
import { followUser, unfollowUser } from "@/lib/services/follows";
import { typography } from "@/styles/typography";
import { colors } from "@/styles/colors";
import { spacing } from "@/styles/spacing";

type Props = {
  onNavigate: OnNavigate;
  params?: NavigationParams["params"] | null;
};

export default function Discover({ onNavigate, params }: Props) {
  const [tab, setTab] = useState(params?.fromTab ?? "latest");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const { moodboards, isLoading, setMoodboards } = useDiscoverMoodboards(tab);
  const { user, isLoading: isUserLoading } = useCurrentUser();

  const handleFollowToggle = async (userId: number, isFollowed: boolean) => {
    if (isFollowed) {
      await unfollowUser(userId);
    } else {
      await followUser(userId);
    }
    setMoodboards((prev) =>
      prev.map((board) =>
        board.user_id === userId
          ? { ...board, is_followed: !isFollowed }
          : board
      )
    );
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/moodboards?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setMoodboards((prev) => prev.filter((board) => board.id !== id));
    }
  };

  const filteredMoodboards =
    selectedFilters.length === 0
      ? moodboards
      : moodboards.filter((board) =>
          board.tags.some((tag) => selectedFilters.includes(tag))
        );

  return (
    <BookLayout
      header={
        <Header
          onFiltersChange={setSelectedFilters}
          items={[
            { section: "HOME", clickable: false, active: true },
            { section: "FILTER", clickable: true },
            {
              section: "CREATE",
              clickable: Boolean(!isUserLoading && user),
              onClick: user
                ? () => onNavigate?.({ to: "create", direction: "next" })
                : undefined,
            },
          ]}
        />
      }
      sidebar={<Sidebar text={tab.toUpperCase()} clickable={false} />}
      actionsBar={
        <div
          className={`
            flex items-center
            ${typography.buttonBodyDiscover}
            ${spacing.buttonBodyDiscover}
            ${colors.text.charcoal}
          `}
        >
          <button
            onClick={() => setTab("latest")}
            className={`pb-1 border-b transition-colors duration-300 ${
              tab === "latest" ? "border-black" : "border-transparent hover:border-black"
            }`}
          >
            LATEST
          </button>
          <span className={typography.bullet}>•</span>
          <button
            onClick={() => setTab("curated")}
            className={`pb-1 border-b transition-colors duration-300 ${
              tab === "curated" ? "border-black" : "border-transparent hover:border-black"
            }`}
          >
            CURATED
          </button>
          <span className={typography.bullet}>•</span>
          <button
            onClick={() => {
              if (isUserLoading || !user) return;
              setTab("following");
            }}
            disabled={Boolean(isUserLoading || !user)}
            className={`pb-1 border-b transition-colors duration-300 ${
              !user
                ? "border-transparent cursor-default opacity-50"
                : tab === "following"
                ? "border-black"
                : "border-transparent hover:border-black"
            }`}
          >
            FOLLOWING
          </button>
        </div>
      }
      footerRight={
        <div className="flex w-full items-center gap-1">
          <span className={typography.username}>{user?.username}</span>
          <ProfileButton onNavigate={onNavigate} />
        </div>
      }
    >
      <div className="flex flex-col h-full w-full">
        {isLoading ? (
          <StatusMessage message="LOADING ARCHIVE..." />
        ) : filteredMoodboards.length === 0 ? (
          <div
            className={`aspect-square w-full flex items-center justify-center ${colors.bg.empty} border border-black/10`}
          >
            <StatusMessage
              message={
                tab === "following"
                  ? "BUILD YOUR ARCHIVE."
                  : tab === "curated"
                  ? "NO CURATED PIECES YET."
                  : "THE ARCHIVE IS EMPTY."
              }
            />
          </div>
        ) : (
          <ScrollableGrid
            data={filteredMoodboards}
            onItemClick={(board) => {
              onNavigate?.({
                to: "moodDetails",
                direction: "next",
                params: {
                  moodboardId: board.id,
                  isOwner: user?.id === board.user_id,
                },
              });
            }}
            renderItem={(board) => (
              <div className="relative aspect-square w-full cursor-pointer overflow-hidden">
                <img
                  src={board.image_url}
                  alt=""
                  className="absolute inset-0 w-full h-full object-contain"
                />
                {user?.role === "admin" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(board.id);
                    }}
                    className="absolute top-2 right-2 z-20 text-xl leading-none"
                  >
                    ×
                  </button>
                )}
                <ContentOverlay
                  username={board.username}
                  isOwner={user?.id === board.user_id}
                  isFollowed={board.is_followed ?? false}
                  isGuest={!user}
                  onRequireAuth={() =>
                    onNavigate?.({ to: "auth", direction: "next" })
                  }
                  onFollowToggle={() =>
                    handleFollowToggle(
                      board.user_id,
                      board.is_followed ?? false
                    )
                  }
                  like={{
                    type: "moodboard",
                    id: board.id,
                    count: board.likes_count,
                    liked: board.liked_by_current_user,
                  }}
                  silhouettesCount={board.silhouettes_count}
                  onOpenLooks={() =>
                    onNavigate?.({
                      to: "looks",
                      direction: "next",
                      params: {
                        from: "discover",
                        moodboardId: board.id,
                        isOwner: user?.id === board.user_id,
                      },
                    })
                  }
                  onOpenProfile={() =>
                    onNavigate?.({
                      to: "profile",
                      direction: "next",
                      params: {
                        userId: board.user_id,
                        isOwner: user?.id === board.user_id,
                      },
                    })
                  }
                />
              </div>
            )}
          />
        )}
      </div>
    </BookLayout>
  );
}