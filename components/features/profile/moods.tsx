"use client"
import { useEffect, useState } from "react"
/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Sidebar from "@/components/navigation/SideBar"
import Header from "@/components/navigation/Header"
import ScrollableGrid from "@/components/ui/grids/ScrollableGrid"
import ProfileButton from "@/components/ui/buttons/ProfileButton"
import LikeButton from "@/components/ui/buttons/LikeButton"
import SilhouetteCount from "@/components/ui/buttons/SilhouetteCount"
/*STYLE*/
import { typography } from "@/styles/typography"
/* TYPES */
import type { OnNavigate, NavigationParams } from "@/types/navigation"
import { Moodboard } from "@/types/moodboard" 
import CurrentUserName from "@/components/ui/pagination/CurrentUsername"
type Props = {
  onNavigate: OnNavigate
  params?: NavigationParams["params"] | null

}
type Tab = "new" | "featured" | "following"

/* SERVICES */
import { getMoodboardData } from "@/lib/services/moodboard"

/*---------------------------------------------------- */

export default function Moods({ onNavigate, params }: Props) {
  const { isOwner, from, requestedUser} = params ?? {}

  const profileUsername = isOwner 
    ? null 
    : requestedUser

  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>(params?.fromTab ?? "new")
  const [moodboards, setMoodboards] = useState<Moodboard[]>([])
  const [isLoading, setIsLoading] = useState(true)
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
      : profileUsername
        ? `${profileUsername} | MOODS`
        : "MOODS"


  useEffect(() => {
    let cancelled = false

    async function loadMoodboards() {
      setIsLoading(true)
      try {
        const data = await getMoodboardData(profileUsername ?? undefined)
        if (!cancelled) {
          setMoodboards(data) //met tableau dans le state
        }
      } catch {
        if (!cancelled) {
          setMoodboards([])
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }
    loadMoodboards()
    return () => {
      cancelled = true
    }

  }, [profileUsername])

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
                    
                    requestedUser,
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
                  
                  requestedUser,
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
            <CurrentUserName />
            <ProfileButton onNavigate={onNavigate}/>
          </div>
          }
        >    
        <div className="flex flex-col h-full "> 

        {isLoading ? (
          <p className="text-center text-black/30 text-xs mt-10 tracking-[0.2em]">
            CHARGEMENT...
          </p>
        ) : filteredMoodboards.length === 0 ? (
          <p className="text-center text-black/30 text-xs mt-10 tracking-[0.2em]">
            AUCUN MOODBOARD POUR L'INSTANT
          </p>
        ) : (
          <ScrollableGrid
            data={filteredMoodboards}
            onItemClick={(board) => {
              onNavigate?.({
                to: "moodDetails",
                direction: "next",
                params: {
                  requestedUser,
                  from: "moods",
                  moodboard: board,
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

                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 py-1 bg-black/40 text-white">
                      <LikeButton
                        type="moodboard"
                        className={typography.buttonBody}
                        id={board.id}
                        initialCount={board.likes_count}
                        initialLiked={board.liked_by_current_user}
                        disabled={true}
                      />
                      <SilhouetteCount count={board.silhouettes_count} />
                </div>
              </div>
            )}
          />
        )}
      </div>
    </BookLayout>
  )
}