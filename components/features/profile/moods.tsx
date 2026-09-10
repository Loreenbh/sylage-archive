"use client"
import { useEffect, useState } from "react"
/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Sidebar from "@/components/navigation/SideBar"
import Header from "@/components/navigation/Header"
import ScrollableGrid from "@/components/ui/grids/ScrollableGrid"
import ProfileButton from "@/components/ui/buttons/ProfileButton"
import ContentOverlay from "@/components/ui/cards/ContentOverlay"
import StatusMessage from "@/components/ui/messages/StatusMessage"
/*STYLE*/
import { typography } from "@/styles/typography"
/* TYPES */
import type { OnNavigate, NavigationParams } from "@/types/navigation"
import BackButton from "@/components/ui/buttons/BackButton"
type Props = {
  onNavigate: OnNavigate
  params?: NavigationParams["params"] | null
  onBack?: () => void

}

/* SERVICES */
import { useUserMoodboards } from "@/hooks/useUserMoodboards"

import { useCurrentUser } from "@/hooks/useCurrentUser"

/*---------------------------------------------------- */

export default function Moods({ onNavigate, params, onBack }: Props) {
  const { user } = useCurrentUser()
  const { isOwner, userId, from} = params ?? {}

const {
  moodboards,
  isLoading,
  user: profileUser,
  setMoodboards
} = useUserMoodboards(userId, from)

  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const filteredMoodboards =
    selectedFilters.length === 0
      ? moodboards
      : moodboards.filter((board) =>
          board.tags.some((tag) =>
            selectedFilters.includes(tag)
          )
        )

  const handleDelete = async (id:number) => {
  
    const res = await fetch(`/api/moodboards?id=${id}`, {
      method:"DELETE"
    })
  
    if(res.ok){
      setMoodboards(prev =>
        prev.filter(board => board.id !== id)
      )
    }
  }

  return (
    <BookLayout
    header={
      <Header
      onFiltersChange={setSelectedFilters}
      items={[
        { section: "HOME",
          clickable: true,
          onClick: () =>
            onNavigate?.({
              to: "discover",
              direction: "prev",
              params:{
                isOwner: false
              }
            })
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
                    isOwner
                  }
                })
             },
          ]}
        />
      }
      sidebar={
        <Sidebar text="MOODS" clickable={false}/>
      }
      actionsBar={
        <div className="flex items-center gap-2 md:gap-4 ml-6 md:mt-1 lg:mt-3">
          <span className={typography.buttonBody}>
            {from === "references"
              ? "LIKED MOODS"
              : isOwner
                ? "MY MOODS"
                : `${profileUser?.username.toUpperCase()}'S MOODS`
            }
          </span>

          <span className={typography.bullet}>•</span>

          <span className={typography.buttonBody}>
            {filteredMoodboards.length} MOODS
          </span>
        </div>
      }
      footerLeft={ <BackButton onBack={onBack} />
      }
      footerRight={
          <div className="flex items-center gap-4">
            <span className={typography.username}>
              {user?.username}
            </span>
            <ProfileButton onNavigate={onNavigate}/>
          </div>
          }
        >   
        <div className="flex 
                        flex-col 
                        h-full   
                        bg-black/[0.02]
                        border
                        border-black/10"> 
          {isLoading ? (
            <StatusMessage message="LOADING ARCHIVE..." />
          ) : filteredMoodboards.length === 0 ? (
            <StatusMessage 
            message={
              from === "references"
                ? "NO LIKED MOODS."
                : "NO MOODS."
            }
          />
          ) : (
          <ScrollableGrid
            data={filteredMoodboards}
            renderItem={(board) => (
              <div
                className="
                  relative
                  aspect-square
                  w-full
                  bg-zinc-100
                  overflow-hidden
                  cursor-pointer
                "
                onClick={() =>
                  onNavigate?.({
                    to: "moodDetails",
                    direction: "next",
                    params: {
                      moodboardId: board.id,
                      from: "moods",
                      isOwner: board.user_id === user?.id,
                    },
                  })
                }
              >
                <img
                  src={board.image_url}
                  alt=""
                  className="
                    absolute
                    inset-0
                    w-full
                    h-full
                    object-cover
                  "
                />

                <ContentOverlay
                  username={board.username}
                  isOwner={board.user_id === user?.id}
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
                        from: "moods",
                        moodboardId: board.id,
                        isOwner: user?.id === board.user_id,
                      },
                    })
                  }
                  onDelete={
                    board.user_id === user?.id
                      ? () => handleDelete(board.id)
                      : undefined
                  }
                />
              </div>
            )}
          />
        )}
      </div>
    </BookLayout>
  )
}