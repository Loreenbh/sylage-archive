"use client"
import { useState } from "react"
import type { OnNavigate, NavigationParams } from "@/types/navigation"

/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Sidebar from "@/components/navigation/SideBar"
import Header from "@/components/navigation/Header"
import ScrollableGrid from "@/components/ui/grids/ScrollableGrid"
import ProfileButton from "@/components/ui/buttons/ProfileButton"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import ContentOverlay from "@/components/ui/cards/ContentOverlay"

/*STYLE*/
import { typography } from "@/styles/typography"

/* TYPES */
type Props = {
  onNavigate: OnNavigate
  params?: NavigationParams["params"] | null
}

/* HOOKS */
import { useDiscoverMoodboards } from "@/hooks/useDiscoverMoods"
import { followUser , unfollowUser } from "@/lib/services/follows"
/*---------------------------------------------------- */

export default function Discover({ onNavigate, params }: Props) {
  const [tab, setTab] = useState(params?.fromTab ?? "latest")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const {
    moodboards,
    isLoading,
    setMoodboards
  } = useDiscoverMoodboards(tab)
  
  const { user } = useCurrentUser()


  const handleFollowToggle = async (
    userId:number,
    isFollowed:boolean
  ) => {

    if(isFollowed){
      await unfollowUser(userId)
    } else {
      await followUser(userId)
    }
    setMoodboards(prev =>
      prev.map(board =>
        board.user_id === userId
          ? {
              ...board,
              is_followed: !isFollowed
            }
          : board
      )
    )
  }

  const filteredMoodboards =
    selectedFilters.length === 0
      ? moodboards
      : moodboards.filter((board) =>
          board.tags.some((tag) =>
            selectedFilters.includes(tag)
          )
        )

  const sidebarTitle = tab.toUpperCase()
  return (
    <BookLayout
      header={
        <Header
          onFiltersChange={setSelectedFilters}
          items={[
            { section: "HOME",
              clickable: false,
              active: true,
             },
            { section: "FILTER",
              clickable: true,
             },
            { section: "CREATE",
              clickable: true,
                onClick: () =>
                onNavigate?.({
                  to: "create",
                  direction: "next",
                  params:{
                    from: "discover",
                  }
                })
             },
          ]}
        />
      }
      sidebar={
        <Sidebar text={sidebarTitle} clickable={false}/>
      }
      actionsBar={
        <div className="flex items-center gap-1 sm:gap-6">
          <button
            onClick={() => setTab("latest")}
            className={typography.buttonBody}>latest</button>
          <span className={typography.bullet}>•</span>
          <button
            onClick={() => setTab("curated")}
            className={typography.buttonBody}>curated</button>
          <span className={typography.bullet}>•</span>

          <button 
            onClick={() => setTab("following")}
            className={typography.buttonBody}>following</button>
        </div>
      }
      footer={
          <div className="flex items-center gap-4">
            <span className="text-sm tracking-[0.2em]">
              {user?.username}
            </span>
            <ProfileButton onNavigate={onNavigate}/>
          </div>
          }
        >     
      <div className="flex flex-col h-full "> 

        {isLoading ? (
          <p className="text-center text-black/30 text-xs mt-10 tracking-[0.2em]">
            LOADING ARCHIVE...
          </p>
        ) : filteredMoodboards.length === 0 ? (
          <p className="text-center text-black/30 text-xs mt-10 tracking-[0.2em]">
            {tab === "following"
              ? "FOLLOW CREATORS TO BUILD YOUR FEED"
              : tab === "curated"
              ? "NO CURATED PIECES YET"
              : "THE ARCHIVE IS EMPTY"}
          </p>
        ) : (
          <ScrollableGrid
            data={filteredMoodboards}
            onItemClick={(board) => {
              onNavigate?.({
                to: "moodDetails",
                direction: "next",
                params: {
                  from: "discover",
                  moodboardId: board.id,
                  fromTab: tab,
                  isOwner: user?.id === board.user_id
                },
              })
            }}
            renderItem={(board) => (
              <div className="relative aspect-square w-full bg-zinc-100 cursor-pointer overflow-hidden">
                <img
                  src={board.image_url}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <ContentOverlay
                  username={board.username}
                  isOwner={user?.id === board.user_id}
                  isFollowed={board.is_followed}
                  onFollowToggle={() => 
                    handleFollowToggle(
                      board.user_id,
                      board.is_followed
                    )
                  }
                  like={{
                    type: "moodboard",
                    id: board.id,
                    count: board.likes_count,
                    liked: board.liked_by_current_user
                  }}
                  silhouettesCount={board.silhouettes_count}
                />
              </div>
            )}
          />
        )}
      </div>
    </BookLayout>
  )
}