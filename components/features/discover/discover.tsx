"use client"
import { useEffect, useState } from "react"
import type { OnNavigate, NavigationParams } from "@/types/navigation"

/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Sidebar from "@/components/navigation/SideBar"
import Header from "@/components/navigation/Header"
import ScrollableGrid from "@/components/ui/grids/ScrollableGrid"
import ProfileButton from "@/components/ui/buttons/ProfileButton"
import CurrentUserName from "@/components/ui/pagination/CurrentUserName"
import LikeButton from "@/components/ui/buttons/LikeButton"
/*STYLE*/
import { typography } from "@/styles/typography"

/* TYPES */
import { Moodboard } from "@/types/moodboard"
type Props = {
  onNavigate: OnNavigate
  params?: NavigationParams["params"] | null
}
type Tab = "new" | "featured" | "following"

/*---------------------------------------------------- */

export default function Discover({ onNavigate, params }: Props) {
  const currentUser = params?.currentUser
  console.log("PREMIRE FOIS USER EST", currentUser)
  const mode = params?.isOwner ?? false

  const [tab, setTab] = useState<Tab>(params?.fromTab ?? "new")
  const [moodboards, setMoodboards] = useState<Moodboard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  useEffect(() => {
    let cancelled = false

    async function loadMoodboards() {
      setIsLoading(true)
      try {
        const res = await fetch("/api/moodboards")
        const data = await res.json()
        if (!cancelled) setMoodboards(data)
      } catch {
        if (!cancelled) setMoodboards([])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadMoodboards()
    return () => {
      cancelled = true
    }
  }, [])

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

  const sidebarTitle = tab.toUpperCase()
  console.log("DISCOVER:", currentUser)
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
              onClick: () => console.log("filter clicked"),
             },
            { section: "CREATE",
              clickable: true,
                onClick: () =>
                onNavigate?.({
                  to: "create",
                  direction: "next",
                  params:{
                    currentUser,
                    from: "discover",
                    isOwner: mode
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
            onClick={ () => setTab("new")}
            className={typography.buttonBody}>new</button>
          <span className={typography.bullet}>•</span>
          <button
            onClick={ () => setTab("featured")}
            className={typography.buttonBody}>featured</button>
          <span className={typography.bullet}>•</span>

          <button 
            onClick={ () => setTab("following")}
            className={typography.buttonBody}>following</button>
        </div>
      }
      footer={
          <div className="flex items-center gap-4">
            <CurrentUserName />
            <ProfileButton onNavigate={onNavigate} currentUser={currentUser}/>
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
                  currentUser,
                  requestedUser: String(board.username),
                  from: "discover",
                  moodboard: board,
                  fromTab: tab,
                  isOwner: mode
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

                <p className="absolute bottom-2 left-2 text-[9px] tracking-[0.2em] text-white drop-shadow">
                  {board.username}
                </p>

                <LikeButton className="absolute left-2"
                  initialCount={0}
                  initialLiked={false}
                />
              </div>
            )}
          />
        )}

      </div>
    </BookLayout>
  )
}