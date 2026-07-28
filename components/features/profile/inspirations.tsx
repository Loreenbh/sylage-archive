"use client"
import type { OnNavigate } from "@/types/navigation"

/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Sidebar from "@/components/navigation/SideBar"
import Header from "@/components/navigation/Header"
import LovesGrid from "@/components/ui/grids/LovesGrid"
import ProfileButton from "@/components/ui/buttons/ProfileButton"
import GridPager from "@/components/ui/pagination/GridPager"

/* STYLE */
import { typography } from "@/styles/typography"

type Props = {
  onNavigate: OnNavigate
}

export default function Loves({ onNavigate }: Props) {
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
                  params:{
                    from: "discover",
                  }
                }),
             },
          ]}
        />
      }
      sidebar={<Sidebar text="LOVES" clickable={false} />}
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
      footer={
        <ProfileButton onNavigate={onNavigate} />
      }
    >
      <div className="flex flex-col h-full min-h-0 gap-1">

        <LovesGrid
            left={
                <button className="relative h-full w-full bg-zinc-200 flex items-end p-4">
                <div className="absolute top-2 right-2 text-white/80 text-[40px]">
                    ♡
                </div>
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