"use client"

import type { OnNavigate, NavigationParams } from "@/types/navigation"

/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Sidebar from "@/components/navigation/SideBar"
import Header from "@/components/navigation/Header"
import FourSquaresGrid from "@/components/ui/grids/FourSquareGrid"
import ProfileButton from "@/components/ui/buttons/ProfileButton"

import LayoutAPreview from "./layouts/previews/LayoutAPreview"
import LayoutBPreview from "./layouts/previews/LayoutBPreview"
import LayoutCPreview from "./layouts/previews/LayoutCPreview"
import LayoutDPreview from "./layouts/previews/LayoutDPreview"

/* STYLE */
import { typography } from "@/styles/typography"
import BackButton from "@/components/ui/buttons/BackButton"
import { useCurrentUser } from "@/hooks/useCurrentUser"
/* TYPES */
type Props = {
  onNavigate: OnNavigate
  params?: NavigationParams["params"] | null
  onBack?: () => void

}

export default function Create({ onNavigate, params, onBack }: Props) {
// const { from } = params ?? {}
const { user: currentUser } = useCurrentUser()

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
            },
            {
              section: "CREATE",
              clickable: false,
              active: true,
            },
          ]}
        />
      }
      sidebar={<Sidebar text="CREATE" clickable={false} />}
      // actionsBar={
      //     <div>
  
      //     </div>
      //   )
      // }
      footerLeft={ <BackButton onBack={onBack} /> }
      footerRight={
          <div className="flex items-center gap-4">
            <span className="text-sm tracking-[0.2em]">
              {currentUser?.username}
            </span>
            <ProfileButton onNavigate={onNavigate}/>
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
                  layout: "A",
                  // from: "create",
                },
              })
            }
          >
            <div className="w-full h-full overflow-hidden bg-zinc-100">
              <LayoutAPreview />
            </div>
          </div>
        }
        
        topRight={
          <div
            className="h-full w-full cursor-pointer"
            onClick={() =>
              onNavigate({
                to: "editor",
                direction: "next",
                params: {
                  layout: "B",
                  // from: "create",
                },
              })
            }
          >
            <div className="w-full h-full overflow-hidden bg-zinc-100">
                <LayoutBPreview />
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
                  layout: "C",
                  // from: "create",
                },
              })
            }
          >
            <div className="w-full h-full overflow-hidden bg-zinc-100">
                <LayoutCPreview />
            </div>
          </div>
        }

        bottomRight={
          <div
            onClick={() =>
              onNavigate({
                to:"editor",
                direction:"next",
                params:{
                  layout:"D",
                  // from:"create"
                }
              })
            }
            className="h-full w-full cursor-pointer"
          >
            <LayoutDPreview />
          </div>
        }
      />
    </BookLayout>
  )
}