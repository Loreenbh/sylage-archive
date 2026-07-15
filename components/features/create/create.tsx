"use client"

import type { OnNavigate, NavigationParams } from "@/types/navigation"

/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Sidebar from "@/components/navigation/SideBar"
import Header from "@/components/navigation/Header"
import FourSquaresGrid from "@/components/ui/grids/FourSquareGrid"
import ProfileButton from "@/components/ui/buttons/ProfileButton"
import CurrentUserName from "@/components/ui/pagination/CurrentUserName"

import LayoutA from "../moodboards/LayoutA"
import LayoutB from "../moodboards/LayoutB"
import LayoutC from "../moodboards/LayoutC"
import LayoutD from "../moodboards/LayoutD"

/* STYLE */
import { typography } from "@/styles/typography"

/* TYPES */
type Props = {
  onNavigate: OnNavigate
  params?: NavigationParams["params"] | null
}


export default function Create({ onNavigate, params }: Props) {
    const {
    currentUser,
    requestedUser
  } = params ?? {}
  const profileUsername = requestedUser ?? currentUser
const { isOwner: mode, fromTab, from} = params ?? {}
  console.log("CREATE", profileUsername)
  return (
    <BookLayout
      header={
        <Header
          items={[
            {
              section: "HOME",
              clickable: true,
              onClick: () =>
                onNavigate({
                  to: "discover",
                  direction: "prev",
                }),
            },
            {
              section: "FILTER",
              clickable: false,
              onClick: () => console.log("filter clicked"),
            },
            {
              section: "CREATE",
              clickable: false,
              active: true,
              // onClick: () => console.log("create clicked"),
            },
          ]}
        />
      }
      sidebar={<Sidebar text="CREATE" clickable={false} />}
      actionsBar={
        from != "discover" && (
          <div className="flex w-full items-center justify-between">
            <button
              onClick={() =>
                onNavigate({
                  to: from ?? "discover",
                  direction: "prev",
                })
              }
              className={typography.buttonBody}
            >
              back
            </button>
          </div>
        )
      }
      footer={
          <div className="flex items-center gap-4">
            <CurrentUserName />
            <ProfileButton onNavigate={onNavigate} currentUser={currentUser}/>
          </div>
          }
        >    
      <FourSquaresGrid
        topLeft={
          <div
            className="h-full w-full cursor-pointer"
            onClick={() =>
              onNavigate({
                to: "editor",
                direction: "next",
                params: {
                  currentUser,
                  layout: "A",
                  from: "create",
                },
              })
            }
          >
            <div className="w-full h-full overflow-hidden bg-zinc-100">
              <LayoutA images={Array(9).fill(null)} />
            </div>
          </div>
        }
        
        topRight={
          <div
            className="h-full w-full bg-zinc-300 hover:bg-zinc-400 transition"
            onClick={() =>
              onNavigate({
                to: "editor",
                direction: "next",
                params: {
                  currentUser,
                  layout: "B",
                  from: "create",
                },
              })
            }
          >
            <div className="w-full h-full overflow-hidden bg-zinc-100">
                <LayoutB images={Array(7).fill(null)} />
            </div>
          </div>
        }

        bottomLeft={
          <div
            className="h-full w-full bg-zinc-400 hover:bg-zinc-500 transition"
            onClick={() =>
              onNavigate({
                to: "editor",
                direction: "next",
                params: {
                  currentUser,
                  layout: "C",
                  from: "create",
                },
              })
            }
          >
            <div className="w-full h-full overflow-hidden bg-zinc-100">
                <LayoutC images={Array(6).fill(null)} />
            </div>
          </div>
        }

        bottomRight={
          <div
            className="h-full w-full bg-zinc-500 hover:bg-zinc-600 transition"
            onClick={() =>
              onNavigate({
                to: "editor",
                direction: "next",
                params: {
                  currentUser,
                  layout: "D",
                  from: "create",

                },
              })
            }
          >
            <div className="w-full h-full overflow-hidden bg-zinc-100">
                <LayoutD images={Array(6).fill(null)} />
            </div>
          </div>
        }
      />
    </BookLayout>
  )
}