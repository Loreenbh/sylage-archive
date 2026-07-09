"use client"
import { useState } from "react"
import type { OnNavigate, NavigationParams } from "@/types/navigation"

/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Sidebar from "@/components/navigation/SideBar"
import Header from "@/components/navigation/Header"
import ThreeColGrid from "@/components/ui/grids/ThreeColGrid"
import ProfileButton from "@/components/ui/buttons/ProfileButton"
import GridPager from "@/components/ui/pagination/GridPager"

/* STYLE */
import { typography } from "@/styles/typography"

type Props = {
  onNavigate: OnNavigate
  params?: NavigationParams["params"] | null
}

export default function Silhouettes({ onNavigate, params }: Props) {
  const silhouettes = [
  { id: 1, color: "bg-white-200" },
  { id: 2, color: "bg-red-300" },
  { id: 3, color: "bg-pink-400" },
  { id: 4, color: "bg-yellow-500" },
  { id: 5, color: "bg-purple-600" },
  { id: 6, color: "bg-blue-700" },
]
const [index, setIndex] = useState(0)

const left = silhouettes[index]
const center = silhouettes[index + 1]
const right = silhouettes[index + 2]

const handlePrev = () => {
  setIndex((i) => Math.max(i - 1, 0))
}

const handleNext = () => {
  setIndex((i) => Math.min(i + 1, silhouettes.length - 3))
}

// const mode = params?.isOwner
// const user = params?.user
const { isOwner: mode, user} = params ?? {}
const sidebarTitle =
  mode
    ? "SILHOUETTES"
    : user
      ? `${user} | SILHOUETTES`
      : "SILHOUETTES"

  return (
    <BookLayout
      header={
        <Header
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
              onClick: () => console.log("filter clicked"),
             },
            { section: "CREATE",
              clickable: true,
              onClick: () => console.log("create clicked"),
             },
          ]}
        />
      }
      sidebar={<Sidebar text={sidebarTitle} clickable={false} />}
      actionsBar={
        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              onNavigate?.({
                to: "profile",
                direction: "prev",
                params:{
                  user,
                  isOwner : mode,
                  from: "silhouettes"
                }
              })
            }
            className={typography.buttonBody}
          >
            back
          </button>

          <GridPager
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </div>
      }
      footer={
        <ProfileButton onNavigate={onNavigate} />
      }
    >
      <div className="flex flex-col h-full min-h-0 gap-1">

      <ThreeColGrid
        left={
          <div className={`h-full w-full ${left.color} relative`}>
          </div>
        }
        center={
          <div className={`h-full w-full ${center.color}`} />
          
        }
        right={
          <div className={`h-full w-full ${right.color}`} />
        }
      />

      </div>
    </BookLayout>
  )
}