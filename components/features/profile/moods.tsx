"use client"
import { useEffect, useState } from "react"
/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Sidebar from "@/components/navigation/SideBar"
import Header from "@/components/navigation/Header"
import ScrollableGrid from "@/components/ui/grids/ScrollableGrid"
import ProfileButton from "@/components/ui/buttons/ProfileButton"
// import LikeButton from "@/components/ui/buttons/LikeButton"
// import SilhouetteCount from "@/components/ui/buttons/SilhouetteCount"
import ContentOverlay from "@/components/ui/cards/ContentOverlay"
/*STYLE*/
import { typography } from "@/styles/typography"
/* TYPES */
import type { OnNavigate, NavigationParams } from "@/types/navigation"
import { Moodboard } from "@/types/moodboard" 

type Props = {
  onNavigate: OnNavigate
  params?: NavigationParams["params"] | null

}
type Tab = "new" | "featured" | "following"

/* SERVICES */
import { useUserMoodboards } from "@/hooks/useUserMoodboards"

import { useCurrentUser } from "@/hooks/useCurrentUser"

/*---------------------------------------------------- */

export default function Moods({ onNavigate, params }: Props) {
  const { user: currentUser } = useCurrentUser()
  const { isOwner, userId, from} = params ?? {}

const {
  moodboards,
  isLoading,
  user: profileUser,
  setMoodboards
} = useUserMoodboards(userId)

  const [tab, setTab] = useState<Tab>(params?.fromTab ?? "new")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const byTab =
    tab === "new"
      ? moodboards
      : tab === "featured"
      ? [...moodboards].reverse()
      : moodboards.slice(0, 10)


  const filteredMoodboards =
    selectedFilters.length === 0
      ? byTab
      : byTab.filter((board) => board.tags.some((tag) => selectedFilters.includes(tag)))

  const sidebarTitle =
    isOwner
      ? "MOODS"
      : profileUser?.username
        ? `${profileUser.username} | MOODS`
        : "MOODS"

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
                    
                    from: "moods",
                    isOwner
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
        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              onNavigate?.({
                to: "profile",
                direction: "prev",
                params:{
                  isOwner,
                }
              })
            }
            className={typography.buttonBody}
          >
            back
          </button>
        </div>
      }
      footer={
          <div className="flex items-center gap-4">
            <span className="text-sm tracking-[0.2em]">
              {currentUser?.username}
            </span>             
            <ProfileButton onNavigate={onNavigate}/>
          </div>
          }
        >    
        <div className="flex flex-col h-full "> 

          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-black/30 text-xs tracking-[0.2em]">
                CHARGEMENT...
              </p>
            </div>
          ) : filteredMoodboards.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-black/30 text-xs tracking-[0.2em]">
                AUCUN MOODBOARD POUR L'INSTANT
              </p>
            </div>
          ) : (
            <ScrollableGrid
            data={filteredMoodboards}
            onItemClick={(board) => {
              onNavigate?.({
                to: "moodDetails",
                direction: "next",
                params: {
                  from: "moods",
                  moodboardId: board.id,
                  fromTab: tab,
                  isOwner,
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
                  isOwner={isOwner ?? false}
                  like={{
                    type: "moodboard",
                    id: board.id,
                    count: board.likes_count,
                    liked: board.liked_by_current_user
                  }}
                  silhouettesCount={board.silhouettes_count}
                  onDelete={() => handleDelete(board.id)}
                />
              </div>
            )}
          />
        )}
      </div>
    </BookLayout>
  )
}