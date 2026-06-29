"use client"
import { useState } from "react"
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
/*---------------------------------------------------- */

export default function Discover({ onNavigate, params }: Props) {
  const user = params?.user
  const mode = params?.isOwner ?? false

// const { isOwner: mode = false, user} = params ?? {}

  const [tab, setTab] = useState<Tab>(params?.fromTab ?? "new")
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const moodboards = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    user: `user_${String(i + 1).padStart(2, "0")}`,
    color: ["bg-zinc-200", "bg-zinc-300", "bg-zinc-400"][i % 3],
  }))
  const filteredMoodboards =
  tab === "new"
    ? moodboards
    : tab === "featured"
    ? [...moodboards].reverse()
    : moodboards.slice(0, 10)

  const sidebarTitle = tab.toUpperCase()

  console.log("dans discover mode est:", mode)
  return (
    <BookLayout
      header={
        <Header
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
                    user,
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
        <ProfileButton onNavigate={onNavigate} />
      }
    >    
      <div className="flex flex-col h-full "> 
        {/* GRID */}
        <ScrollableGrid
          data={filteredMoodboards}
          onItemClick={(board) => {
            setSelectedUser(board.user)
            onNavigate?.({
              to: "moodDetails",
              direction: "next",
              params: {
                user: board.user,
                from: "discover",
                fromTab: tab,
                isOwner: mode
              },
            })
          }}
          renderItem={(board) => (
            <div className="relative aspect-square w-full bg-zinc-100 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300" />

              <p className="absolute bottom-2 left-2 text-[9px] tracking-[0.2em] text-black/30">
                {board.user}
              </p>

            </div>
          )}
        />
      </div>
    </BookLayout>
  )
}