"use client"
import type { OnNavigate } from "@/types/navigation"

/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Sidebar from "@/components/layout/SideBar"
import Header from "@/components/layout/Header"
import ThreeColGrid from "@/components/ui/grids/ThreeColGrid"
import ProfileButton from "@/components/ui/buttons/ProfileButton"

/* STYLE */
import { typography } from "@/styles/typography"

type Props = {
  onNavigate: OnNavigate
}

export default function Silhouettes({ onNavigate }: Props) {
  return (
    <BookLayout
      header={
        <Header
          items={[
            { label: "HOME" },
            { label: "FILTER" },
            { label: "CREATE" },
          ]}
        />
      }
      sidebar={<Sidebar text="SILHOUETTES" clickable={false} />}
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

        <ThreeColGrid
          left={
            <button
              onClick={() =>
                onNavigate?.({ to: "discover", direction: "next" })
              }
              className="
                relative
                h-full w-full bg-zinc-200
                flex items-end p-4 text-left

                transition-all duration-300
                hover:translate-y-[-2px]
                hover:shadow-sm
                hover:bg-zinc-300
              "
            >
              {/*HEART*/}
              <div className="absolute top-2 right-2 text-white/80 hover:text-white transition text-[40px]">
                ♡
              </div>
            </button>
          }
          center={
            <button
              className="
                h-full w-full bg-zinc-300
                flex items-end p-4 text-left

                transition-all duration-300
                hover:translate-y-[-2px]
                hover:shadow-sm
              "
            >
            </button>
          }
          right={
            <button
              className="
                h-full w-full bg-zinc-400
                flex items-end p-4 text-left

                transition-all duration-300
                hover:translate-y-[-2px]
                hover:shadow-sm
              "
            >
            </button>
          }
        />

      </div>
    </BookLayout>
  )
}