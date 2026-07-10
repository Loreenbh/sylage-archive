"use client"
import { useEffect, useState } from "react"
import type { OnNavigate, NavigationParams } from "@/types/navigation"
/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Sidebar from "@/components/navigation/SideBar"
import Header from "@/components/navigation/Header"
import ScrollableGrid from "@/components/ui/grids/ScrollableGrid"
import ProfileButton from "@/components/ui/buttons/ProfileButton"
/*STYLE*/
import { typography } from "@/styles/typography"
/* TYPES */
type Props = {
  onNavigate: OnNavigate
  params?: NavigationParams["params"] | null

}
type Tab = "new" | "featured" | "following"

type Moodboard = {
  id: number
  user_id: number
  username: string
  image_url: string
  tags: string[]
  created_at: string
}
/*---------------------------------------------------- */

export default function Moods({ onNavigate, params }: Props) {


const { isOwner: mode, user} = params ?? {}

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
    mode
      ? "MOODS"
      : user
        ? `${user} | Moods`
        : "Moods"


  useEffect(() => {
    async function loadMoodboards() {
      try {
        setIsLoading(true)

        const res = await fetch(`/api/moodboards?user=${user}`)
        const data = await res.json()

        setMoodboards(data)

      } catch {
        setMoodboards([])
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      loadMoodboards()
    } else {
      setIsLoading(false)
    }

  }, [user])

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
                    user,
                    isOwner: false
                  }
                })
            },
            { section: "FILTER",
              clickable: true,
             },
            { section: "CREATE",
              clickable: true,
              onClick: () => console.log("create clicked"),
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
                  user,
                  isOwner: mode
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
        <ProfileButton onNavigate={onNavigate} />
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
                  user: String(board.username),
                  from: "moods",
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
              </div>
            )}
          />
        )}
      </div>
    </BookLayout>
  )
}