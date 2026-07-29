"use client"
import type { OnNavigate } from "@/types/navigation"

/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Sidebar from "@/components/navigation/SideBar"
import Header from "@/components/navigation/Header"
import LovesGrid from "@/components/ui/grids/LovesGrid"
import ProfileButton from "@/components/ui/buttons/ProfileButton"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import BackButton from "@/components/ui/buttons/BackButton"

/* STYLE */
import { typography } from "@/styles/typography"

type Props = {
  onNavigate: OnNavigate
  onBack?: () => void
}

export default function Loves({ onNavigate, onBack }: Props) {
  const { user: currentUser } = useCurrentUser()
  
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
                })
            },
            { section: "FILTER",
              clickable: false,
             },
            { section: "CREATE",
              clickable: true,
              onClick: () =>
                onNavigate?.({
                  to: "create",
                  direction: "next",
                }),
             },
          ]}
        />
      }
      sidebar={<Sidebar text="REFERENCES" clickable={false} />}
      actionsBar={
        <div className="flex w-full items-center justify-between">
          <button className={typography.buttonBody}>
            Back
          </button>
          <button className={typography.buttonBody}>
            Next
          </button>
        </div>
      }
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
      <div className="flex flex-col h-full min-h-0 gap-1">

        <LovesGrid
            left={
                <button className="relative h-full w-full bg-zinc-200 flex items-end p-4">
                </button>
            }

            topRight={
                <button className="h-full w-full bg-zinc-300 flex items-end p-4">
                top right
                </button>
            }

            bottomRight={
                <button className="h-full w-full bg-zinc-400 flex items-end p-4">
                bottom right
                </button>
            }
            />
      </div>
    </BookLayout>
  )
}